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
exports.ProductResponse = void 0;
const Product_1 = require("../../entites/Product");
const type_graphql_1 = require("type-graphql");
const IResponse_1 = require("./IResponse");
let ProductResponse = class ProductResponse {
};
__decorate([
    (0, type_graphql_1.Field)(_return => Product_1.Product, { nullable: true }),
    __metadata("design:type", Product_1.Product)
], ProductResponse.prototype, "product", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [Product_1.Product], { nullable: true }),
    __metadata("design:type", Array)
], ProductResponse.prototype, "products", void 0);
ProductResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IResponse_1.IResponse })
], ProductResponse);
exports.ProductResponse = ProductResponse;
//# sourceMappingURL=ProductResponse.js.map