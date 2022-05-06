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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareProduct = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const SkincareBrand_1 = require("./SkincareBrand");
const UserComment_1 = require("./UserComment");
let SkincareProduct = class SkincareProduct extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SkincareProduct.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SkincareProduct.prototype, "productName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SkincareProduct.prototype, "thumbnail", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [String]),
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], SkincareProduct.prototype, "imgDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SkincareProduct.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SkincareProduct.prototype, "priceToDisplay", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], SkincareProduct.prototype, "sales", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [UserComment_1.UserComment], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => UserComment_1.UserComment, (comment) => comment.product, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], SkincareProduct.prototype, "comments", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.ManyToOne)(() => SkincareBrand_1.SkincareBrand, (brand) => brand.skincareProducts),
    __metadata("design:type", typeof (_a = typeof SkincareBrand_1.SkincareBrand !== "undefined" && SkincareBrand_1.SkincareBrand) === "function" ? _a : Object)
], SkincareProduct.prototype, "brand", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SkincareProduct.prototype, "createdAt", void 0);
SkincareProduct = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], SkincareProduct);
exports.SkincareProduct = SkincareProduct;
//# sourceMappingURL=SkincareProduct.js.map