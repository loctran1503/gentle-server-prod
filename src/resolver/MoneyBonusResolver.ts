import { TakeMoneyFieldType } from "../types/others/TakeMoneyFieldType";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { dataSource } from "../data-source";
import { MoneyBonus } from "../entites/MoneyBonus";
import { TakeMoneyField } from "../entites/TakeMoneyField";
import { User } from "../entites/User";
import { checkAuth } from "../middleware/checkAuth";
import { TakeMoneyFieldInput } from "../types/input/TakeMoneyFieldInput";
import { Context } from "../types/others/Context";
import { SimpleResponse } from "../types/response/SimpleResponse";
import { UserMoneyHistoryResponse } from "../types/response/UserMoneyHistory";

@Resolver()
export class MoneyBonusResolver {
  
  //Create take money field
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAuth)
  async createTakeMoneyField(
    @Arg("field") field: TakeMoneyFieldInput,
    @Ctx() { user }: Context
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async transactionManager =>{
      const { accoutName, accountNumber, accountBankName, money } = field;
    try {
      if (money < 50000)
        return {
          code: 400,
          success: false,
          message: "Số tiền không phù hợp",
        };

      const userExisting = await transactionManager.findOne(User,{
        where: {
          id: user.userId
        },
        
      });
      if (!userExisting)
        return {
          code: 400,
          success: false,
          message: "Không tìm thấy người dùng, vui lòng liên hệ Admin",
        };
        if(userExisting.moneyDepot<money){
          return {
            code: 400,
            success: false,
            message: "Số tiền trong tài khoản không đủ để rút, vui lòng liên hệ Admin",
          };
        }
      
      const newField = transactionManager.create(TakeMoneyField,{
        accoutName,
        accountNumber,
        accountBankName,
        money,
        user: userExisting,
        status:TakeMoneyFieldType.PENDING
      });
      userExisting.moneyDepot-= money
      await transactionManager.save(userExisting)
      await transactionManager.save(newField);
      return {
        code: 200,
        success: true,
        message: "Create TakeMoneyField successfully!",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
    })
  }
  @Query((_return) => UserMoneyHistoryResponse)
  @UseMiddleware(checkAuth)
  async getUserMoneyHistory(
    @Ctx() { user }: Context
  ): Promise<UserMoneyHistoryResponse> {
    try {
      if (user.userId) {
        const moneyBonuses = await MoneyBonus.find({
          where: {
            user: {
              id: user.userId,
            },
          },
        });
        const takeMoneyFields = await TakeMoneyField.find({
          where: {
            user: {
              id: user.userId,
            },
          },
        });
        if (!moneyBonuses)
          return {
            code: 400,
            success: false,
            message: "Money bonuses not found",
          };
        if (!takeMoneyFields)
          return {
            code: 400,
            success: false,
            message: "Money bonuses not found",
          };
        return {
          code: 200,
          success: true,
          takeMoneyFields,
          moneyBonuses,
        };
      } else {
        return {
          code: 400,
          success: false,
          message: "User not found",
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

  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(checkAuth)
  async userCancelTakeMoneyField(
    @Arg("takeMoneyFieldId") takeMoneyFieldId: number,
    @Ctx() {user} : Context
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async transactionManager =>{
      try {
        const userExisting = await transactionManager.findOne(User,{
          where:{
            id:user.userId
          }
        })
        if(!userExisting)return{
          code:400,
          success:false,
          message:"Không tìm thấy người dùng"
        }
        

        const existing = await transactionManager.findOne(TakeMoneyField,{
          where:{
            id:takeMoneyFieldId
          },
  
        });
        if(!existing) return{
          code:400,
          success:false,
          message:"Không tìm thấy id của yêu cầu"
        }
        console.log(userExisting)
        console.log(existing)
        
        userExisting.moneyDepot+= existing.money
        await transactionManager.save(userExisting)
       
        await transactionManager.delete(TakeMoneyField,{
          id:existing.id
        })

        return{
          code:200,
          success:true,
          message:"Delete successfully!"
        }
      } catch (error) {
        console.log(error)
        return {
          code: 500,
          success: false,
          message: error.message,
        };
      }
    })
  }
}
