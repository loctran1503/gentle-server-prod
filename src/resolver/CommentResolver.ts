import { PaginationCommentsResponse } from "../types/response/PaginationFeedbackResponse";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Bill } from "../entites/Bill";
import { MoneyBonus } from "../entites/MoneyBonus";
import { Product } from "../entites/Product";
import { User } from "../entites/User";
import { UserComment } from "../entites/UserComment";
import { checkAuth } from "../middleware/checkAuth";
import { CommentInput } from "../types/input/CommentInput";
import { Context } from "../types/others/Context";

import { CommentResponse } from "../types/response/CommentResponse";
import {
  CommentPriceCaculater,
  IntroducePriceCaculater,
} from "../utils/IntroducePriceCaculater";
import { MoneyConverter } from "../utils/MoneyConverter";
import { COMMENT_LIMIT_PER_PAGE } from "../utils/constants";
import { dataSource } from "../data-source";


@Resolver()
export class CommentResolver {
  @Mutation((_return) => CommentResponse)
  @UseMiddleware(checkAuth)
  async createComments(
    @Arg("commentInput") commentInput: CommentInput,
    @Ctx() { user }: Context
  ): Promise<CommentResponse> {
    return await dataSource.transaction(async transactionManager =>{
      const { content, billId,rating,imagesComment } = commentInput;
    try {
      const userExisting = await transactionManager.findOne(User,{
        where: {
          id: user.userId,
        },
      });
      if (!userExisting)
        return {
          code: 400,
          success: false,
          message: "User not found, are you not authenticate?",
        };
      const billExisting = await transactionManager.findOne(Bill,{
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
      else if(billExisting && billExisting.isCommented===true)return {
        code: 400,
        success: false,
        message: "Bill is commented",
      };
    
     
      //add comment to product
      const res = await Promise.all<boolean>(
        billExisting.billProducts.map(async (item) => {
          if (item.productType !== "gift") {
            const productExisting = await transactionManager.findOne(Product,{
              where: {
                productName: item.productName,
              },
            });
            //error occur
            if (!productExisting) return false;
            else {
              const newComment = transactionManager.create(UserComment,{
                content,
                rating,
                imagesComment,
                product: productExisting,
                user: userExisting,
              });
              await transactionManager.save(newComment);
              return true;
            }
          }

          return true;
        })
      )
        .then((list) => {
          const hasFalse = list.findIndex((item) => !item);

          return hasFalse;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });

      //No error
      if (res === -1) {
        let totalPrice = billExisting.billProducts.reduce(
          (prev, current) =>
            prev + current.productAmount * current.productPrice,
          0
        );
        if (billExisting.introduceCode) {
          totalPrice =
            totalPrice -
            IntroducePriceCaculater(totalPrice) +
            billExisting.deliveryPrice;
        } else {
          totalPrice = totalPrice + billExisting.deliveryPrice;
        }
        const newFieldMoneyBonus = transactionManager.create(MoneyBonus,{
          description: `Bạn vừa nhận được ${MoneyConverter(
            CommentPriceCaculater(totalPrice)
          )} từ bình luận của bạn.`,
          moneyNumber: CommentPriceCaculater(totalPrice),
          user: userExisting,
        });
        userExisting.moneyDepot += CommentPriceCaculater(totalPrice)
        await transactionManager.save(userExisting)
        await transactionManager.save(newFieldMoneyBonus);
        //Change iscomment
        billExisting.isCommented = true;
        await transactionManager.save(billExisting);
        return {
          code: 200,
          success: true,
          message: "create Comments successfully!",
        };
      } else {
        return {
          code: 400,
          success: false,
          message: "product name not found",
        };
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
    })
  }
  //get Comments
  @Query((_return) => PaginationCommentsResponse)
  async getComments(
    @Arg("skip") skip: number,
    @Arg("productId") productId: number
  ): Promise<PaginationCommentsResponse> {
    try {
      
      const comments = await UserComment.find({
        relations: ["feedbacks","feedbacks.admin", "product","user"],
        where: {
          product: {
            id: productId,
          },
        },
        skip,
        take: COMMENT_LIMIT_PER_PAGE,
      });
      if(!comments) return{
        code:400,
        success:false,
        message:"Comments not found"
      }
      const totalCount = await UserComment.count({
        where:{
          product:{
            id:productId
          }
        }
      })
     
      const cursor = skip + COMMENT_LIMIT_PER_PAGE
      return{
        code:200,
        success:true,
        comments,
        totalCount,
        cursor,
        hasMore:cursor!==totalCount
       
      }
     
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
}
