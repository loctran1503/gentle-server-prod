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
exports.BillProduct = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Bill_1 = require("./Bill");
let BillProduct = class BillProduct extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BillProduct.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillProduct.prototype, "productName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillProduct.prototype, "productThumbnail", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillProduct.prototype, "productType", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BillProduct.prototype, "productPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BillProduct.prototype, "productAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], BillProduct.prototype, "priceIdForLocal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BillProduct.prototype, "countryNameForDeliveryPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => Bill_1.Bill),
    (0, typeorm_1.ManyToOne)(() => Bill_1.Bill, item => item.billProducts),
    __metadata("design:type", Bill_1.Bill)
], BillProduct.prototype, "bill", void 0);
BillProduct = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], BillProduct);
exports.BillProduct = BillProduct;
//# sourceMappingURL=BillProduct.js.map