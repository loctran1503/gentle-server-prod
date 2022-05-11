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
exports.BillResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const Bill_1 = require("../entites/Bill");
const BillCancelReason_1 = require("../entites/BillCancelReason");
const BillProduct_1 = require("../entites/BillProduct");
const Customer_1 = require("../entites/Customer");
const Price_1 = require("../entites/Price");
const User_1 = require("../entites/User");
const checkAuth_1 = require("../middleware/checkAuth");
const getUserId_1 = require("../middleware/getUserId");
const BillInput_1 = require("../types/input/BillInput");
const BillProductInput_1 = require("../types/input/BillProductInput");
const BillStatusType_1 = require("../types/others/BillStatusType");
const BillResponse_1 = require("../types/response/BillResponse");
const CartProductResponse_1 = require("../types/response/CartProductResponse");
const GiftResponse_1 = require("../types/response/GiftResponse");
const constants_1 = require("../utils/constants");
const IntroducePriceCaculater_1 = require("../utils/IntroducePriceCaculater");
let BillResolver = class BillResolver {
    totalPrice(root) {
        let totalPrice = root.billProducts.reduce((prev, current) => prev + current.productAmount * current.productPrice, 0);
        if (root.introduceCode) {
            totalPrice =
                totalPrice - (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice) + root.deliveryPrice;
            return totalPrice;
        }
        else {
            if (root.paymentDown > 0) {
                totalPrice = totalPrice + root.deliveryPrice - root.paymentDown;
                return totalPrice;
            }
            else {
                totalPrice = totalPrice + root.deliveryPrice;
                return totalPrice;
            }
        }
    }
    commentPrice(root) {
        let totalPrice = root.billProducts.reduce((prev, current) => prev + current.productAmount * current.productPrice, 0);
        if (root.introduceCode) {
            totalPrice =
                totalPrice - (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice) + root.deliveryPrice;
            return totalPrice * constants_1.MONEY_COMMENT_PERCENT;
        }
        else {
            if (root.paymentDown > 0) {
                totalPrice = totalPrice + root.deliveryPrice - root.paymentDown;
                return totalPrice * constants_1.MONEY_COMMENT_PERCENT;
            }
            else {
                totalPrice = totalPrice + root.deliveryPrice;
                return totalPrice * constants_1.MONEY_COMMENT_PERCENT;
            }
        }
    }
    introducePrice(root) {
        let totalPrice = root.billProducts.reduce((prev, current) => prev + current.productAmount * current.productPrice, 0);
        if (root.introduceCode) {
            return (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice);
        }
        else {
            return 0;
        }
    }
    getCartProduct(localBillProducts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield Promise.all(localBillProducts.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const price = yield Price_1.Price.findOne({
                        where: {
                            id: item.priceIdForLocal,
                        },
                        relations: ["product", "product.country"],
                    });
                    if (!price)
                        throw Error("Something wrong!");
                    const realPrice = (price.price * (100 - price.salesPercent)) / 100;
                    const billProduct = BillProduct_1.BillProduct.create({
                        productName: price.product.productName,
                        productThumbnail: price.product.thumbnail,
                        productType: price.type,
                        productPrice: realPrice,
                        productAmount: item.productAmount,
                        priceIdForLocal: item.priceIdForLocal,
                        countryNameForDeliveryPrice: price.product.country.countryName
                    });
                    return billProduct;
                }))).then((list) => {
                    return list;
                });
                return {
                    code: 200,
                    success: true,
                    products: res,
                };
            }
            catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: `Server error:${error.message}`,
                };
            }
        });
    }
    getGift(priceCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let takeCondition = 1;
                if (priceCondition > 5000000 && priceCondition < 10000000)
                    takeCondition = 2;
                else if (priceCondition > 10000000)
                    takeCondition = 3;
                const items = yield Price_1.Price.find({
                    where: {
                        price: (0, typeorm_1.LessThan)(priceCondition),
                        isGift: true,
                    },
                    order: {
                        product: {
                            sales: "DESC",
                        },
                    },
                    take: takeCondition,
                    relations: ["product"],
                });
                if (items) {
                    return {
                        code: 200,
                        success: true,
                        gifts: items,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "Price not found",
                    };
                }
            }
            catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: `Server error:${error.message}`,
                };
            }
        });
    }
    getGifts(priceCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gifts = yield Price_1.Price.find({
                    where: {
                        price: (0, typeorm_1.LessThan)(priceCondition),
                        isGift: true,
                    },
                    relations: ["product"],
                });
                if (gifts.length > 0) {
                    return {
                        code: 200,
                        success: true,
                        gifts,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "Gifts not found",
                    };
                }
            }
            catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: `Server error:${error.message}`,
                };
            }
        });
    }
    createBill(billInput, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { notice, introduceCode, customer, products, deliveryPrice, paymentType, } = billInput;
                    const customerExisting = yield transactionManager.findOne(Customer_1.Customer, {
                        where: {
                            customerPhone: customer.customerPhone,
                        },
                    });
                    if (customerExisting &&
                        customerExisting.rejectedAmount > constants_1.REJECTED_AMOUNT)
                        return {
                            code: 400,
                            success: false,
                            message: "numberphone is locked",
                        };
                    const newCustomer = transactionManager.create(Customer_1.Customer, Object.assign({}, customer));
                    yield transactionManager.save(newCustomer);
                    const newBill = Bill_1.Bill.create({
                        customer: newCustomer,
                        deliveryPrice,
                        paymentType,
                    });
                    if (notice) {
                        newBill.notice = notice;
                    }
                    if (user !== undefined && user.userId !== undefined) {
                        const userExisting = yield transactionManager.findOne(User_1.User, {
                            where: {
                                id: user.userId,
                            },
                        });
                        if (userExisting)
                            newBill.user = userExisting;
                    }
                    if (introduceCode)
                        newBill.introduceCode = introduceCode;
                    yield transactionManager.save(newBill);
                    yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
                        const newProduct = transactionManager.create(BillProduct_1.BillProduct, {
                            productName: product.productName,
                            productThumbnail: product.productThumbnail,
                            productType: product.productType,
                            productPrice: product.productPrice,
                            productAmount: product.productAmount,
                            bill: newBill,
                        });
                        yield transactionManager.save(newProduct);
                        return newProduct;
                    }))).catch((err) => {
                        console.log(err);
                        return {
                            code: 400,
                            success: false,
                            message: err.message,
                        };
                    });
                    return {
                        code: 200,
                        success: true,
                        bill: newBill,
                    };
                }
                catch (error) {
                    console.log(error.message);
                    return {
                        code: 500,
                        success: false,
                        message: `Server error:${error.message}`,
                    };
                }
            }));
        });
    }
    handleBillCancel(billId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const billExisting = yield transactionManager.findOne(Bill_1.Bill, {
                        where: {
                            id: billId,
                        },
                        relations: ["customer"],
                    });
                    if (!billExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "bill not found",
                        };
                    if (billExisting.billStatus === BillStatusType_1.BillStatusType.DELIVERING ||
                        billExisting.billStatus === BillStatusType_1.BillStatusType.COMPLETED ||
                        billExisting.billStatus === BillStatusType_1.BillStatusType.CANCEL)
                        return {
                            code: 400,
                            success: false,
                            message: "This bill cannot cancel",
                        };
                    billExisting.billStatus = BillStatusType_1.BillStatusType.CANCEL;
                    yield transactionManager.save(billExisting);
                    if (reason !== "") {
                        const newBillCancelReason = transactionManager.create(BillCancelReason_1.BillCancelReason, {
                            reason,
                            customer: billExisting.customer,
                        });
                        yield transactionManager.save(newBillCancelReason);
                    }
                    return {
                        code: 200,
                        success: true,
                    };
                }
                catch (error) {
                    return {
                        code: 500,
                        success: false,
                        message: `Server error:${error.message}`,
                    };
                }
            }));
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bill_1.Bill]),
    __metadata("design:returntype", void 0)
], BillResolver.prototype, "totalPrice", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bill_1.Bill]),
    __metadata("design:returntype", void 0)
], BillResolver.prototype, "commentPrice", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bill_1.Bill]),
    __metadata("design:returntype", void 0)
], BillResolver.prototype, "introducePrice", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => CartProductResponse_1.CartProductResponse),
    __param(0, (0, type_graphql_1.Arg)("localBillProducts", (_type) => [BillProductInput_1.BillProductInput])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "getCartProduct", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => GiftResponse_1.GiftResponse),
    __param(0, (0, type_graphql_1.Arg)("priceCondition")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "getGift", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => GiftResponse_1.GiftResponse),
    __param(0, (0, type_graphql_1.Arg)("priceCondition")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "getGifts", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => BillResponse_1.BillResponse),
    (0, type_graphql_1.UseMiddleware)(getUserId_1.getUserId),
    __param(0, (0, type_graphql_1.Arg)("billInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BillInput_1.BillInput, Object]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "createBill", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => BillResponse_1.BillResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("billId")),
    __param(1, (0, type_graphql_1.Arg)("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BillResolver.prototype, "handleBillCancel", null);
BillResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => Bill_1.Bill)
], BillResolver);
exports.BillResolver = BillResolver;
//# sourceMappingURL=BillResolver.js.map