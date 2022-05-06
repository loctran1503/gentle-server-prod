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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResolver = void 0;
const crypto_1 = require("crypto");
const CartProduct_1 = require("src/entites/CartProduct");
const Price_1 = require("src/entites/Price");
const type_graphql_1 = require("type-graphql");
const CartCode_1 = require("../entites/CartCode");
const getUserId_1 = require("../middleware/getUserId");
const CartInput_1 = require("../types/input/CartInput");
const CartResponse_1 = require("../types/response/CartResponse");
let CartResolver = class CartResolver {
    handleUserCart(cartInput, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (cartInput.length < 1)
                    return {
                        code: 400,
                        success: false,
                        message: "CartInput null"
                    };
                const cartCookie = req.cookies[process.env.CART_COOKIE_NAME];
                if (!cartCookie) {
                    const newCart = CartCode_1.CartCode.create({
                        cartCode: (0, crypto_1.randomUUID)(),
                    });
                    yield newCart.save();
                    const cartResponse = yield Promise.all(cartInput.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const price = yield Price_1.Price.findOne({
                            where: {
                                id: item.priceId,
                            },
                            relations: ["product"],
                        });
                        if (price) {
                            const cartProduct = CartProduct_1.CartProduct.create({
                                amount: item.productAmount,
                                cartCode: newCart,
                                price,
                            });
                            return cartProduct;
                        }
                        throw new Error("Something wrong");
                    }))).then((list) => {
                        return list;
                    }).catch(err => {
                        throw new Error(err.message);
                    });
                    res.cookie(process.env.CART_COOKIE_NAME, newCart.cartCode, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        expires: new Date(Date.now() + 86400 * 1000 * 180),
                    });
                    return {
                        code: 200,
                        success: true,
                        message: "Create new CartCode successfully!",
                        cartProducts: cartResponse
                    };
                }
                else {
                    const cartExisting = yield CartCode_1.CartCode.findOne({
                        where: {
                            cartCode: cartCookie
                        },
                        relations: ["productCarts"]
                    });
                    if (!cartExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "CartCode not found"
                        };
                    yield Promise.all(cartExisting.productCarts.map((item) => __awaiter(this, void 0, void 0, function* () {
                        console.log(item);
                    })));
                    return {
                        code: 200,
                        success: true
                    };
                }
            }
            catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: error.message,
                };
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_return) => CartResponse_1.CartResponse),
    (0, type_graphql_1.UseMiddleware)(getUserId_1.getUserId),
    __param(0, (0, type_graphql_1.Arg)("cartInput", (_type) => [CartInput_1.CartInput])),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "handleUserCart", null);
CartResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CartResolver);
exports.CartResolver = CartResolver;
//# sourceMappingURL=CartResolver.js.map