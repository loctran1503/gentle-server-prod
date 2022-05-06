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
exports.Bill = void 0;
const BillStatusType_1 = require("../types/others/BillStatusType");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const BillProduct_1 = require("./BillProduct");
const Customer_1 = require("./Customer");
const User_1 = require("./User");
let Bill = class Bill extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bill.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Bill.prototype, "notice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bill.prototype, "paymentType", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => User_1.User, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.bills, { nullable: true }),
    __metadata("design:type", User_1.User)
], Bill.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Bill.prototype, "introduceCode", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Bill.prototype, "deliveryPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Bill.prototype, "paymentDown", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Bill.prototype, "isCommented", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: BillStatusType_1.BillStatusType.COMFIRM_WAITING }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BillStatusType_1.BillStatusType,
        default: BillStatusType_1.BillStatusType.COMFIRM_WAITING
    }),
    __metadata("design:type", String)
], Bill.prototype, "billStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => Customer_1.Customer),
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, customer => customer.bills),
    __metadata("design:type", Customer_1.Customer)
], Bill.prototype, "customer", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [BillProduct_1.BillProduct]),
    (0, typeorm_1.OneToMany)(() => BillProduct_1.BillProduct, item => item.bill),
    __metadata("design:type", Array)
], Bill.prototype, "billProducts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: "date" }),
    __metadata("design:type", String)
], Bill.prototype, "createdAt", void 0);
Bill = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Bill);
exports.Bill = Bill;
//# sourceMappingURL=Bill.js.map