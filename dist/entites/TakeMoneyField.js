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
exports.TakeMoneyField = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let TakeMoneyField = class TakeMoneyField extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TakeMoneyField.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], TakeMoneyField.prototype, "accoutName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TakeMoneyField.prototype, "accountNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TakeMoneyField.prototype, "accountBankName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TakeMoneyField.prototype, "cancelReason", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TakeMoneyField.prototype, "money", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TakeMoneyField.prototype, "isSuccessImage", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: "" }),
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], TakeMoneyField.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.takeMoneyField),
    __metadata("design:type", User_1.User)
], TakeMoneyField.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TakeMoneyField.prototype, "createdAt", void 0);
TakeMoneyField = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], TakeMoneyField);
exports.TakeMoneyField = TakeMoneyField;
//# sourceMappingURL=TakeMoneyField.js.map