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
import { PRODUCT_LIMIT_PER_PAGE, USER_LIMIT } from "../utils/constants";
import ProductManager from "../utils/ProductWasPaidCount";
import { WebDataResponse } from "../types/response/WebDataResponse";
import { BillProductInput } from "../types/input/BillProductInput";
import { BillProduct } from "../entites/BillProduct";
import { Context } from "../types/others/Context";
import { getUserId } from "../middleware/getUserId";
import { createToken } from "../utils/auth";
import { Admin } from "../entites/Admin";

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
      root.prices.map((price) => price.price)
    );
    return min;
  }
  @FieldResolver((_return) => Number)
  maxPrice(@Root() root: Product) {
    const max = Math.max.apply(
      Math,
      root.prices.map((price) => price.price)
    );
    return max;
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
          priceToDisplay,
          brandId,
          sales,
          kindId,
          classId,
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

        if (!brandExisting || !kindExisting || !classExisting)
          return {
            code: 400,
            success: false,
            message: "Brand or kind or class not found",
          };

        const newProduct = transactionManager.create(Product, {
          productName,
          thumbnail,
          imgDescription,
          description,
          priceToDisplay,
          brand: brandExisting,
          kind: kindExisting,
          class: classExisting,
        });
        if (sales) newProduct.sales = sales;
        await transactionManager.save(newProduct);

        if (prices) {
          await Promise.all(
            prices.map(async (price) => {
              const newPrice = transactionManager.create(Price, {
                ...price,
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

  // Get All Product
  @Query((_return) => PaginationProductsResponse)
  async getProducts(
    @Arg("paginationOptions") paginationOptions: PaginationOptionsInput
  ): Promise<PaginationProductsResponse> {
    try {
      const { skip, type } = paginationOptions;
      const option: { [key: string]: any } = {
        take: PRODUCT_LIMIT_PER_PAGE,
        skip,
        relations: ["comments", "prices"],
      };

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
        default:
          break;
      }

      const products = await Product.find(option);
      const totalCount = await Product.count();
      return {
        code: 200,
        success: true,
        totalCount,
        pageSize: PRODUCT_LIMIT_PER_PAGE,
        products,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
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
    @Arg("take") take: number
  ): Promise<ProductKindResponse> {
    try {
      const realTake = Math.min(6, take);
      const kinds = await ProductKind.find();
      const res: ProductKindResponse = await Promise.all(
        kinds.map(async (item) => {
          item.products = await Product.find({
            where: {
              kind: {
                id: item.id,
              },
            },
            order: {
              sales: "DESC",
            },
            take: realTake,
            relations: ["kind", "class", "comments"],
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
    @Arg("paginationOptions") paginationOptions: PaginationOptionsInput
  ): Promise<PaginationProductsResponse> {
    try {
      const { skip, type, kindId, productClassId } = paginationOptions;

      const option: { [key: string]: any } = {
        take: PRODUCT_LIMIT_PER_PAGE,
        skip,
        relations: ["comments", "class", "prices"],
        where: {
          kind: {
            id: kindId,
          },
        },
      };
      const totalCountOptions: { [key: string]: any } = {
        where: {
          kind: {
            id: kindId,
          },
        },
      };

      if (productClassId && productClassId !== 0) {
        option.where = {
          kind: {
            id: kindId,
          },
          class: {
            id: productClassId,
          },
        };
        totalCountOptions.where = {
          kind: {
            id: kindId,
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

      const products = await Product.find(option);

      const totalCount = await Product.count(totalCountOptions);
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
          });
          return billProduct;
        })
      ).then((list) => {
        return list;
      });
      const kinds = await ProductKind.find();
      const brands = await Brand.find();
   
      if (user.userId!==undefined) {
    
        const adminExisting = await Admin.findOne({
          where:{
            id:user.userId
          }
        })
        if(adminExisting){

          return {
            code: 200,
            success: true,
            products,
            kinds,
            brands,
            avatar: adminExisting.avatar,
            token: createToken("accessToken", adminExisting.id.toString()),
            type:"admin"
          };

        }else{
          const userExisting = await User.findOne({
            where: {
              id: +user.userId,
            },
          });
       
          if (userExisting) {
            return {
              code: 200,
              success: true,
              products,
              kinds,
              brands,
              avatar: userExisting.userAvatar,
              token: createToken("accessToken", userExisting.id.toString()),
              type:"user",
              isHidden:userExisting.isHidden
            };
          } else {
            return {
              code: 400,
              success: false,
              message: "User not found",
            };
          }
        }

        
      } else {
        return {
          code: 200,
          success: true,
          products,
          kinds,
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
