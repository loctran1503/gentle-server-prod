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
exports.PriceResponse = void 0;
const type_graphql_1 = require("type-graphql");
const IResponse_1 = require("../../response/IResponse");
const Price_1 = require("../../../entites/Price");
let PriceResponse = class PriceResponse {
};
__decorate([
    (0, type_graphql_1.Field)((_return) => Price_1.Price, { nullable: true }),
    __metadata("design:type", Price_1.Price)
], PriceResponse.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [Price_1.Price], { nullable: true }),
    __metadata("design:type", Array)
], PriceResponse.prototype, "prices", void 0);
PriceResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IResponse_1.IResponse })
], PriceResponse);
exports.PriceResponse = PriceResponse;
//# sourceMappingURL=PriceResponse.js.map