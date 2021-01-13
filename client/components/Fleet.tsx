import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useMutation, useQueryCache } from 'react-query'
import useAuthorization from '../hooks/useAuthorization'
import useCurrentUser from '../hooks/useCurrentUser'
import IconButton from '../ui/IconButton'
import HeartFilledIcon from '../ui/icons/HeartFilledIcon'
import HeartIcon from '../ui/icons/HeartIcon'
import ReplyIcon from '../ui/icons/ReplyIcon'
import { BASE_URL } from '../utils/config'
import { FleetType } from './Timeline'

interface Props {
	fleet: FleetType
}

const Fleet = ({ fleet }: Props) => {
	const auth = useAuthorization()
	const user = useCurrentUser()
	const queryCache = useQueryCache()
	const { pathname } = useRouter()

	// TODO: make this cleaner
	const likeHandler = async () => {
		try {
			if (!fleet.likers.includes(user.id!)) {
				await axios.post(
					`${BASE_URL}/fleet/like/${fleet.id}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${auth.token}`,
						},
					}
				)
			} else {
				await axios.post(
					`${BASE_URL}/fleet/unlike/${fleet.id}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${auth.token}`,
						},
					}
				)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const [mutate] = useMutation(likeHandler, {
		onSuccess: () => {
			if (pathname.startsWith('/home')) {
				queryCache.refetchQueries('fleets')
			} else if (pathname.startsWith('/profile')) {
				queryCache.refetchQueries('profile-fleets')
			}
		},
	})

	return (
		<div className='w-3/4 px-2 pt-2 mx-auto border border-gray-700 rounded-lg shadow-xl'>
			<div className='flex space-x-1'>
				<Link href={`/profile/${fleet.author.id}`}>
					<a className='flex items-center justify-center flex-shrink-0 w-10 h-10 mt-2 mr-2 overflow-hidden rounded-full'>
						<img src='http://github.com/kesne.png' alt='profile-photo' />
					</a>
				</Link>
				<div>
					<Link href={`/profile/${fleet.author.id}`}>
						<a className='text-base font-bold text-white'>
							{fleet.author.displayName}{' '}
							<span className='font-normal text-gray-400'>@{fleet.author.username}</span>
							{' • '}
							<span className='text-sm font-normal text-gray-400'>
								{formatDistanceToNow(new Date(fleet.createdAt))}
							</span>
						</a>
					</Link>
					<div className='text-sm text-white break-all'>{fleet.body}</div>
				</div>
			</div>
			<div className='flex items-center w-full h-6 justify-evenly'>
				<IconButton
					onClick={() => {}}
					className='text-white rounded-full hover:bg-gray-700 hover:text-green-500'
				>
					<ReplyIcon className='w-4 h-4' />
				</IconButton>
				<div className='flex items-center'>
					<IconButton
						onClick={mutate}
						className='text-white rounded-full hover:bg-gray-700 hover:text-green-500'
					>
						{fleet.likers.includes(user.id!) ? (
							<HeartFilledIcon className='w-4 h-4' />
						) : (
							<HeartIcon className='w-4 h-4' />
						)}
					</IconButton>
					<span className='text-base text-white'>{fleet.likes}</span>
				</div>
			</div>
		</div>
	)
}

export default Fleet
