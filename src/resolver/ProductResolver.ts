import { KindBrandClassResponse } from "../types/response/admin/KindBrandClassResponse";
import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Like } from "typeorm";
import { dataSource } from "../data-source";
import { Brand } from "../entites/Brand";
import { Price } from "../entites/Price";
import { Product } from "../entites/Product";
import { ProductClass } from "../entites/ProductClass";
import { ProductKind } from "../entites/ProductKind";
import { User } from "../entites/User";
import { checkAdmin } from "../middleware/checkAdmin";
import { ProductInput } from "../types/input/ProductInput";
import { PaginationOptionsInput } from "../types/input/SearchOptionsInput";
import { PaginationProductsResponse } from "../types/response/PaginationProductsResponse";
import { PaginationUsersResponse } from "../types/response/PaginationUsersResponse";
import { ProductKindResponse } from "../types/response/ProductKindResponse";
import { ProductResponse } from "../types/response/ProductResponse";
import {
  KOREA,
  KOREA_INFO,
  PRODUCT_LIMIT_PER_PAGE,
  USER_LIMIT,
  AMERICA,
  AMERICA_INFO,
  VIETNAM,
  VIETNAM_INFO,
} from "../utils/constants";
import ProductManager from "../utils/ProductWasPaidCount";
import { WebDataResponse } from "../types/response/WebDataResponse";
import { BillProductInput } from "../types/input/BillProductInput";
import { BillProduct } from "../entites/BillProduct";
import { Context } from "../types/others/Context";
import { getUserId } from "../middleware/getUserId";
import { createToken } from "../utils/auth";
import { Admin } from "../entites/Admin";
import { Country } from "../entites/Country";

@Resolver((_of) => Product)
export class ProductResolver {
  //Field resolver
  @FieldResolver((_return) => Number)
  commentCount(@Root() root: Product) {
    if (root.comments) {
      const commentAmount = root.comments?.length;
      return commentAmount;
    } else {
      return 0;
    }
  }
  @FieldResolver((_return) => Number)
  minPrice(@Root() root: Product) {
    const min = Math.min.apply(
      Math,
      root.prices.map(
        (price) => price.price * ((100 - price.salesPercent) / 100)
      )
    );
    return min;
  }
  @FieldResolver((_return) => Number)
  maxPrice(@Root() root: Product) {
    const max = Math.max.apply(
      Math,
      root.prices.map(
        (price) => price.price * ((100 - price.salesPercent) / 100)
      )
    );
    return max;
  }
  @FieldResolver((_return) => Number)
  priceAfterDiscount(@Root() root: Product) {
    if (root.salesPercent > 0) {
      const price = root.priceToDisplay * ((100 - root.salesPercent) / 100);
      return price;
    } else {
      return root.priceToDisplay;
    }
  }
  @FieldResolver((_return) => [String])
  otherInfo(@Root() root: Product) {
    switch (root.country.countryName) {
      case AMERICA:
        return AMERICA_INFO;
      case KOREA:
        return KOREA_INFO;
      case VIETNAM:
        return VIETNAM_INFO;
      default:
        return [];
    }
  }
  @FieldResolver((_return) => [String])
  imageList(@Root() root: Product) {
    let imageList: string[] = root.imgDescription;
    imageList.unshift(root.thumbnail);
    return imageList;
  }

  @FieldResolver((_return) => Number)
  averageRating(@Root() root: Product) {
    const totalRating = root.comments?.reduce((prev, current) => {
      return prev + current.rating;
    }, 0);
    const commentLenght = root.comments?.length;
    if (totalRating && commentLenght) {
      return totalRating / commentLenght;
    } else return 0;
  }

  //Create product
  @Mutation((_return) => ProductResponse)
  @UseMiddleware(checkAdmin)
  async createProduct(
    @Arg("productInput") productInput: ProductInput
  ): Promise<ProductResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const {
          productName,
          thumbnail,
          imgDescription,
          description,
          prices,

          brandId,
          sales,
          kindId,
          classId,

          countryName,
        } = productInput;

        const brandExisting = await transactionManager.findOne(Brand, {
          where: {
            id: brandId,
          },
        });
        const kindExisting = await transactionManager.findOne(ProductKind, {
          where: {
            id: kindId,
          },
        });
        const classExisting = await transactionManager.findOne(ProductClass, {
          where: {
            id: classId,
          },
        });
        const country = await transactionManager.findOne(Country, {
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

        const totalPrice = prices.reduce(
          (prev, current) => prev + current.price,

          0
        );
        const salesPercent = Math.max.apply(
          Math,
          prices.map((price) => price.salesPercent)
        );

        const newProduct = transactionManager.create(Product, {
          productName,
          thumbnail,
          imgDescription,
          description,
          priceToDisplay: Math.floor(totalPrice / prices.length),
          brand: brandExisting,
          kind: kindExisting,
          class: classExisting,
          sales: sales || 0,
          country: country,
          salesPercent: salesPercent || 0,
        });
        await transactionManager.save(newProduct);

        if (prices) {
          await Promise.all(
            prices.map(async (price) => {
              const newPrice = transactionManager.create(Price, {
                type: price.type,
                price: price.price,
                salesPercent: price.salesPercent,
                status: price.status,
                product: newProduct,
              });
              await transactionManager.save(newPrice);
            })
          ).catch((error) => console.log(error));
        }
        return {
          code: 200,
          success: true,
          message: "Create product successfully!",
          product: newProduct,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Server error:${error.message}`,
        };
      }
    });
  }
  //Get One Product
  @Query((_return) => ProductResponse)
  async getProduct(
    @Arg("productId", (_type) => ID) productId: number
  ): Promise<ProductResponse> {
    try {
      const product = await Product.findOne({
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
      } else {
        return {
          code: 400,
          success: false,
          message: "Không tìm thấy sản phẩm phù hợp.",
        };
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
  //get Product by search input
  @Query((_return) => ProductResponse)
  async getProductsBySearchInput(
    @Arg("value") value: string
  ): Promise<ProductResponse> {
    try {
      if (value.length < 2) {
        return {
          code: 400,
          success: false,
          message: "invalid condition",
        };
      }
      const products = await Product.find({
        where: { productName: Like(`%${value}%`) },
        take: 10,
        relations: ["prices"],
      });
      if (products.length > 0) {
        return {
          code: 200,
          success: true,
          products: products,
        };
      } else {
        return {
          code: 400,
          success: false,
          message: "Không tìm thấy sản phẩm phù hợp",
        };
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  //getProductPaidAmount
  @Query((_return) => Number)
  async getProductPaidAmount(): Promise<number | null> {
    try {
      const count = ProductManager.getProductCount();
      if (count !== undefined && count > 0) {
        return count;
      } else {
        const { sum } = await dataSource
          .getRepository(Product)
          .createQueryBuilder("product")
          .select("SUM(product.sales)", "sum")
          .getRawOne();

        if (sum) {
          ProductManager.setProductCount(sum);
          return sum;
        } else return null;
      }
    } catch (error) {
      return null;
    }
  }

  @Query((_return) => PaginationUsersResponse)
  async getPaginationUsersToday(
    @Arg("skip", { nullable: true }) skip?: number
  ): Promise<PaginationUsersResponse> {
    if (!skip) skip = 0;

    try {
      const users = await User.find({
        // where: {
        //   bills: !null,
        // },
        relations: ["bills"],
        order: {
          createdAt: "DESC",
        },
        take: USER_LIMIT,
        skip,
      });
      //  const date =  new Date('2022-4-12')

      //  const test = await Bill.find({
      //    where:{
      //      createdAt:Equal(date)
      //    }
      //  })
      //  console.log(test)

      const totalCount = await User.count({
        relations: ["bills"],
      });

      const cursor = skip + USER_LIMIT;
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
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  @Query((_return) => ProductKindResponse)
  async getProductsForIndex(
 
    @Arg("countryName") countryName: string
  ): Promise<ProductKindResponse> {
    try {
      const realTake = 10
      const kinds = await ProductKind.find({
        where: {
          countries: {
            countryName,
          },
          products: !null,
        },
        relations: ["countries", "products"],
      });
      const res: ProductKindResponse = await Promise.all(
        kinds.map(async (item) => {
          item.products = await Product.find({
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
              salesPercent:"DESC"
            },
            take: realTake,
            relations: ["comments", "country", "prices", "class"],
          });
          return item;
        })
      )
        .then((list) => {
          return {
            code: 200,
            success: true,
            kinds: list,
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
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  @Query((_return) => PaginationProductsResponse)
  async getProductsByKind(
    @Arg("paginationOptions") paginationOptions: PaginationOptionsInput,
    @Arg("countryName") countryName: string
  ): Promise<PaginationProductsResponse> {
    try {
      const { skip, type, kindId, productClassId } = paginationOptions;

      const findProductsOption: { [key: string]: any } = {
        take: PRODUCT_LIMIT_PER_PAGE,
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
      const totalCountProductOptions: { [key: string]: any } = {
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
      const kind = await ProductKind.findOne({
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

      const products = await Product.find(findProductsOption);

      const totalCount = await Product.count(totalCountProductOptions);
      const productClasses = await ProductClass.find({
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
        pageSize: PRODUCT_LIMIT_PER_PAGE,
        kindId,
        kindName: kind.name,
        products,
        productClasses,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  @Query((_return) => KindBrandClassResponse)
  async getKindsAndBrands(): Promise<KindBrandClassResponse> {
    try {
      const kinds = await ProductKind.find();
      const brands = await Brand.find();

      return {
        code: 200,
        success: true,
        kinds,
        brands,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  @Query((_return) => WebDataResponse)
  @UseMiddleware(getUserId)
  async getWebData(
    @Arg("localBillProducts", (_type) => [BillProductInput])
    localBillProducts: BillProductInput[],
    @Ctx() { user }: Context
  ): Promise<WebDataResponse> {
    try {
      const products: BillProduct[] = await Promise.all<BillProduct>(
        localBillProducts.map(async (item) => {
          const price = await Price.findOne({
            where: {
              id: item.priceIdForLocal,
            },
            relations: ["product"],
          });
          if (!price) throw new Error("price not found");

          const billProduct = BillProduct.create({
            productName: price.product.productName,
            productThumbnail: price.product.thumbnail,
            productType: price.type,
            productPrice: price.price,
            productAmount: item.productAmount,
            priceIdForLocal: item.priceIdForLocal,
            countryNameForDeliveryPrice: item.countryNameForDeliveryPrice,
          });

          return billProduct;
        })
      ).then((list) => {
        return list;
      });

      const brands = await Brand.find();
      if(user){
        const adminExisting = await Admin.findOne({
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
            token: createToken("accessToken", adminExisting.id.toString()),
            type: "admin",
          };
        } else {
          const userExisting = await User.findOne({
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
              token: createToken("accessToken", userExisting.id.toString()),
              type: "user",
              isHidden: userExisting.isHidden,
            };
          } else {
            return {
              code: 999,
              success: true,
              products,
              brands,
            };
          }
        }
      }else{
        return {
          code: 999,
          success: true,
          products,
          brands,
        };
      }
      
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
}
