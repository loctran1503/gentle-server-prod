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
exports.CommentResolver = void 0;
const PaginationFeedbackResponse_1 = require("../types/response/PaginationFeedbackResponse");
const type_graphql_1 = require("type-graphql");
const Bill_1 = require("../entites/Bill");
const MoneyBonus_1 = require("../entites/MoneyBonus");
const Product_1 = require("../entites/Product");
const User_1 = require("../entites/User");
const UserComment_1 = require("../entites/UserComment");
const checkAuth_1 = require("../middleware/checkAuth");
const CommentInput_1 = require("../types/input/CommentInput");
const CommentResponse_1 = require("../types/response/CommentResponse");
const IntroducePriceCaculater_1 = require("../utils/IntroducePriceCaculater");
const MoneyConverter_1 = require("../utils/MoneyConverter");
const constants_1 = require("../utils/constants");
const data_source_1 = require("../data-source");
let CommentResolver = class CommentResolver {
    createComments(commentInput, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                const { content, billId, rating, imagesComment } = commentInput;
                try {
                    const userExisting = yield transactionManager.findOne(User_1.User, {
                        where: {
                            id: user.userId,
                        },
                    });
                    if (!userExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "User not found, are you not authenticate?",
                        };
                    const billExisting = yield transactionManager.findOne(Bill_1.Bill, {
                        where: {
                            id: billId,
                        },
                        relations: ["billProducts"],
                    });
                    if (!billExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Bill not found",
                        };
                    else if (billExisting && billExisting.isCommented === true)
                        return {
                            code: 400,
                            success: false,
                            message: "Bill is commented",
                        };
                    const res = yield Promise.all(billExisting.billProducts.map((item) => __awaiter(this, void 0, void 0, function* () {
                        if (item.productType !== "gift") {
                            const productExisting = yield transactionManager.findOne(Product_1.Product, {
                                where: {
                                    productName: item.productName,
                                },
                            });
                            if (!productExisting)
                                return false;
                            else {
                                const newComment = transactionManager.create(UserComment_1.UserComment, {
                                    content,
                                    rating,
                                    imagesComment,
                                    product: productExisting,
                                    user: userExisting,
                                });
                                yield transactionManager.save(newComment);
                                return true;
                            }
                        }
                        return true;
                    })))
                        .then((list) => {
                        const hasFalse = list.findIndex((item) => !item);
                        return hasFalse;
                    })
                        .catch((err) => {
                        console.log(err);
                        return false;
                    });
                    if (res === -1) {
                        let totalPrice = billExisting.billProducts.reduce((prev, current) => prev + current.productAmount * current.productPrice, 0);
                        if (billExisting.introduceCode) {
                            totalPrice =
                                totalPrice -
                                    (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice) +
                                    billExisting.deliveryPrice;
                        }
                        else {
                            totalPrice = totalPrice + billExisting.deliveryPrice;
                        }
                        const newFieldMoneyBonus = transactionManager.create(MoneyBonus_1.MoneyBonus, {
                            description: `Bạn vừa nhận được ${(0, MoneyConverter_1.MoneyConverter)((0, IntroducePriceCaculater_1.CommentPriceCaculater)(totalPrice))} từ bình luận của bạn.`,
                            moneyNumber: (0, IntroducePriceCaculater_1.CommentPriceCaculater)(totalPrice),
                            user: userExisting,
                        });
                        userExisting.moneyDepot += (0, IntroducePriceCaculater_1.CommentPriceCaculater)(totalPrice);
                        yield transactionManager.save(userExisting);
                        yield transactionManager.save(newFieldMoneyBonus);
                        billExisting.isCommented = true;
                        yield transactionManager.save(billExisting);
                        return {
                            code: 200,
                            success: true,
                            message: "create Comments successfully!",
                        };
                    }
                    else {
                        return {
                            code: 400,
                            success: false,
                            message: "product name not found",
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
            }));
        });
    }
    getComments(skip, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield UserComment_1.UserComment.find({
                    relations: ["feedbacks", "feedbacks.admin", "product", "user"],
                    where: {
                        product: {
                            id: productId,
                        },
                    },
                    skip,
                    take: constants_1.COMMENT_LIMIT_PER_PAGE,
                });
                if (!comments)
                    return {
                        code: 400,
                        success: false,
                        message: "Comments not found"
                    };
                const totalCount = yield UserComment_1.UserComment.count({
                    where: {
                        product: {
                            id: productId
                        }
                    }
                });
                const cursor = skip + constants_1.COMMENT_LIMIT_PER_PAGE;
                return {
                    code: 200,
                    success: true,
                    comments,
                    totalCount,
                    cursor,
                    hasMore: cursor !== totalCount
                };
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
    (0, type_graphql_1.Mutation)((_return) => CommentResponse_1.CommentResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("commentInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommentInput_1.CommentInput, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "createComments", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => PaginationFeedbackResponse_1.PaginationCommentsResponse),
    __param(0, (0, type_graphql_1.Arg)("skip")),
    __param(1, (0, type_graphql_1.Arg)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "getComments", null);
CommentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CommentResolver);
exports.CommentResolver = CommentResolver;
//# sourceMappingURL=CommentResolver.js.map