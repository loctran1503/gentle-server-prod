import { BrandResponse } from "../types/response/BrandResponse";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { BrandInput } from "../types/input/BrandInput";
import { Brand } from "../entites/Brand";

import { ProductClass } from "../entites/ProductClass";
import { PaginationBrandWithProductsResponse } from "../types/response/PaginationBrandWithProductsResponse";
import { PaginationOptionsInput } from "../types/input/SearchOptionsInput";
import { PRODUCT_LIMIT_PER_PAGE } from "../utils/constants";
import { Product } from "../entites/Product";
import { dataSource } from "../data-source";

@Resolver()
export class BrandResolver {
  //get Brand with Product
  @Query((_return) => PaginationBrandWithProductsResponse)
  async getBrandWithProducts(
    @Arg("paginationOptions") paginationOptions: PaginationOptionsInput
  ): Promise<PaginationBrandWithProductsResponse> {
    try {
      const { skip, type, productClassId, brandId } = paginationOptions;

      const brandWithProducts = await Brand.findOne({
        where: {
          id: brandId,
        },

        relations: ["productClasses"],
      });
      const option: { [key: string]: any } = {
        take: PRODUCT_LIMIT_PER_PAGE,
        skip,
        relations: ["comments", "class", "prices"],
        where: {
          brand: {
            id: brandId,
          },
        },
      };
      const totalCountOptions: { [key: string]: any } = {
        where: {
          brand: {
            id: brandId,
          },
        },
      };
      //have productClass
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

      const products = await Product.find(option);
      if (!products)
        return {
          code: 400,
          success: false,
          message: "Products not found",
        };
      brandWithProducts!.products = products;
      const totalCount = await Product.count(totalCountOptions);

      if (brandWithProducts) {
        return {
          code: 200,
          success: true,
          totalCount,
          pageSize: PRODUCT_LIMIT_PER_PAGE,
          brandWithProducts,
        };
      } else {
        return {
          code: 400,
          success: false,
          message: "Brand not found",
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

  //create Brand
  @Mutation((_return) => BrandResponse)
  async adminCreateBrand(
    @Arg("brandInput")
    { brandName, thumbnail, productClassId }: BrandInput
  ): Promise<BrandResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const productClass = await transactionManager.findOne(ProductClass, {
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

        const newBrand = transactionManager.create(Brand, {
          brandName,
          thumbnail,
          productClasses: [productClass],
        });

        await transactionManager.save(newBrand);
        return {
          code: 200,
          success: true,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: error.message,
        };
      }
    });
  }
}
