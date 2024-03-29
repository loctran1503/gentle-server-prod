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
exports.ProductResolver = void 0;
const KindBrandClassResponse_1 = require("../types/response/admin/KindBrandClassResponse");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const Brand_1 = require("../entites/Brand");
const Price_1 = require("../entites/Price");
const Product_1 = require("../entites/Product");
const ProductClass_1 = require("../entites/ProductClass");
const ProductKind_1 = require("../entites/ProductKind");
const User_1 = require("../entites/User");
const checkAdmin_1 = require("../middleware/checkAdmin");
const ProductInput_1 = require("../types/input/ProductInput");
const SearchOptionsInput_1 = require("../types/input/SearchOptionsInput");
const PaginationProductsResponse_1 = require("../types/response/PaginationProductsResponse");
const PaginationUsersResponse_1 = require("../types/response/PaginationUsersResponse");
const ProductKindResponse_1 = require("../types/response/ProductKindResponse");
const ProductResponse_1 = require("../types/response/ProductResponse");
const constants_1 = require("../utils/constants");
const ProductWasPaidCount_1 = __importDefault(require("../utils/ProductWasPaidCount"));
const WebDataResponse_1 = require("../types/response/WebDataResponse");
const BillProductInput_1 = require("../types/input/BillProductInput");
const BillProduct_1 = require("../entites/BillProduct");
const getUserId_1 = require("../middleware/getUserId");
const auth_1 = require("../utils/auth");
const Admin_1 = require("../entites/Admin");
const Country_1 = require("../entites/Country");
let ProductResolver = class ProductResolver {
    commentCount(root) {
        var _a;
        if (root.comments) {
            const commentAmount = (_a = root.comments) === null || _a === void 0 ? void 0 : _a.length;
            return commentAmount;
        }
        else {
            return 0;
        }
    }
    minPrice(root) {
        const min = Math.min.apply(Math, root.prices.map((price) => price.price * ((100 - price.salesPercent) / 100)));
        return min;
    }
    maxPrice(root) {
        const max = Math.max.apply(Math, root.prices.map((price) => price.price * ((100 - price.salesPercent) / 100)));
        return max;
    }
    priceAfterDiscount(root) {
        if (root.salesPercent > 0) {
            const price = root.priceToDisplay * ((100 - root.salesPercent) / 100);
            return price;
        }
        else {
            return root.priceToDisplay;
        }
    }
    otherInfo(root) {
        switch (root.country.countryName) {
            case constants_1.AMERICA:
                return constants_1.AMERICA_INFO;
            case constants_1.KOREA:
                return constants_1.KOREA_INFO;
            case constants_1.VIETNAM:
                return constants_1.VIETNAM_INFO;
            default:
                return [];
        }
    }
    imageList(root) {
        let imageList = root.imgDescription;
        imageList.unshift(root.thumbnail);
        return imageList;
    }
    averageRating(root) {
        var _a, _b;
        const totalRating = (_a = root.comments) === null || _a === void 0 ? void 0 : _a.reduce((prev, current) => {
            return prev + current.rating;
        }, 0);
        const commentLenght = (_b = root.comments) === null || _b === void 0 ? void 0 : _b.length;
        if (totalRating && commentLenght) {
            return totalRating / commentLenght;
        }
        else
            return 0;
    }
    createProduct(productInput) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { productName, thumbnail, imgDescription, description, prices, brandId, sales, kindId, classId, countryName, } = productInput;
                    const brandExisting = yield transactionManager.findOne(Brand_1.Brand, {
                        where: {
                            id: brandId,
                        },
                    });
                    const kindExisting = yield transactionManager.findOne(ProductKind_1.ProductKind, {
                        where: {
                            id: kindId,
                        },
                    });
                    const classExisting = yield transactionManager.findOne(ProductClass_1.ProductClass, {
                        where: {
                            id: classId,
                        },
                    });
                    const country = yield transactionManager.findOne(Country_1.Country, {
                        where: {
                            countryName,
                        },
                    });
                    if (!brandExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "Brand  not found",
                        };
                    if (!kindExisting)
                        return {
                            code: 400,
                            success: false,
                            message: "kind  not found",
                        };
                    if (!classExisting)
                        return {
                            code: 400,
                            success: false,
                            message: " class  not found",
                        };
                    if (!country)
                        return {
                            code: 400,
                            success: false,
                            message: "country not found",
                        };
                    const totalPrice = prices.reduce((prev, current) => prev + current.price, 0);
                    const salesPercent = Math.max.apply(Math, prices.map((price) => price.salesPercent));
                    let imgList = [];
                    imgList.unshift(thumbnail);
                    const newProduct = transactionManager.create(Product_1.Product, {
                        productName,
                        thumbnail,
                        imgDescription: imgDescription.length > 0 ? imgDescription : imgList,
                        description,
                        priceToDisplay: Math.floor(totalPrice / prices.length),
                        brand: brandExisting,
                        kind: kindExisting,
                        class: classExisting,
                        sales: sales || 0,
                        country: country,
                        salesPercent: salesPercent || 0,
                    });
                    yield transactionManager.save(newProduct);
                    if (prices) {
                        yield Promise.all(prices.map((price) => __awaiter(this, void 0, void 0, function* () {
                            const newPrice = transactionManager.create(Price_1.Price, {
                                type: price.type,
                                price: price.price,
                                salesPercent: price.salesPercent,
                                status: price.status,
                                product: newProduct,
                            });
                            yield transactionManager.save(newPrice);
                        }))).catch((error) => console.log(error));
                    }
                    return {
                        code: 200,
                        success: true,
                        message: "Create product successfully!",
                        product: newProduct,
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
    getProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield Product_1.Product.findOne({
                    where: {
                        id: productId,
                    },
                    relations: [
                        "comments",
                        "comments.feedbacks",
                        "comments.user",
                        "comments.feedbacks.admin",
                        "prices",
                        "brand",
                        "kind",
                        "country",
                    ],
                });
                if (product) {
                    return {
                        code: 200,
                        success: true,
                        product,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "Không tìm thấy sản phẩm phù hợp.",
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
    getProductsBySearchInput(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (value.length < 2) {
                    return {
                        code: 400,
                        success: false,
                        message: "invalid condition",
                    };
                }
                const products = yield Product_1.Product.find({
                    where: { productName: (0, typeorm_1.Like)(`%${value}%`) },
                    take: 10,
                    relations: ["prices"],
                });
                if (products.length > 0) {
                    return {
                        code: 200,
                        success: true,
                        products: products,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "Không tìm thấy sản phẩm phù hợp",
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
    getProductPaidAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = ProductWasPaidCount_1.default.getProductCount();
                if (count !== undefined && count > 0) {
                    return count;
                }
                else {
                    const { sum } = yield data_source_1.dataSource
                        .getRepository(Product_1.Product)
                        .createQueryBuilder("product")
                        .select("SUM(product.sales)", "sum")
                        .getRawOne();
                    if (sum) {
                        ProductWasPaidCount_1.default.setProductCount(sum);
                        return sum;
                    }
                    else
                        return null;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
    getPaginationUsersToday(skip) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!skip)
                skip = 0;
            try {
                const users = yield User_1.User.find({
                    relations: ["bills"],
                    order: {
                        createdAt: "DESC",
                    },
                    take: constants_1.USER_LIMIT,
                    skip,
                });
                const totalCount = yield User_1.User.count({
                    relations: ["bills"],
                });
                const cursor = skip + constants_1.USER_LIMIT;
                if (users)
                    return {
                        code: 200,
                        success: true,
                        users,
                        totalCount,
                        cursor,
                        hasMore: cursor !== totalCount,
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
    getProductsForIndex(countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const realTake = 10;
                const kinds = yield ProductKind_1.ProductKind.find({
                    where: {
                        countries: {
                            countryName,
                        }
                    },
                    relations: ["countries", "products"],
                });
                const res = yield Promise.all(kinds.map((item) => __awaiter(this, void 0, void 0, function* () {
                    item.products = yield Product_1.Product.find({
                        where: {
                            kind: {
                                id: item.id,
                            },
                            country: {
                                countryName,
                            },
                        },
                        order: {
                            sales: "DESC",
                            salesPercent: "DESC"
                        },
                        take: realTake,
                        relations: ["comments", "country", "prices", "class"],
                    });
                    return item;
                })))
                    .then((list) => {
                    const filteredList = list.filter(item => { var _a; return item.products && ((_a = item.products) === null || _a === void 0 ? void 0 : _a.length) > 0; });
                    return {
                        code: 200,
                        success: true,
                        kinds: filteredList,
                    };
                })
                    .catch((err) => {
                    return {
                        code: 400,
                        success: false,
                        message: err.message,
                    };
                });
                return res;
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
    getProductsByKind(paginationOptions, countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, type, kindId, productClassId } = paginationOptions;
                const findProductsOption = {
                    take: constants_1.PRODUCT_LIMIT_PER_PAGE,
                    skip,
                    relations: ["comments", "class", "prices"],
                    where: {
                        kind: {
                            id: kindId,
                        },
                        country: {
                            countryName,
                        },
                    },
                };
                const totalCountProductOptions = {
                    where: {
                        kind: {
                            id: kindId,
                        },
                        country: {
                            countryName,
                        },
                    },
                };
                if (productClassId && productClassId !== 0) {
                    findProductsOption.where = {
                        kind: {
                            id: kindId,
                        },
                        class: {
                            id: productClassId,
                        },
                        country: {
                            countryName,
                        },
                    };
                    totalCountProductOptions.where = {
                        kind: {
                            id: kindId,
                        },
                        class: {
                            id: productClassId,
                        },
                        country: {
                            countryName,
                        },
                    };
                }
                switch (type) {
                    case "PRICE_DESC":
                        findProductsOption.order = {
                            priceToDisplay: "DESC",
                        };
                        break;
                    case "PRICE_ASC":
                        findProductsOption.order = {
                            priceToDisplay: "ASC",
                        };
                        break;
                    case "DATE_DESC":
                        findProductsOption.order = {
                            createdAt: "DESC",
                        };
                        break;
                    case "SALES_DESC":
                        findProductsOption.order = {
                            sales: "DESC",
                        };
                        break;
                    case "DISCOUNT_DESC":
                        findProductsOption.order = {
                            salesPercent: "DESC",
                        };
                        break;
                    default:
                        break;
                }
                const kind = yield ProductKind_1.ProductKind.findOne({
                    where: {
                        id: kindId,
                    },
                });
                if (!kind)
                    return {
                        code: 400,
                        success: false,
                        message: "Kind not found",
                    };
                const products = yield Product_1.Product.find(findProductsOption);
                const totalCount = yield Product_1.Product.count(totalCountProductOptions);
                const productClasses = yield ProductClass_1.ProductClass.find({
                    where: {
                        kind: {
                            id: kindId,
                        },
                    },
                });
                return {
                    code: 200,
                    success: true,
                    totalCount,
                    pageSize: constants_1.PRODUCT_LIMIT_PER_PAGE,
                    kindId,
                    kindName: kind.name,
                    products,
                    productClasses,
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
    getKindsAndBrands() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const kinds = yield ProductKind_1.ProductKind.find();
                const brands = yield Brand_1.Brand.find();
                return {
                    code: 200,
                    success: true,
                    kinds,
                    brands,
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
    getWebData(localBillProducts, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let products = [];
                if (localBillProducts.length > 0) {
                    console.log(localBillProducts);
                    products = yield Promise.all(localBillProducts.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const price = yield Price_1.Price.findOne({
                            where: {
                                id: item.priceIdForLocal,
                            },
                            relations: ["product"],
                        });
                        if (!price)
                            throw new Error("price not found");
                        const billProduct = BillProduct_1.BillProduct.create({
                            productName: price.product.productName,
                            productThumbnail: price.product.thumbnail,
                            productType: price.type,
                            productPrice: price.price,
                            productAmount: item.productAmount,
                            priceIdForLocal: item.priceIdForLocal,
                            countryNameForDeliveryPrice: item.countryNameForDeliveryPrice,
                        });
                        return billProduct;
                    }))).then((list) => {
                        return list;
                    });
                }
                const brands = yield Brand_1.Brand.find();
                if (user) {
                    const adminExisting = yield Admin_1.Admin.findOne({
                        where: {
                            id: user.userId,
                        },
                    });
                    if (adminExisting) {
                        return {
                            code: 200,
                            success: true,
                            products,
                            brands,
                            avatar: adminExisting.avatar,
                            token: (0, auth_1.createToken)("accessToken", adminExisting.id.toString()),
                            type: "admin",
                        };
                    }
                    else {
                        const userExisting = yield User_1.User.findOne({
                            where: {
                                id: user.userId,
                            },
                        });
                        if (userExisting) {
                            return {
                                code: 200,
                                success: true,
                                products,
                                brands,
                                avatar: userExisting.userAvatar,
                                token: (0, auth_1.createToken)("accessToken", userExisting.id.toString()),
                                type: "user",
                                isHidden: userExisting.isHidden,
                            };
                        }
                        else {
                            return {
                                code: 999,
                                success: true,
                                products,
                                brands,
                            };
                        }
                    }
                }
                else {
                    return {
                        code: 999,
                        success: true,
                        products,
                        brands,
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
};
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "commentCount", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "minPrice", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "maxPrice", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "priceAfterDiscount", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => [String]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "otherInfo", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => [String]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "imageList", null);
__decorate([
    (0, type_graphql_1.FieldResolver)((_return) => Number),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "averageRating", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => ProductResponse_1.ProductResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("productInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductInput_1.ProductInput]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createProduct", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => ProductResponse_1.ProductResponse),
    __param(0, (0, type_graphql_1.Arg)("productId", (_type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProduct", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => ProductResponse_1.ProductResponse),
    __param(0, (0, type_graphql_1.Arg)("value")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProductsBySearchInput", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => Number),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProductPaidAmount", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => PaginationUsersResponse_1.PaginationUsersResponse),
    __param(0, (0, type_graphql_1.Arg)("skip", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getPaginationUsersToday", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => ProductKindResponse_1.ProductKindResponse),
    __param(0, (0, type_graphql_1.Arg)("countryName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProductsForIndex", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => PaginationProductsResponse_1.PaginationProductsResponse),
    __param(0, (0, type_graphql_1.Arg)("paginationOptions")),
    __param(1, (0, type_graphql_1.Arg)("countryName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchOptionsInput_1.PaginationOptionsInput, String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProductsByKind", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => KindBrandClassResponse_1.KindBrandClassResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getKindsAndBrands", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => WebDataResponse_1.WebDataResponse),
    (0, type_graphql_1.UseMiddleware)(getUserId_1.getUserId),
    __param(0, (0, type_graphql_1.Arg)("localBillProducts", (_type) => [BillProductInput_1.BillProductInput])),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getWebData", null);
ProductResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => Product_1.Product)
], ProductResolver);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=ProductResolver.js.map