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
exports.Customer = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Bill_1 = require("./Bill");
const BillCancelReason_1 = require("./BillCancelReason");
let Customer = class Customer extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "customerName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "customerPhone", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "province", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "rejectedAmount", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [Bill_1.Bill]),
    (0, typeorm_1.OneToMany)(() => Bill_1.Bill, (bill) => bill.customer),
    __metadata("design:type", Array)
], Customer.prototype, "bills", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [BillCancelReason_1.BillCancelReason], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => BillCancelReason_1.BillCancelReason, (bill) => bill.customer, { nullable: true }),
    __metadata("design:type", Array)
], Customer.prototype, "billCancelReason", void 0);
Customer = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=Customer.js.map