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
exports.UserResolver = void 0;
const data_source_1 = require("../data-source");
const type_graphql_1 = require("type-graphql");
const Admin_1 = require("../entites/Admin");
const User_1 = require("../entites/User");
const checkAuth_1 = require("../middleware/checkAuth");
const getUserId_1 = require("../middleware/getUserId");
const AuthInput_1 = require("../types/input/AuthInput");
const BillStatusType_1 = require("../types/others/BillStatusType");
const PaginationUsersResponse_1 = require("../types/response/PaginationUsersResponse");
const SimpleResponse_1 = require("../types/response/SimpleResponse");
const UserResponse_1 = require("../types/response/UserResponse");
const auth_1 = require("../utils/auth");
const constants_1 = require("../utils/constants");
const IntroducePriceCaculater_1 = require("../utils/IntroducePriceCaculater");
const randomCode_1 = require("../utils/randomCode");
let UserResolver = class UserResolver {
    confirmWaitingCount(root) {
        var _a;
        return (_a = root.bills) === null || _a === void 0 ? void 0 : _a.filter((item) => item.billStatus === BillStatusType_1.BillStatusType.COMFIRM_WAITING).length;
    }
    packedCount(root) {
        var _a;
        return (_a = root.bills) === null || _a === void 0 ? void 0 : _a.filter((item) => item.billStatus === BillStatusType_1.BillStatusType.PACKED).length;
    }
    deliveringCount(root) {
        var _a;
        return (_a = root.bills) === null || _a === void 0 ? void 0 : _a.filter((item) => item.billStatus === BillStatusType_1.BillStatusType.DELIVERING).length;
    }
    cancelCount(root) {
        var _a;
        return (_a = root.bills) === null || _a === void 0 ? void 0 : _a.filter((item) => item.billStatus === BillStatusType_1.BillStatusType.CANCEL).length;
    }
    getUser(context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExitsting = yield User_1.User.findOne({
                    where: {
                        id: context.user.userId,
                    },
                    relations: [
                        "bills",
                        "bills.billProducts",
                        "bills.customer",
                        "moneyBonuses",
                    ],
                });
                if (userExitsting) {
                    return {
                        code: 200,
                        success: true,
                        user: userExitsting,
                    };
                }
                else {
                    return {
                        success: false,
                        code: 400,
                        message: "User not found",
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
    loginWithsocial(authInput) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userId = authInput.userId;
                    const admin = yield transactionManager.findOne(Admin_1.Admin, {
                        where: {
                            adminId: userId,
                        },
                    });
                    if (admin) {
                        admin.adminName = authInput.userName;
                        admin.avatar = authInput.userAvartar;
                        yield transactionManager.save(admin);
                        return {
                            code: 200,
                            success: true,
                            message: "Admin Login successfully!",
                            token: (0, auth_1.createToken)("accessToken", admin.id.toString()),
                        };
                    }
                    else {
                        const user = yield transactionManager.findOne(User_1.User, {
                            where: {
                                userId,
                            },
                        });
                        if (user) {
                            (user.userAvatar = authInput.userAvartar),
                                (user.userName = authInput.userName);
                            yield transactionManager.save(user);
                            return {
                                code: 200,
                                success: true,
                                message: "Login successfully!",
                                user,
                                token: (0, auth_1.createToken)("accessToken", user.id.toString()),
                            };
                        }
                        else {
                            let isStop = true;
                            while (isStop) {
                                const introduceCode = (0, randomCode_1.randomIntroduceCode)(100000, 999999);
                                const existingUser = yield transactionManager.findOne(User_1.User, {
                                    where: {
                                        introduceCode,
                                    },
                                });
                                if (!existingUser) {
                                    const newUser = transactionManager.create(User_1.User, {
                                        userId: authInput.userId,
                                        userAvatar: authInput.userAvartar,
                                        userName: authInput.userName,
                                        introduceCode: (0, randomCode_1.randomIntroduceCode)(100000, 999999),
                                    });
                                    yield transactionManager.save(newUser);
                                    isStop = false;
                                    return {
                                        code: 200,
                                        success: true,
                                        message: "Register successfully!",
                                        user: newUser,
                                        token: (0, auth_1.createToken)("accessToken", newUser.id.toString()),
                                    };
                                }
                            }
                        }
                    }
                    return {
                        code: 400,
                        success: false,
                        message: "Something wrong",
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
    logout({ res }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    path: "/refresh_token",
                });
                return {
                    code: 200,
                    success: true,
                };
            }
            catch (error) {
                console.log(error.message);
                return {
                    code: 500,
                    success: false,
                };
            }
        });
    }
    checkIntroduceCode(introduceCode, totalPrice, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExisting = yield User_1.User.findOne({
                    where: {
                        introduceCode,
                    },
                });
                if (userExisting) {
                    return {
                        success: true,
                        code: 200,
                        message: "Áp dụng mã thành công",
                        introducePrice: (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice),
                    };
                }
                if (!userExisting) {
                    return {
                        success: false,
                        code: 400,
                        message: "Mã giảm giá không hợp lệ",
                    };
                }
                if (user.userId)
                    return {
                        success: false,
                        code: 400,
                        message: "Không thể nhập mã cho chính bạn",
                        introducePrice: (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice),
                    };
                return {
                    code: 500,
                    success: false,
                    message: "Unknown Error",
                };
            }
            catch (error) {
                return {
                    message: error.message,
                    code: 500,
                    success: false,
                };
            }
        });
    }
    getPaginationUsers(skip) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!skip)
                skip = 0;
            try {
                const users = yield User_1.User.find({
                    where: {
                        bills: !null,
                        isHidden: false,
                    },
                    relations: ["bills"],
                    order: {
                        createdAt: "DESC",
                    },
                    take: constants_1.USER_LIMIT,
                    skip,
                });
                const totalCount = yield User_1.User.count({
                    where: {
                        bills: !null,
                        isHidden: false,
                    },
                    relations: ["bills"],
                });
                const totalUserHideCount = yield User_1.User.count({
                    where: {
                        bills: !null,
                        isHidden: true,
                    },
                    relations: ["bills"],
                });
                const cursor = skip + constants_1.USER_LIMIT;
                let hasMore = false;
                switch (true) {
                    case totalCount < constants_1.USER_LIMIT:
                        hasMore = false;
                        break;
                    case cursor >= totalCount:
                        hasMore = false;
                        break;
                    default:
                        hasMore = true;
                        break;
                }
                if (users)
                    return {
                        code: 200,
                        success: true,
                        users,
                        userHideCount: totalUserHideCount || 0,
                        totalCount: totalCount || 0,
                        cursor,
                        hasMore,
                    };
                else
                    return {
                        code: 400,
                        success: false,
                        message: "Users not found",
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
    changeIsHidden(value, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
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
                            message: "User not found",
                        };
                    userExisting.isHidden = value;
                    yield transactionManager.save(userExisting);
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
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "confirmWaitingCount", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "packedCount", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "deliveringCount", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "cancelCount", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => UserResponse_1.UserResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("authInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthInput_1.AuthInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "loginWithsocial", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => UserResponse_1.UserResponse),
    (0, type_graphql_1.UseMiddleware)(getUserId_1.getUserId),
    __param(0, (0, type_graphql_1.Arg)("introduceCode")),
    __param(1, (0, type_graphql_1.Arg)("totalPrice")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "checkIntroduceCode", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => PaginationUsersResponse_1.PaginationUsersResponse),
    __param(0, (0, type_graphql_1.Arg)("skip", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getPaginationUsers", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(getUserId_1.getUserId),
    __param(0, (0, type_graphql_1.Arg)("value")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changeIsHidden", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map