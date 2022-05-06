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
exports.BrandResponse = void 0;
const Brand_1 = require("../../entites/Brand");
const type_graphql_1 = require("type-graphql");
const IResponse_1 = require("./IResponse");
const ProductKind_1 = require("../../entites/ProductKind");
let BrandResponse = class BrandResponse {
};
__decorate([
    (0, type_graphql_1.Field)(_return => ProductKind_1.ProductKind, { nullable: true }),
    __metadata("design:type", ProductKind_1.ProductKind)
], BrandResponse.prototype, "kind", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [Brand_1.Brand], { nullable: true }),
    __metadata("design:type", Array)
], BrandResponse.prototype, "brands", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => Brand_1.Brand, { nullable: true }),
    __metadata("design:type", Brand_1.Brand)
], BrandResponse.prototype, "brandWithProduct", void 0);
BrandResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IResponse_1.IResponse })
], BrandResponse);
exports.BrandResponse = BrandResponse;
//# sourceMappingURL=BrandResponse.js.map