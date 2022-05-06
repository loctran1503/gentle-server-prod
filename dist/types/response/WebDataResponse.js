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
exports.WebDataResponse = void 0;
const type_graphql_1 = require("type-graphql");
const BillProduct_1 = require("../../entites/BillProduct");
const Brand_1 = require("../../entites/Brand");
const ProductKind_1 = require("../../entites/ProductKind");
const IResponse_1 = require("./IResponse");
let WebDataResponse = class WebDataResponse {
};
__decorate([
    (0, type_graphql_1.Field)(_return => [Brand_1.Brand], { nullable: true }),
    __metadata("design:type", Array)
], WebDataResponse.prototype, "brands", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [ProductKind_1.ProductKind], { nullable: true }),
    __metadata("design:type", Array)
], WebDataResponse.prototype, "kinds", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [BillProduct_1.BillProduct], { nullable: true }),
    __metadata("design:type", Array)
], WebDataResponse.prototype, "products", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WebDataResponse.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WebDataResponse.prototype, "avatar", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], WebDataResponse.prototype, "isHidden", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WebDataResponse.prototype, "type", void 0);
WebDataResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IResponse_1.IResponse })
], WebDataResponse);
exports.WebDataResponse = WebDataResponse;
//# sourceMappingURL=WebDataResponse.js.map