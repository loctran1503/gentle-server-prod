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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceResolver = void 0;
const Price_1 = require("../entites/Price");
const type_graphql_1 = require("type-graphql");
let PriceResolver = class PriceResolver {
    priceAfterDiscount(root) {
        const price = root.price * ((100 - root.salesPercent) / 100);
        return price;
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Price_1.Price]),
    __metadata("design:returntype", void 0)
], PriceResolver.prototype, "priceAfterDiscount", null);
PriceResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => Price_1.Price)
], PriceResolver);
exports.PriceResolver = PriceResolver;
//# sourceMappingURL=PriceResolver.js.map