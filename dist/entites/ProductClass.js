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
exports.ProductClass = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Brand_1 = require("./Brand");
const Product_1 = require("./Product");
const ProductKind_1 = require("./ProductKind");
let ProductClass = class ProductClass extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductClass.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductClass.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [Product_1.Product], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Product_1.Product, product => product.class, { nullable: true }),
    __metadata("design:type", Array)
], ProductClass.prototype, "products", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => ProductKind_1.ProductKind),
    (0, typeorm_1.ManyToOne)(() => ProductKind_1.ProductKind, item => item.productClasses),
    __metadata("design:type", ProductKind_1.ProductKind)
], ProductClass.prototype, "kind", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [Brand_1.Brand]),
    (0, typeorm_1.ManyToMany)(() => Brand_1.Brand, item => item.productClasses),
    __metadata("design:type", Array)
], ProductClass.prototype, "brands", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductClass.prototype, "createdAt", void 0);
ProductClass = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], ProductClass);
exports.ProductClass = ProductClass;
//# sourceMappingURL=ProductClass.js.map