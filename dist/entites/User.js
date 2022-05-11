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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Bill_1 = require("./Bill");
const MoneyBonus_1 = require("./MoneyBonus");
const TakeMoneyField_1 = require("./TakeMoneyField");
const UserComment_1 = require("./UserComment");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "userAvatar", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "introduceCode", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "paidAmount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isHidden", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "moneyDepot", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [Bill_1.Bill], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Bill_1.Bill, bill => bill.user, { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "bills", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [MoneyBonus_1.MoneyBonus], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => MoneyBonus_1.MoneyBonus, item => item.user, { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "moneyBonuses", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [TakeMoneyField_1.TakeMoneyField], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => TakeMoneyField_1.TakeMoneyField, item => item.user, { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "takeMoneyField", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [UserComment_1.UserComment], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => UserComment_1.UserComment, item => item.user, { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: "date" }),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map