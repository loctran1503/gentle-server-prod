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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminResolver = void 0;
const Country_1 = require("../entites/Country");
const type_graphql_1 = require("type-graphql");
const data_source_1 = require("../data-source");
const Admin_1 = require("../entites/Admin");
const Bill_1 = require("../entites/Bill");
const Brand_1 = require("../entites/Brand");
const Customer_1 = require("../entites/Customer");
const Feedback_1 = require("../entites/Feedback");
const MoneyBonus_1 = require("../entites/MoneyBonus");
const Price_1 = require("../entites/Price");
const Product_1 = require("../entites/Product");
const ProductClass_1 = require("../entites/ProductClass");
const ProductKind_1 = require("../entites/ProductKind");
const TakeMoneyField_1 = require("../entites/TakeMoneyField");
const User_1 = require("../entites/User");
const UserComment_1 = require("../entites/UserComment");
const checkAdmin_1 = require("../middleware/checkAdmin");
const FeedbackInput_1 = require("../types/input/FeedbackInput");
const PriceInput_1 = require("../types/input/PriceInput");
const BillStatusType_1 = require("../types/others/BillStatusType");
const DashboardResponse_1 = require("../types/response/admin/DashboardResponse");
const KindBrandClassResponse_1 = require("../types/response/admin/KindBrandClassResponse");
const PriceResponse_1 = require("../types/response/admin/PriceResponse");
const TakeMoneyFieldResponse_1 = require("../types/response/admin/TakeMoneyFieldResponse");
const BillResponse_1 = require("../types/response/BillResponse");
const CommentResponse_1 = require("../types/response/CommentResponse");
const ProductKindResponse_1 = require("../types/response/ProductKindResponse");
const SimpleResponse_1 = require("../types/response/SimpleResponse");
const UserResponse_1 = require("../types/response/UserResponse");
const auth_1 = require("../utils/auth");
const IntroducePriceCaculater_1 = require("../utils/IntroducePriceCaculater");
const MoneyConverter_1 = require("../utils/MoneyConverter");
const ProductWasPaidCount_1 = __importDefault(require("../utils/ProductWasPaidCount"));
const TakeMoneyFieldType_1 = require("../types/others/TakeMoneyFieldType");
let AdminResolver = class AdminResolver {
    createAdmin(adminId, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionEntityManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const adminExisting = yield transactionEntityManager.findOne(Admin_1.Admin, {
                        where: {
                            adminId: adminId,
                        },
                    });
                    if (adminExisting) {
                        (0, auth_1.sendRefreshToken)(res, adminExisting.id.toString());
                        return {
                            code: 200,
                            success: true,
                            token: (0, auth_1.createToken)("accessToken", adminExisting.id.toString()),
                        };
                    }
                    else {
                        const newAdmin = transactionEntityManager.create(Admin_1.Admin, {
                            adminId,
                            adminName: "Memories",
                            avatar: "none",
                        });
                        yield transactionEntityManager.save(newAdmin);
                        (0, auth_1.sendRefreshToken)(res, newAdmin.id.toString());
                        return {
                            code: 200,
                            success: true,
                            token: (0, auth_1.createToken)("accessToken", newAdmin.id.toString()),
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
    adminCreateProductKind(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const countries = yield Country_1.Country.find();
                    if (!countries) {
                        return {
                            code: 400,
                            success: false,
                            message: "Country not found"
                        };
                    }
                    const newProductKind = transactionManager.create(ProductKind_1.ProductKind, {
                        name,
                        countries
                    });
                    yield transactionManager.save(newProductKind);
                    return {
                        code: 200,
                        success: true,
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
    adminCreateProductClass(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const productKindExisting = yield transactionManager.findOne(ProductKind_1.ProductKind, {
                        where: {
                            id,
                        },
                    });
                    if (!productKindExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "ProductKind not found",
                        };
                    const newProductClass = transactionManager.create(ProductClass_1.ProductClass, {
                        name,
                        kind: productKindExisting,
                    });
                    yield transactionManager.save(newProductClass);
                    return {
                        code: 200,
                        success: true,
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
    dashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionEntityManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let result = {
                        code: 200,
                        success: true,
                        takeMoneyField: 0,
                        cancel: 0,
                        confirmWaiting: 0,
                        confirmed: 0,
                        packed: 0,
                        delivering: 0,
                        commentNoFeedback: 0,
                    };
                    const takeMoneyField = yield transactionEntityManager.count(TakeMoneyField_1.TakeMoneyField, {
                        where: {
                            status: TakeMoneyFieldType_1.TakeMoneyFieldType.PENDING,
                        },
                    });
                    if (takeMoneyField > 0)
                        result.takeMoneyField = takeMoneyField;
                    const cancel = yield transactionEntityManager.count(Bill_1.Bill, {
                        where: {
                            billStatus: BillStatusType_1.BillStatusType.CANCEL,
                        },
                    });
                    if (cancel > 0)
                        result.cancel = cancel;
                    const confirmWaiting = yield transactionEntityManager.count(Bill_1.Bill, {
                        where: {
                            billStatus: BillStatusType_1.BillStatusType.COMFIRM_WAITING,
                        },
                    });
                    if (confirmWaiting > 0)
                        result.confirmWaiting = confirmWaiting;
                    const confirmed = yield transactionEntityManager.count(Bill_1.Bill, {
                        where: {
                            billStatus: BillStatusType_1.BillStatusType.CONFIRMED,
                        },
                    });
                    if (confirmed > 0)
                        result.confirmed = confirmed;
                    const packed = yield transactionEntityManager.count(Bill_1.Bill, {
                        where: {
                            billStatus: BillStatusType_1.BillStatusType.PACKED,
                        },
                    });
                    if (packed > 0)
                        result.packed = packed;
                    const delivering = yield transactionEntityManager.count(Bill_1.Bill, {
                        where: {
                            billStatus: BillStatusType_1.BillStatusType.DELIVERING,
                        },
                    });
                    if (delivering > 0)
                        result.delivering = delivering;
                    const commentNoFeedback = yield transactionEntityManager.count(UserComment_1.UserComment, {
                        where: {
                            isFeedback: false,
                        },
                    });
                    if (commentNoFeedback > 0)
                        result.commentNoFeedback = commentNoFeedback;
                    return result;
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
    adminGetKindBrandClass() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const kinds = yield transactionManager.find(ProductKind_1.ProductKind);
                    const brands = yield transactionManager.find(Brand_1.Brand);
                    const classes = yield transactionManager.find(ProductClass_1.ProductClass, {
                        relations: ["kind"],
                    });
                    return {
                        code: 200,
                        success: true,
                        kinds,
                        brands,
                        classes,
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
    adminGetBills(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bills = yield Bill_1.Bill.find({
                    where: {
                        billStatus: type,
                    },
                    relations: ["customer", "billProducts"],
                });
                if (bills)
                    return {
                        code: 200,
                        success: true,
                        bills,
                    };
                return {
                    code: 400,
                    success: false,
                    message: `Not found bills with type ${type}`,
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
    adminGetTakeMoneyFields() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fields = yield TakeMoneyField_1.TakeMoneyField.find({
                    where: {
                        status: TakeMoneyFieldType_1.TakeMoneyFieldType.PENDING,
                    },
                    relations: ["user", "user.moneyBonuses"],
                });
                if (fields)
                    return {
                        code: 200,
                        success: true,
                        fields,
                    };
                else
                    return {
                        code: 400,
                        success: false,
                        message: "fields not found",
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
    adminGetCommentsNoFeedback() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield UserComment_1.UserComment.find({
                    where: {
                        isFeedback: false,
                    },
                    relations: ["product", "user"],
                });
                if (comments)
                    return {
                        code: 200,
                        success: true,
                        comments,
                    };
                else
                    return {
                        code: 400,
                        success: false,
                        message: "Comments not found",
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
    adminTakeMoneyFieldCompleted(fieldId, imageSuccess) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const fieldExisting = yield transactionManager.findOne(TakeMoneyField_1.TakeMoneyField, {
                        where: {
                            id: fieldId,
                        },
                        relations: ["user"],
                    });
                    if (!fieldExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "TakeMoneyField not found",
                        };
                    fieldExisting.isSuccessImage = imageSuccess;
                    fieldExisting.status = TakeMoneyFieldType_1.TakeMoneyFieldType.SUCCESS;
                    yield transactionManager.save(fieldExisting);
                    return {
                        code: 200,
                        success: true,
                        message: "Edit TakeMoneyField Successfully!",
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
    adminTakeMoneyFieldCancel(fieldId, cancelReason) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const fieldExisting = yield transactionManager.findOne(TakeMoneyField_1.TakeMoneyField, {
                        where: {
                            id: fieldId,
                        },
                        relations: ["user"],
                    });
                    const userExisting = yield transactionManager.findOne(User_1.User, {
                        where: {
                            id: fieldExisting === null || fieldExisting === void 0 ? void 0 : fieldExisting.user.id
                        }
                    });
                    if (!fieldExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "TakeMoneyField not found",
                        };
                    if (!userExisting) {
                        return {
                            code: 400,
                            success: false,
                            message: "User not found"
                        };
                    }
                    userExisting.moneyDepot += fieldExisting.money;
                    yield transactionManager.save(userExisting);
                    fieldExisting.status = TakeMoneyFieldType_1.TakeMoneyFieldType.FAIL;
                    fieldExisting.cancelReason = cancelReason;
                    yield transactionManager.save(fieldExisting);
                    return {
                        code: 200,
                        success: true,
                        message: "Cancel TakeMoneyField Successfully!",
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
    adminCreateFeedback(feedbackInput, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                const { content, commentId } = feedbackInput;
                try {
                    const commentExisting = yield transactionManager.findOne(UserComment_1.UserComment, {
                        where: {
                            id: commentId,
                        },
                    });
                    if (!commentExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Comment not found",
                        };
                    const adminExisting = yield transactionManager.findOne(Admin_1.Admin, {
                        where: {
                            id: user.userId,
                        },
                    });
                    if (!adminExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Admin not found",
                        };
                    const newFeedback = transactionManager.create(Feedback_1.Feedback, {
                        content,
                        admin: adminExisting,
                        comment: commentExisting,
                    });
                    yield transactionManager.save(newFeedback);
                    commentExisting.isFeedback = true;
                    yield transactionManager.save(commentExisting);
                    return {
                        code: 200,
                        success: true,
                        message: "Create feedback successfully!",
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
    adminEditBillStatus(billId, status, paymentDown) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (status === BillStatusType_1.BillStatusType.COMPLETED) {
                        return {
                            code: 400,
                            success: false,
                            message: "Value invalid",
                        };
                    }
                    const billExisting = yield transactionManager.findOne(Bill_1.Bill, {
                        where: {
                            id: billId,
                        },
                    });
                    if (!billExisting)
                        return {
                            code: 400,
                            success: false,
                            message: `Bill not found`,
                        };
                    billExisting.billStatus = status;
                    if (paymentDown)
                        billExisting.paymentDown = paymentDown;
                    yield transactionManager.save(billExisting);
                    return {
                        code: 200,
                        success: true,
                        bill: billExisting,
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
    adminHandleBillCompleted(billId, totalPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
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
                    billExisting.billProducts.map((item) => __awaiter(this, void 0, void 0, function* () {
                        if (item.productType !== "gift") {
                            const product = yield transactionManager.findOne(Product_1.Product, {
                                where: {
                                    productName: item.productName,
                                },
                            });
                            if (product) {
                                product.sales += item.productAmount;
                                yield transactionManager.save(product);
                            }
                        }
                    }));
                    ProductWasPaidCount_1.default.setProductCount(0);
                    billExisting.isCommented = false;
                    billExisting.billStatus = BillStatusType_1.BillStatusType.COMPLETED;
                    yield transactionManager.save(billExisting);
                    if (billExisting.introduceCode) {
                        const userExisting = yield transactionManager.findOne(User_1.User, {
                            where: {
                                introduceCode: billExisting.introduceCode,
                            },
                        });
                        if (!userExisting)
                            return {
                                code: 400,
                                success: false,
                                message: "Introduce code invalid: User not found",
                            };
                        const newFieldMoneyBonus = transactionManager.create(MoneyBonus_1.MoneyBonus, {
                            description: `Bạn vừa nhận được ${(0, MoneyConverter_1.MoneyConverter)((0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice))} từ mã giới thiệu`,
                            moneyNumber: (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice),
                            user: userExisting,
                        });
                        userExisting.moneyDepot += (0, IntroducePriceCaculater_1.IntroducePriceCaculater)(totalPrice);
                        yield transactionManager.save(userExisting);
                        yield transactionManager.save(newFieldMoneyBonus);
                        return {
                            code: 200,
                            success: true,
                            message: "Convert bill to Completed with Introduce code successfully!",
                        };
                    }
                    else {
                        return {
                            code: 200,
                            success: true,
                            message: "Convert bill with No Introduce code successfully!",
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
            }));
        });
    }
    adminHandleBillReject(billId) {
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
                    const customerExisting = yield transactionManager.findOne(Customer_1.Customer, {
                        where: {
                            id: billExisting.customer.id,
                        },
                    });
                    if (!customerExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "customer not found",
                        };
                    billExisting.billStatus = BillStatusType_1.BillStatusType.CANCEL;
                    yield transactionManager.save(billExisting);
                    customerExisting.rejectedAmount++;
                    yield transactionManager.save(customerExisting);
                    return {
                        success: true,
                        code: 200,
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
    adminEditProductPrice(priceId, priceChanging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const priceExisting = yield transactionManager.findOne(Price_1.Price, {
                        where: {
                            id: priceId,
                        },
                    });
                    if (!priceExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Price not found",
                        };
                    priceExisting.price = priceChanging;
                    yield transactionManager.save(priceExisting);
                    return {
                        code: 200,
                        success: true,
                        price: priceExisting,
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
    adminGetProductKinds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield ProductKind_1.ProductKind.find();
                return {
                    code: 200,
                    success: true,
                    kinds: items,
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
    adminGetProductClasses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classes = yield ProductClass_1.ProductClass.find();
                return {
                    code: 200,
                    success: true,
                    classes,
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
    adminCreateOrEditPrice(priceInput, priceId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const productExisting = yield transactionEntityManager.findOne(Product_1.Product, {
                    where: {
                        id: productId,
                    },
                    relations: ["prices"],
                });
                if (!productExisting)
                    return {
                        code: 400,
                        success: false,
                        message: "Product not found",
                    };
                const priceExisting = yield transactionEntityManager.findOne(Price_1.Price, {
                    where: {
                        id: priceId,
                    },
                });
                if (priceExisting) {
                    const checkDiscountOfProductAndPrice = productExisting.salesPercent === priceExisting.salesPercent;
                    priceExisting.type = priceInput.type;
                    priceExisting.status = priceInput.status;
                    priceExisting.price = priceInput.price;
                    priceExisting.salesPercent = priceInput.salesPercent;
                    yield transactionEntityManager.save(priceExisting);
                    const totalPrice = productExisting.prices.reduce((prev, current) => prev + current.price, 0);
                    productExisting.priceToDisplay = Math.floor(totalPrice / productExisting.prices.length);
                    if (checkDiscountOfProductAndPrice) {
                        productExisting.salesPercent = priceInput.salesPercent;
                    }
                    yield transactionEntityManager.save(productExisting);
                    return {
                        code: 200,
                        success: true,
                        message: "Edit price successfully!",
                        price: priceExisting,
                    };
                }
                else {
                    const newPrice = Price_1.Price.create({
                        type: priceInput.type,
                        status: priceInput.status,
                        price: priceInput.price,
                        product: productExisting,
                        salesPercent: priceInput.salesPercent,
                    });
                    yield transactionEntityManager.save(newPrice);
                    return {
                        code: 200,
                        success: true,
                        message: "Create new price successfully!",
                        price: newPrice,
                    };
                }
            }));
        });
    }
    adminAddClassToBrand(brandId, classId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const brandExisting = yield transactionManager.findOne(Brand_1.Brand, {
                        where: {
                            id: brandId,
                        },
                        relations: ["productClasses"],
                    });
                    if (!brandExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Brand not found",
                        };
                    const classExisting = yield transactionManager.findOne(ProductClass_1.ProductClass, {
                        where: {
                            id: classId,
                        },
                    });
                    if (!classExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "class not found",
                        };
                    brandExisting.productClasses.push(classExisting);
                    yield transactionManager.save(brandExisting);
                    return {
                        code: 200,
                        success: true,
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
    adminCreateCountry(countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCountry = Country_1.Country.create({
                    countryName,
                });
                yield newCountry.save();
                return {
                    code: 200,
                    success: true,
                    message: "Create Country successfully!",
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
    (0, type_graphql_1.Mutation)((_return) => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("adminId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "createAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => ProductKindResponse_1.ProductKindResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminCreateProductKind", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => ProductKindResponse_1.ProductKindResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminCreateProductClass", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => DashboardResponse_1.DashboardResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "dashboard", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => KindBrandClassResponse_1.KindBrandClassResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminGetKindBrandClass", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => BillResponse_1.BillResponse),
    __param(0, (0, type_graphql_1.Arg)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminGetBills", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => TakeMoneyFieldResponse_1.TakeMoneyFieldResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminGetTakeMoneyFields", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => CommentResponse_1.CommentResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminGetCommentsNoFeedback", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("fieldId")),
    __param(1, (0, type_graphql_1.Arg)("imageSuccess")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminTakeMoneyFieldCompleted", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("fieldId")),
    __param(1, (0, type_graphql_1.Arg)("cancelReason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminTakeMoneyFieldCancel", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("feedbackInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackInput_1.FeedbackInput, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminCreateFeedback", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => BillResponse_1.BillResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("billId")),
    __param(1, (0, type_graphql_1.Arg)("status")),
    __param(2, (0, type_graphql_1.Arg)("paymentDown")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminEditBillStatus", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => BillResponse_1.BillResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("billId")),
    __param(1, (0, type_graphql_1.Arg)("totalPrice")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminHandleBillCompleted", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("billId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminHandleBillReject", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => PriceResponse_1.PriceResponse),
    __param(0, (0, type_graphql_1.Arg)("priceId")),
    __param(1, (0, type_graphql_1.Arg)("priceChanging")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminEditProductPrice", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => ProductKindResponse_1.ProductKindResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminGetProductKinds", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => ProductKindResponse_1.ProductKindResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminGetProductClasses", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => PriceResponse_1.PriceResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("priceInput")),
    __param(1, (0, type_graphql_1.Arg)("priceId")),
    __param(2, (0, type_graphql_1.Arg)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PriceInput_1.PriceInput, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminCreateOrEditPrice", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("brandId")),
    __param(1, (0, type_graphql_1.Arg)("classId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminAddClassToBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => SimpleResponse_1.SimpleResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("countryName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminCreateCountry", null);
AdminResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AdminResolver);
exports.AdminResolver = AdminResolver;
//# sourceMappingURL=AdminResolver.js.map