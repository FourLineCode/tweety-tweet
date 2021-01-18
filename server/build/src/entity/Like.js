"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Fleet_1 = __importDefault(require("./Fleet"));
const InternalEntity_1 = __importDefault(require("./InternalEntity"));
const User_1 = __importDefault(require("./User"));
let Like = class Like extends InternalEntity_1.default {
};
__decorate([
    typeorm_1.ManyToOne(() => User_1.default, (user) => user.likedFleets, { onDelete: 'CASCADE' }),
    __metadata("design:type", User_1.default)
], Like.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Fleet_1.default, (fleet) => fleet.likes, { onDelete: 'CASCADE' }),
    __metadata("design:type", Fleet_1.default)
], Like.prototype, "fleet", void 0);
Like = __decorate([
    typeorm_1.Entity()
], Like);
exports.default = Like;