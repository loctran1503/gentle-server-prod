import { Country } from "../entites/Country";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { dataSource } from "../data-source";
import { Admin } from "../entites/Admin";
import { Bill } from "../entites/Bill";
import { Brand } from "../entites/Brand";
import { Customer } from "../entites/Customer";
import { Feedback } from "../entites/Feedback";
import { MoneyBonus } from "../entites/MoneyBonus";

import { Price } from "../entites/Price";
import { Product } from "../entites/Product";
import { ProductClass } from "../entites/ProductClass";
import { ProductKind } from "../entites/ProductKind";
import { TakeMoneyField } from "../entites/TakeMoneyField";
import { User } from "../entites/User";
import { UserComment } from "../entites/UserComment";
import { checkAdmin } from "../middleware/checkAdmin";
import { FeedbackInput } from "../types/input/FeedbackInput";
import { PriceInput } from "../types/input/PriceInput";
import { BillStatusType } from "../types/others/BillStatusType";
import { Context } from "../types/others/Context";

import { DashboardResponse } from "../types/response/admin/DashboardResponse";
import { KindBrandClassResponse } from "../types/response/admin/KindBrandClassResponse";
import { PriceResponse } from "../types/response/admin/PriceResponse";
import { TakeMoneyFieldResponse } from "../types/response/admin/TakeMoneyFieldResponse";
import { BillResponse } from "../types/response/BillResponse";
import { CommentResponse } from "../types/response/CommentResponse";
import { ProductKindResponse } from "../types/response/ProductKindResponse";
import { SimpleResponse } from "../types/response/SimpleResponse";
import { UserResponse } from "../types/response/UserResponse";
import { createToken, sendRefreshToken } from "../utils/auth";
import { IntroducePriceCaculater } from "../utils/IntroducePriceCaculater";
import { MoneyConverter } from "../utils/MoneyConverter";
import ProductManager from "../utils/ProductWasPaidCount";
import { TakeMoneyFieldType } from "../types/others/TakeMoneyFieldType";

@Resolver()
export class AdminResolver {
  //Create admin
  @Mutation((_return) => UserResponse)
  async createAdmin(
    @Arg("adminId") adminId: string,
    @Ctx() { res }: Context
  ): Promise<UserResponse> {
    return await dataSource.transaction(async (transactionEntityManager) => {
      try {
        const adminExisting = await transactionEntityManager.findOne(Admin, {
          where: {
            adminId: adminId,
          },
        });
        if (adminExisting) {
          sendRefreshToken(res, adminExisting.id.toString());
          return {
            code: 200,
            success: true,
            token: createToken("accessToken", adminExisting.id.toString()),
          };
        } else {
          const newAdmin = transactionEntityManager.create(Admin, {
            adminId,
            adminName: "Memories",
            avatar: "none",
          });
          await transactionEntityManager.save(newAdmin);
          sendRefreshToken(res, newAdmin.id.toString());
          return {
            code: 200,
            success: true,
            token: createToken("accessToken", newAdmin.id.toString()),
          };
        }
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: error.message,
        };
      }
    });
  }
  //Create productKind
  @Mutation((_return) => ProductKindResponse)
  @UseMiddleware(checkAdmin)
  async adminCreateProductKind(
    @Arg("name") name: string,
  ): Promise<ProductKindResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {  

        const countries =await  Country.find()
        if(!countries){
          return{
            code:400,
            success:false,
            message:"Country not found"
          }
        }
        const newProductKind = transactionManager.create(ProductKind, {
          name,
          countries
        });
        await transactionManager.save(newProductKind);
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
  //Create productClass
  @Mutation((_return) => ProductKindResponse)
  @UseMiddleware(checkAdmin)
  async adminCreateProductClass(
    @Arg("name") name: string,
    @Arg("id") id: number
  ): Promise<ProductKindResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const productKindExisting = await transactionManager.findOne(
          ProductKind,
          {
            where: {
              id,
            },
          }
        );
        if (!productKindExisting)
          return {
            code: 400,
            success: false,
            message: "ProductKind not found",
          };

        const newProductClass = transactionManager.create(ProductClass, {
          name,
          kind: productKindExisting,
        });
        await transactionManager.save(newProductClass);
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

  //Count For Dashboard
  @Query((_return) => DashboardResponse)
  @UseMiddleware(checkAdmin)
  async dashboard(): Promise<DashboardResponse> {
    return await dataSource.transaction(async (transactionEntityManager) => {
      try {
        let result: DashboardResponse = {
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

        const takeMoneyField = await transactionEntityManager.count(
          TakeMoneyField,
          {
            where: {
              status: TakeMoneyFieldType.PENDING,
            },
          }
        );

        if (takeMoneyField > 0) result.takeMoneyField = takeMoneyField;

        //////
        const cancel = await transactionEntityManager.count(Bill, {
          where: {
            billStatus: BillStatusType.CANCEL,
          },
        });
        if (cancel > 0) result.cancel = cancel;

        //////
        const confirmWaiting = await transactionEntityManager.count(Bill, {
          where: {
            billStatus: BillStatusType.COMFIRM_WAITING,
          },
        });
        if (confirmWaiting > 0) result.confirmWaiting = confirmWaiting;

        //////
        const confirmed = await transactionEntityManager.count(Bill, {
          where: {
            billStatus: BillStatusType.CONFIRMED,
          },
        });
        if (confirmed > 0) result.confirmed = confirmed;
        //////

        const packed = await transactionEntityManager.count(Bill, {
          where: {
            billStatus: BillStatusType.PACKED,
          },
        });
        if (packed > 0) result.packed = packed;
        //////
        const delivering = await transactionEntityManager.count(Bill, {
          where: {
            billStatus: BillStatusType.DELIVERING,
          },
        });
        if (delivering > 0) result.delivering = delivering;
        /////
        const commentNoFeedback = await transactionEntityManager.count(
          UserComment,
          {
            where: {
              isFeedback: false,
            },
          }
        );
        if (commentNoFeedback > 0) result.commentNoFeedback = commentNoFeedback;

        return result;
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: error.message,
        };
      }
    });
  }
  //get kind , brand , class
  @Query((_return) => KindBrandClassResponse)
  @UseMiddleware(checkAdmin)
  async adminGetKindBrandClass(): Promise<KindBrandClassResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const kinds = await transactionManager.find(ProductKind);
        const brands = await transactionManager.find(Brand);
        const classes = await transactionManager.find(ProductClass, {
          relations: ["kind"],
        });

        return {
          code: 200,
          success: true,
          kinds,
          brands,
          classes,
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

  //get bills(Dashboard)
  @Query((_return) => BillResponse)
  async adminGetBills(@Arg("type") type: String): Promise<BillResponse> {
    try {
      const bills = await Bill.find({
        where: {
          billStatus: type as BillStatusType,
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
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
  //get takemoney field (dashboard)
  @Query((_return) => TakeMoneyFieldResponse)
  @UseMiddleware(checkAdmin)
  async adminGetTakeMoneyFields(): Promise<TakeMoneyFieldResponse> {
    try {
      const fields = await TakeMoneyField.find({
        where: {
          status: TakeMoneyFieldType.PENDING,
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
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
  //get comment no feedback(dashboard)
  @Query((_return) => CommentResponse)
  async adminGetCommentsNoFeedback(): Promise<CommentResponse> {
    try {
      const comments = await UserComment.find({
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
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
  // take money to success
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAdmin)
  async adminTakeMoneyFieldCompleted(
    @Arg("fieldId") fieldId: number,
    @Arg("imageSuccess") imageSuccess: string
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const fieldExisting = await transactionManager.findOne(TakeMoneyField, {
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
        fieldExisting.status = TakeMoneyFieldType.SUCCESS
     
        await transactionManager.save(fieldExisting);

        return {
          code: 200,
          success: true,
          message: "Edit TakeMoneyField Successfully!",
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
  // take money to cancel
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAdmin)
  async adminTakeMoneyFieldCancel(
    @Arg("fieldId") fieldId: number,
    @Arg("cancelReason") cancelReason: string
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const fieldExisting = await transactionManager.findOne(TakeMoneyField, {
          where: {
            id: fieldId,
          },
          relations: ["user"],
        });
        const userExisting = await transactionManager.findOne(User,{
          where:{
            id:fieldExisting?.user.id
          }
        })
        if (!fieldExisting)
        return {
          code: 400,
          success: false,
          message: "TakeMoneyField not found",
        };
        if(!userExisting){
          return{
            code:400,
            success:false,
            message:"User not found"
          }
        }
        userExisting.moneyDepot += fieldExisting.money
        await transactionManager.save(userExisting)
       
        fieldExisting.status = TakeMoneyFieldType.FAIL;
        fieldExisting.cancelReason = cancelReason;
        await transactionManager.save(fieldExisting);

        return {
          code: 200,
          success: true,
          message: "Cancel TakeMoneyField Successfully!",
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
  //Create feedback
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAdmin)
  async adminCreateFeedback(
    @Arg("feedbackInput") feedbackInput: FeedbackInput,
    @Ctx() { user }: Context
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      const { content, commentId } = feedbackInput;
      try {
        const commentExisting = await transactionManager.findOne(UserComment, {
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
        const adminExisting = await transactionManager.findOne(Admin, {
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
        const newFeedback = transactionManager.create(Feedback, {
          content,
          admin: adminExisting,
          comment: commentExisting,
        });
        await transactionManager.save(newFeedback);
        commentExisting.isFeedback = true;
        await transactionManager.save(commentExisting);
        return {
          code: 200,
          success: true,
          message: "Create feedback successfully!",
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
  //Edit BillStatus
  @Mutation((_return) => BillResponse)
  @UseMiddleware(checkAdmin)
  async adminEditBillStatus(
    @Arg("billId") billId: number,
    @Arg("status") status: String,
    @Arg("paymentDown") paymentDown: number
  ): Promise<BillResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        if ((status as BillStatusType) === BillStatusType.COMPLETED) {
          return {
            code: 400,
            success: false,
            message: "Value invalid",
          };
        }

        const billExisting = await transactionManager.findOne(Bill, {
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

        billExisting.billStatus = status as BillStatusType;
        if (paymentDown) billExisting.paymentDown = paymentDown;
        await transactionManager.save(billExisting);
        return {
          code: 200,
          success: true,
          bill: billExisting,
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
  @Mutation((_return) => BillResponse)
  @UseMiddleware(checkAdmin)
  async adminHandleBillCompleted(
    @Arg("billId") billId: number,
    @Arg("totalPrice") totalPrice: number
  ): Promise<BillResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const billExisting = await transactionManager.findOne(Bill, {
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
        //Increase product paidcount
        billExisting.billProducts.map(async (item) => {
          if (item.productType !== "gift") {
            const product = await transactionManager.findOne(Product, {
              where: {
                productName: item.productName,
              },
            });
            if (product) {
              product.sales += item.productAmount;
              await transactionManager.save(product);
            }
          }
        });
        ProductManager.setProductCount(0);
        //change isComment
        billExisting.isCommented = false;
        billExisting.billStatus = BillStatusType.COMPLETED;
        await transactionManager.save(billExisting);

        //Introduce code
        if (billExisting.introduceCode) {
          const userExisting = await transactionManager.findOne(User, {
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

          const newFieldMoneyBonus = transactionManager.create(MoneyBonus, {
            description: `Bạn vừa nhận được ${MoneyConverter(
              IntroducePriceCaculater(totalPrice)
            )} từ mã giới thiệu`,
            moneyNumber: IntroducePriceCaculater(totalPrice),
            user: userExisting,
          });
          userExisting.moneyDepot += IntroducePriceCaculater(totalPrice)
          await transactionManager.save(userExisting)
          await transactionManager.save(newFieldMoneyBonus);
          return {
            code: 200,
            success: true,
            message:
              "Convert bill to Completed with Introduce code successfully!",
          };
        } else {
          return {
            code: 200,
            success: true,
            message: "Convert bill with No Introduce code successfully!",
          };
        }
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Server error:${error.message}`,
        };
      }
    });
  }
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAdmin)
  async adminHandleBillReject(
    @Arg("billId") billId: number
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const billExisting = await transactionManager.findOne(Bill, {
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
        const customerExisting = await transactionManager.findOne(Customer, {
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
        billExisting.billStatus = BillStatusType.CANCEL;
        await transactionManager.save(billExisting);
        customerExisting.rejectedAmount++;
        await transactionManager.save(customerExisting);
        return {
          success: true,
          code: 200,
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
  @Mutation((_return) => PriceResponse)
  async adminEditProductPrice(
    @Arg("priceId") priceId: number,
    @Arg("priceChanging") priceChanging: number
  ): Promise<PriceResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const priceExisting = await transactionManager.findOne(Price, {
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
        await transactionManager.save(priceExisting);
        return {
          code: 200,
          success: true,
          price: priceExisting,
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

  //get Product Kind
  @Query((_return) => ProductKindResponse)
  @UseMiddleware(checkAdmin)
  async adminGetProductKinds(): Promise<ProductKindResponse> {
    try {
      const items = await ProductKind.find();
  
      return {
        code: 200,
        success: true,
        kinds: items,
  
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
    //get Product Class
    @Query((_return) => ProductKindResponse)
    @UseMiddleware(checkAdmin)
    async adminGetProductClasses(): Promise<ProductKindResponse> {
      try {
        const classes = await ProductClass.find();
    
        return {
          code: 200,
          success: true,
          classes,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Server error:${error.message}`,
        };
      }
    }

  //create or edit price field
  @Mutation((_return) => PriceResponse)
  @UseMiddleware(checkAdmin)
  async adminCreateOrEditPrice(
    @Arg("priceInput") priceInput: PriceInput,
    @Arg("priceId") priceId: number,
    @Arg("productId") productId: number
  ): Promise<PriceResponse> {
    return await dataSource.transaction(async (transactionEntityManager) => {
      const productExisting = await transactionEntityManager.findOne(Product, {
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
      const priceExisting = await transactionEntityManager.findOne(Price, {
        where: {
          id: priceId,
        },
      });
      if (priceExisting) {
        const checkDiscountOfProductAndPrice =
          productExisting.salesPercent === priceExisting.salesPercent;
          
        priceExisting.type = priceInput.type;
        priceExisting.status = priceInput.status;
        priceExisting.price = priceInput.price;
        priceExisting.salesPercent = priceInput.salesPercent;
        await transactionEntityManager.save(priceExisting);
        const totalPrice = productExisting.prices.reduce(
          (prev, current) => prev + current.price,
          0
        );
        //change pricetoDisplay and pricePercent of product if need
        productExisting.priceToDisplay = Math.floor(
          totalPrice / productExisting.prices.length
        );
        if (checkDiscountOfProductAndPrice) {
          productExisting.salesPercent = priceInput.salesPercent;
        }
        await transactionEntityManager.save(productExisting);
        return {
          code: 200,
          success: true,
          message: "Edit price successfully!",
          price: priceExisting,
        };
      } else {
        const newPrice = Price.create({
          type: priceInput.type,
          status: priceInput.status,
          price: priceInput.price,
          product: productExisting,
          salesPercent: priceInput.salesPercent,
        });
        await transactionEntityManager.save(newPrice);
        return {
          code: 200,
          success: true,
          message: "Create new price successfully!",
          price: newPrice,
        };
      }
    });
  }
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAdmin)
  async adminAddClassToBrand(
    @Arg("brandId") brandId: number,
    @Arg("classId") classId: number
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const brandExisting = await transactionManager.findOne(Brand, {
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
        const classExisting = await transactionManager.findOne(ProductClass, {
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

        await transactionManager.save(brandExisting);
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
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAdmin)
  async adminCreateCountry(
    @Arg("countryName") countryName: string
  ): Promise<SimpleResponse> {
    try {
      const newCountry = Country.create({
        countryName,
      });
      await newCountry.save();
      return {
        code: 200,
        success: true,
        message: "Create Country successfully!",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
}
