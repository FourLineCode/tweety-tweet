import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getManager } from 'typeorm'
import Fleet from '../entity/Fleet'
import Follow from '../entity/Follow'
import User from '../entity/User'
import auth from '../middlewares/auth'
import fleetSchema from '../validation/fleetSchema'

const router = Router()

// Get all fleets
router.get('/', auth, async (req, res, next) => {
	try {
		const fleets =
			(await getManager()
				.getRepository(Fleet)
				.createQueryBuilder('fleet')
				.leftJoinAndSelect('fleet.author', 'author')
				.select(['fleet', 'author.id', 'author.username', 'author.displayName', 'author.isAdmin'])
				.getMany()) || []

		res.status(StatusCodes.OK).json(fleets.reverse())
	} catch (error) {
		next(error)
	}
})

// Get home page fleets for user
router.get('/home', auth, async (req, res, next) => {
	try {
		const fleets =
			(await getManager()
				.getRepository(Fleet)
				.createQueryBuilder('fleet')
				.leftJoinAndSelect('fleet.author', 'author')
				.select(['fleet', 'author.id', 'author.username', 'author.displayName', 'author.isAdmin'])
				.getMany()) || []

		const followedUsers = await getManager()
			.getRepository(Follow)
			.createQueryBuilder('follow')
			.leftJoinAndSelect('follow.from', 'from')
			.select(['from.id'])
			.where('from.id = :id', { id: req.userId })
			.leftJoinAndSelect('follow.to', 'to')
			.select(['to.id'])
			.getMany()
		const followedUserIds = followedUsers.map((follow) => String(follow.to.id))
		followedUserIds.push(String(req.userId))

		const filteredFleets = fleets.filter((fleet) => followedUserIds.includes(String(fleet.author.id)))

		res.status(StatusCodes.OK).json(filteredFleets.reverse())
	} catch (error) {
		next(error)
	}
})

// Get one fleet
router.get('/post/:id', auth, async (req, res, next) => {
	try {
		const fleet =
			(await getManager()
				.getRepository(Fleet)
				.createQueryBuilder('fleet')
				.where('fleet.id = :id', { id: req.params.id })
				.leftJoinAndSelect('fleet.author', 'author')
				.select(['fleet', 'author.id', 'author.username', 'author.displayName', 'author.isAdmin'])
				.getMany()) || []

		if (!fleet) {
			res.status(StatusCodes.BAD_REQUEST)
			throw new Error('Fleet not found')
		}

		res.status(StatusCodes.OK).json(fleet)
	} catch (error) {
		next(error)
	}
})

// Get fleets for one user by id
router.get('/timeline/:id', auth, async (req, res, next) => {
	try {
		const user = await getManager()
			.getRepository(User)
			.createQueryBuilder('user')
			.where('user.id = :id', { id: req.params.id })
			.leftJoinAndSelect('user.fleets', 'fleets')
			.select(['user', 'fleets'])
			.getOne()

		const fleets = user?.fleets || []

		res.status(StatusCodes.OK).json(fleets.reverse())
	} catch (error) {
		next(error)
	}
})

// Post a fleet
router.post('/', auth, async (req, res, next) => {
	try {
		const fleet = req.body
		const { error } = fleetSchema.validate(fleet)
		if (error) {
			const [err] = error.details
			res.status(StatusCodes.BAD_REQUEST)
			throw err
		}

		const newFleet = await Fleet.create({
			body: fleet.body,
			author: req.user,
			likers: [],
		})

		const savedFleet = await newFleet.save()

		res.status(StatusCodes.OK).json({ success: true, id: savedFleet.id })
	} catch (error) {
		next(error)
	}
})

// Like a fleet
router.post('/like/:id', auth, async (req, res, next) => {
	try {
		const fleet = await Fleet.findOne({ id: req.params.id })

		if (!fleet) {
			res.status(StatusCodes.BAD_REQUEST)
			throw new Error('Fleet not found')
		}

		if (fleet.likers?.includes(req.userId)) {
			res.status(StatusCodes.BAD_REQUEST)
			throw new Error('User already liked this fleet')
		}

		await getManager()
			.getRepository(Fleet)
			.createQueryBuilder()
			.update()
			.set({
				likers: [...fleet.likers, req.userId],
				likes: () => 'likes + 1',
			})
			.where('id = :id', { id: req.params.id })
			.execute()

		res.status(StatusCodes.OK).json({ success: true })
	} catch (error) {
		next(error)
	}
})

// Unlike a fleet
router.post('/unlike/:id', auth, async (req, res, next) => {
	try {
		const fleet = await Fleet.findOne({ id: req.params.id })

		if (!fleet) {
			res.status(StatusCodes.BAD_REQUEST)
			throw new Error('Fleet not found')
		}

		if (!fleet.likers?.includes(req.userId)) {
			res.status(StatusCodes.BAD_REQUEST)
			throw new Error('User has not liked this fleet')
		}

		await getManager()
			.getRepository(Fleet)
			.createQueryBuilder()
			.update()
			.set({
				likers: fleet.likers.filter((user) => JSON.stringify(user) !== JSON.stringify(req.userId)),
				likes: () => 'likes - 1',
			})
			.where('id = :id', { id: req.params.id })
			.execute()

		res.status(StatusCodes.OK).json({ success: true })
	} catch (error) {
		next(error)
	}
})

export default router
