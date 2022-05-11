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
exports.BrandResolver = void 0;
const BrandResponse_1 = require("../types/response/BrandResponse");
const type_graphql_1 = require("type-graphql");
const BrandInput_1 = require("../types/input/BrandInput");
const Brand_1 = require("../entites/Brand");
const ProductClass_1 = require("../entites/ProductClass");
const PaginationBrandWithProductsResponse_1 = require("../types/response/PaginationBrandWithProductsResponse");
const SearchOptionsInput_1 = require("../types/input/SearchOptionsInput");
const constants_1 = require("../utils/constants");
const Product_1 = require("../entites/Product");
const data_source_1 = require("../data-source");
let BrandResolver = class BrandResolver {
    getBrandWithProducts(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, type, productClassId, brandId } = paginationOptions;
                const brandWithProducts = yield Brand_1.Brand.findOne({
                    where: {
                        id: brandId,
                    },
                    relations: ["productClasses"],
                });
                const option = {
                    take: constants_1.PRODUCT_LIMIT_PER_PAGE,
                    skip,
                    relations: ["comments", "class", "prices"],
                    where: {
                        brand: {
                            id: brandId,
                        },
                    },
                };
                const totalCountOptions = {
                    where: {
                        brand: {
                            id: brandId,
                        },
                    },
                };
                if (productClassId && productClassId !== 0) {
                    option.where = {
                        brand: {
                            id: brandId,
                        },
                        class: {
                            id: productClassId,
                        },
                    };
                    totalCountOptions.where = {
                        brand: {
                            id: brandId,
                        },
                        class: {
                            id: productClassId,
                        },
                    };
                }
                switch (type) {
                    case "PRICE_DESC":
                        option.order = {
                            priceToDisplay: "DESC",
                        };
                        break;
                    case "PRICE_ASC":
                        option.order = {
                            priceToDisplay: "ASC",
                        };
                        break;
                    case "DATE_DESC":
                        option.order = {
                            createdAt: "DESC",
                        };
                        break;
                    case "SALES_DESC":
                        option.order = {
                            sales: "DESC",
                        };
                        break;
                    case "DISCOUNT_DESC":
                        option.order = {
                            salesPercent: "DESC",
                        };
                        break;
                    default:
                        break;
                }
                const products = yield Product_1.Product.find(option);
                if (!products)
                    return {
                        code: 400,
                        success: false,
                        message: "Products not found",
                    };
                brandWithProducts.products = products;
                const totalCount = yield Product_1.Product.count(totalCountOptions);
                if (brandWithProducts) {
                    return {
                        code: 200,
                        success: true,
                        totalCount,
                        pageSize: constants_1.PRODUCT_LIMIT_PER_PAGE,
                        brandWithProducts,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "Brand not found",
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
    adminCreateBrand({ brandName, thumbnail, productClassId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const productClass = yield transactionManager.findOne(ProductClass_1.ProductClass, {
                        where: {
                            id: productClassId,
                        },
                    });
                    if (!productClass)
                        return {
                            code: 400,
                            success: false,
                            message: "ProductClass not found",
                        };
                    const newBrand = transactionManager.create(Brand_1.Brand, {
                        brandName,
                        thumbnail,
                        productClasses: [productClass],
                    });
                    yield transactionManager.save(newBrand);
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
};
__decorate([
    (0, type_graphql_1.Query)((_return) => PaginationBrandWithProductsResponse_1.PaginationBrandWithProductsResponse),
    __param(0, (0, type_graphql_1.Arg)("paginationOptions")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchOptionsInput_1.PaginationOptionsInput]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "getBrandWithProducts", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => BrandResponse_1.BrandResponse),
    __param(0, (0, type_graphql_1.Arg)("brandInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BrandInput_1.BrandInput]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "adminCreateBrand", null);
BrandResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BrandResolver);
exports.BrandResolver = BrandResolver;
//# sourceMappingURL=BrandResolver.js.map