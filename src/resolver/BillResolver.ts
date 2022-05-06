import { dataSource } from "../data-source";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from "type-graphql";
import { LessThan } from "typeorm";
import { Bill } from "../entites/Bill";
import { BillCancelReason } from "../entites/BillCancelReason";
import { BillProduct } from "../entites/BillProduct";
import { Customer } from "../entites/Customer";
import { Price } from "../entites/Price";
import { User } from "../entites/User";
import { checkAuth } from "../middleware/checkAuth";
import { getUserId } from "../middleware/getUserId";
import { BillInput } from "../types/input/BillInput";
import { BillProductInput } from "../types/input/BillProductInput";
import { BillStatusType } from "../types/others/BillStatusType";
import { Context } from "../types/others/Context";
import { BillResponse } from "../types/response/BillResponse";
import { CartProductResponse } from "../types/response/CartProductResponse";
import { GiftResponse } from "../types/response/GiftResponse";
import { IntroducePriceCaculater } from "../utils/IntroducePriceCaculater";
import { MONEY_COMMENT_PERCENT, REJECTED_AMOUNT } from "../utils/constants";


@Resolver((_of) => Bill)
export class BillResolver {
  //FieldResolver
  @FieldResolver((_return) => Number)
  totalPrice(@Root() root: Bill) {
    let totalPrice = root.billProducts.reduce(
      (prev, current) => prev + current.productAmount * current.productPrice,
      0
    );
    if (root.introduceCode) {
      totalPrice =
        totalPrice - IntroducePriceCaculater(totalPrice) + root.deliveryPrice;
      return totalPrice;
    } else {
      if (root.paymentDown > 0) {
        totalPrice = totalPrice + root.deliveryPrice - root.paymentDown;
        return totalPrice;
      } else {
        totalPrice = totalPrice + root.deliveryPrice;
        return totalPrice;
      }
    }
  }
  @FieldResolver(_return => Number)
  commentPrice(@Root() root : Bill){
    let totalPrice = root.billProducts.reduce(
      (prev, current) => prev + current.productAmount * current.productPrice,
      0
    );
    if (root.introduceCode) {
      totalPrice =
        totalPrice - IntroducePriceCaculater(totalPrice) + root.deliveryPrice;
      return totalPrice * MONEY_COMMENT_PERCENT
    } else {
      if (root.paymentDown > 0) {
        totalPrice = totalPrice + root.deliveryPrice - root.paymentDown;
        return totalPrice * MONEY_COMMENT_PERCENT
      } else {
        totalPrice = totalPrice + root.deliveryPrice;
        return totalPrice * MONEY_COMMENT_PERCENT
      }
    }
  }
  @FieldResolver((_return) => Number)
  introducePrice(@Root() root: Bill) {
    let totalPrice = root.billProducts.reduce(
      (prev, current) => prev + current.productAmount * current.productPrice,
      0
    );
    if (root.introduceCode) {
      return IntroducePriceCaculater(totalPrice);
    } else {
      return 0;
    }
  }
  //get product temp in localStorage
  @Query((_return) => CartProductResponse)
  async getCartProduct(
    @Arg("localBillProducts", (_type) => [BillProductInput])
    localBillProducts: BillProductInput[]
  ): Promise<CartProductResponse> {
    try {
      const res: BillProduct[] = await Promise.all<BillProduct>(
        localBillProducts.map(async (item) => {
          const price = await Price.findOne({
            where: {
              id: item.priceIdForLocal,
            },
            relations: ["product"],
          });

          const billProduct = BillProduct.create({
            productName: price!.product.productName,
            productThumbnail: price!.product.thumbnail,
            productType: price!.type,
            productPrice: price!.price,
            productAmount: item.productAmount,
            priceIdForLocal: item.priceIdForLocal,
          });
          return billProduct;
        })
      ).then((list) => {
        return list;
      });

      return {
        code: 200,
        success: true,
        products: res,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  //get Gift
  @Query((_return) => GiftResponse)
  async getGift(
    @Arg("priceCondition") priceCondition: number
  ): Promise<GiftResponse> {
    try {
      let takeCondition: number = 1;
      if (priceCondition > 5000000 && priceCondition < 10000000)
        takeCondition = 2;
      else if (priceCondition > 10000000) takeCondition = 3;

      const items = await Price.find({
        where: {
          price: LessThan(priceCondition),
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
      } else {
        return {
          code: 400,
          success: false,
          message: "Price not found",
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
  //get Prices with Condition(for user change gift)
  @Query((_return) => GiftResponse)
  async getGifts(
    @Arg("priceCondition") priceCondition: number
  ): Promise<GiftResponse> {
    try {
      const gifts = await Price.find({
        where: {
          price: LessThan(priceCondition),
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
      } else {
        return {
          code: 400,
          success: false,
          message: "Gifts not found",
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
  //Create bill
  @Mutation((_return) => BillResponse)
  @UseMiddleware(getUserId)
  async createBill(
    @Arg("billInput") billInput: BillInput,
    @Ctx() { user }: Context
  ): Promise<BillResponse> {
    return await dataSource.transaction(async transactionManager =>{
      try {
        const {
          notice,
          introduceCode,
          customer,
          products,
          deliveryPrice,
          paymentType,
        } = billInput;
  
        const customerExisting = await transactionManager.findOne(Customer,{
          where: {
            customerPhone: customer.customerPhone,
          },
        });
  
        if (customerExisting && customerExisting.rejectedAmount > REJECTED_AMOUNT)
          return {
            code: 400,
            success: false,
            message: "numberphone is locked",
          };
  
        const newCustomer = transactionManager.create(Customer,{
          ...customer,
        });
  
        await transactionManager.save(newCustomer);
        const newBill = Bill.create({
          customer: newCustomer,
          deliveryPrice,
          paymentType,
        });
        if (notice) {
          newBill.notice = notice;
        }
  
        if (user !== undefined && user.userId !== undefined) {
          const userExisting = await transactionManager.findOne(User,{
            where: {
              id: user.userId,
            },
          });
          if(userExisting) newBill.user = userExisting
        }
        if (introduceCode) newBill.introduceCode = introduceCode;
  
        await transactionManager.save(newBill);
        await Promise.all(
          products.map(async (product) => {
            const newProduct = transactionManager.create(BillProduct,{
              productName: product.productName,
              productThumbnail: product.productThumbnail,
              productType: product.productType,
              productPrice: product.productPrice,
              productAmount: product.productAmount,
              bill: newBill,
            });
            await transactionManager.save(newProduct);
            return newProduct;
          })
        ).catch((err) => {
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
      } catch (error) {
        console.log(error.message);
        return {
          code: 500,
          success: false,
          message: `Server error:${error.message}`,
        };
      }
    })
  }
  @Mutation((_return) => BillResponse)
  @UseMiddleware(checkAuth)
  async handleBillCancel(@Arg("billId") billId: number,@Arg("reason")reason :string): Promise<BillResponse> {
    return await dataSource.transaction(async transactionManager =>{
      try {
        const billExisting = await transactionManager.findOne(Bill,{
          where: {
            id: billId,
          },
          relations:["customer"]
        });
        if (!billExisting)
          return {
            code: 400,
            success: false,
            message: "bill not found",
          };
        if (
          billExisting.billStatus === BillStatusType.DELIVERING ||
          billExisting.billStatus === BillStatusType.COMPLETED ||
          billExisting.billStatus === BillStatusType.CANCEL
        )
          return {
            code: 400,
            success: false,
            message: "This bill cannot cancel",
          };
        //Everything ok
        billExisting.billStatus = BillStatusType.CANCEL;
        await transactionManager.save(billExisting);
  
        if(reason!==""){
          const newBillCancelReason = transactionManager.create(BillCancelReason,{
            reason,
            customer:billExisting.customer
          })
          await transactionManager.save(newBillCancelReason)
        }
        return {
          code: 200,
          success: true,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Server error:${error.message}`,
        };
      }
    })
  }

}
