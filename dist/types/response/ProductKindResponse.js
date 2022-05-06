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
exports.ProductKindResponse = void 0;
const ProductClass_1 = require("../../entites/ProductClass");
const type_graphql_1 = require("type-graphql");
const ProductKind_1 = require("../../entites/ProductKind");
const IResponse_1 = require("./IResponse");
let ProductKindResponse = class ProductKindResponse {
};
__decorate([
    (0, type_graphql_1.Field)(_return => ProductKind_1.ProductKind, { nullable: true }),
    __metadata("design:type", ProductKind_1.ProductKind)
], ProductKindResponse.prototype, "kind", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [ProductClass_1.ProductClass], { nullable: true }),
    __metadata("design:type", Array)
], ProductKindResponse.prototype, "classes", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [ProductKind_1.ProductKind], { nullable: true }),
    __metadata("design:type", Array)
], ProductKindResponse.prototype, "kinds", void 0);
ProductKindResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IResponse_1.IResponse })
], ProductKindResponse);
exports.ProductKindResponse = ProductKindResponse;
//# sourceMappingURL=ProductKindResponse.js.map