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
exports.Product = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Brand_1 = require("./Brand");
const Price_1 = require("./Price");
const ProductClass_1 = require("./ProductClass");
const ProductKind_1 = require("./ProductKind");
const UserComment_1 = require("./UserComment");
let Product = class Product extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Product.prototype, "productName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "thumbnail", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [String]),
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], Product.prototype, "imgDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "priceToDisplay", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "sales", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [Price_1.Price]),
    (0, typeorm_1.OneToMany)(() => Price_1.Price, (price) => price.product),
    __metadata("design:type", Array)
], Product.prototype, "prices", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [UserComment_1.UserComment], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => UserComment_1.UserComment, (comment) => comment.product, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "comments", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => Brand_1.Brand),
    (0, typeorm_1.ManyToOne)(() => Brand_1.Brand, (brand) => brand.products),
    __metadata("design:type", Brand_1.Brand)
], Product.prototype, "brand", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => ProductKind_1.ProductKind),
    (0, typeorm_1.ManyToOne)(() => ProductKind_1.ProductKind, kind => kind.products),
    __metadata("design:type", ProductKind_1.ProductKind)
], Product.prototype, "kind", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => ProductClass_1.ProductClass),
    (0, typeorm_1.ManyToOne)(() => ProductClass_1.ProductClass, item => item.products),
    __metadata("design:type", ProductClass_1.ProductClass)
], Product.prototype, "class", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
Product = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map