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
exports.ProductKind = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Country_1 = require("./Country");
const Product_1 = require("./Product");
const ProductClass_1 = require("./ProductClass");
let ProductKind = class ProductKind extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductKind.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductKind.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [ProductClass_1.ProductClass], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => ProductClass_1.ProductClass, item => item.kind, { nullable: true }),
    __metadata("design:type", Array)
], ProductKind.prototype, "productClasses", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [Product_1.Product], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Product_1.Product, product => product.kind, { nullable: true }),
    __metadata("design:type", Array)
], ProductKind.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Country_1.Country),
    (0, typeorm_1.JoinTable)(),
    (0, type_graphql_1.Field)(_return => [Country_1.Country]),
    __metadata("design:type", Array)
], ProductKind.prototype, "countries", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductKind.prototype, "createdAt", void 0);
ProductKind = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: "product_kind" })
], ProductKind);
exports.ProductKind = ProductKind;
//# sourceMappingURL=ProductKind.js.map