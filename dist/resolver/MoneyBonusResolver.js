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
exports.MoneyBonusResolver = void 0;
const TakeMoneyFieldType_1 = require("../types/others/TakeMoneyFieldType");
const type_graphql_1 = require("type-graphql");
const data_source_1 = require("../data-source");
const MoneyBonus_1 = require("../entites/MoneyBonus");
const TakeMoneyField_1 = require("../entites/TakeMoneyField");
const User_1 = require("../entites/User");
const checkAuth_1 = require("../middleware/checkAuth");
const TakeMoneyFieldInput_1 = require("../types/input/TakeMoneyFieldInput");
const SimpleResponse_1 = require("../types/response/SimpleResponse");
const UserMoneyHistory_1 = require("../types/response/UserMoneyHistory");
let MoneyBonusResolver = class MoneyBonusResolver {
    createTakeMoneyField(field, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                const { accoutName, accountNumber, accountBankName, money } = field;
                try {
                    if (money < 50000)
                        return {
                            code: 400,
                            success: false,
                            message: "Số tiền không phù hợp",
                        };
                    const userExisting = yield transactionManager.findOne(User_1.User, {
                        where: {
                            id: user.userId
                        },
                    });
                    if (!userExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Không tìm thấy người dùng, vui lòng liên hệ Admin",
                        };
                    if (userExisting.moneyDepot < money) {
                        return {
                            code: 400,
                            success: false,
                            message: "Số tiền trong tài khoản không đủ để rút, vui lòng liên hệ Admin",
                        };
                    }
                    const newField = transactionManager.create(TakeMoneyField_1.TakeMoneyField, {
                        accoutName,
                        accountNumber,
                        accountBankName,
                        money,
                        user: userExisting,
                        status: TakeMoneyFieldType_1.TakeMoneyFieldType.PENDING
                    });
                    userExisting.moneyDepot -= money;
                    yield transactionManager.save(userExisting);
                    yield transactionManager.save(newField);
                    return {
                        code: 200,
                        success: true,
                        message: "Create TakeMoneyField successfully!",
                    };
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
    getUserMoneyHistory({ user }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user.userId) {
                    const moneyBonuses = yield MoneyBonus_1.MoneyBonus.find({
                        where: {
                            user: {
                                id: user.userId,
                            },
                        },
                    });
                    const takeMoneyFields = yield TakeMoneyField_1.TakeMoneyField.find({
                        where: {
                            user: {
                                id: user.userId,
                            },
                        },
                    });
                    if (!moneyBonuses)
                        return {
                            code: 400,
                            success: false,
                            message: "Money bonuses not found",
                        };
                    if (!takeMoneyFields)
                        return {
                            code: 400,
                            success: false,
                            message: "Money bonuses not found",
                        };
                    return {
                        code: 200,
                        success: true,
                        takeMoneyFields,
                        moneyBonuses,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "User not found",
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
    userCancelTakeMoneyField(takeMoneyFieldId, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userExisting = yield transactionManager.findOne(User_1.User, {
                        where: {
                            id: user.userId
                        }
                    });
                    if (!userExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Không tìm thấy người dùng"
                        };
                    const existing = yield transactionManager.findOne(TakeMoneyField_1.TakeMoneyField, {
                        where: {
                            id: takeMoneyFieldId
                        },
                    });
                    if (!existing)
                        return {
                            code: 400,
                            success: false,
                            message: "Không tìm thấy id của yêu cầu"
                        };
                    console.log(userExisting);
                    console.log(existing);
                    userExisting.moneyDepot += existing.money;
                    yield transactionManager.save(userExisting);
                    yield transactionManager.delete(TakeMoneyField_1.TakeMoneyField, {
                        id: existing.id
                    });
                    return {
                        code: 200,
                        success: true,
                        message: "Delete successfully!"
                    };
                }
                catch (error) {
                    console.log(error);
                    return {
                        code: 500,
                        success: false,
                        message: error.message,
                    };
                }
            }));
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("field")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TakeMoneyFieldInput_1.TakeMoneyFieldInput, Object]),
    __metadata("design:returntype", Promise)
], MoneyBonusResolver.prototype, "createTakeMoneyField", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => UserMoneyHistory_1.UserMoneyHistoryResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoneyBonusResolver.prototype, "getUserMoneyHistory", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("takeMoneyFieldId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MoneyBonusResolver.prototype, "userCancelTakeMoneyField", null);
MoneyBonusResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MoneyBonusResolver);
exports.MoneyBonusResolver = MoneyBonusResolver;
//# sourceMappingURL=MoneyBonusResolver.js.map