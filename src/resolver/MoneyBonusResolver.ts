import { dataSource } from "../data-source";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MoneyBonus } from "../entites/MoneyBonus";
import { TakeMoneyField } from "../entites/TakeMoneyField";
import { User } from "../entites/User";
import { checkAdmin } from "../middleware/checkAdmin";
import { checkAuth } from "../middleware/checkAuth";
import { MoneyBonusInput } from "../types/input/MoneyBonusInput";
import { TakeMoneyFieldInput } from "../types/input/TakeMoneyFieldInput";
import { Context } from "../types/others/Context";
import { MoneyBonusResponse } from "../types/response/MoneyBonusResponse";
import { SimpleResponse } from "../types/response/SimpleResponse";
import { UserMoneyHistoryResponse } from "../types/response/UserMoneyHistory";

@Resolver()
export class MoneyBonusResolver {
  @Mutation((_return) => MoneyBonusResponse)
  @UseMiddleware(checkAdmin)
  async createMoneyField(
    @Arg("fieldInput") fieldInput: MoneyBonusInput
  ): Promise<MoneyBonusResponse> {
    return await dataSource.transaction(async transactionManager =>{
      try {
        const { moneyNumber, description, type, userId } = fieldInput;
        const userExisting = await transactionManager.findOne(User,{
          where: {
            id: userId,
          },
        });
        if (!userExisting)
          return {
            code: 400,
            success: false,
            message: "User not found",
          };
  
        const newFieldMoneyBonus = transactionManager.create(MoneyBonus,{
          moneyNumber,
          description,
          type,
          user: userExisting,
        });
        await transactionManager.save(newFieldMoneyBonus);
        return {
          code: 200,
          success: true,
          moneyBonus: newFieldMoneyBonus,
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
          message: "Money less than 50000",
        };

      const userExisting = await transactionManager.findOne(User,{
        where: {
          id: user.userId,
        },
      });
      if (!userExisting)
        return {
          code: 400,
          success: false,
          message: "User not authenticate",
        };
      const newField = transactionManager.create(TakeMoneyField,{
        accoutName,
        accountNumber,
        accountBankName,
        money,
        user: userExisting,
      });
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
  async userCancelTakeMoneyField(
    @Arg("takeMoneyFieldId") takeMoneyFieldId: number
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async transactionManager =>{
      try {
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
       
        await transactionManager.delete(TakeMoneyField,{
          id:existing.id
        })
        return{
          code:200,
          success:true,
          message:"Delete successfully!"
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
}
