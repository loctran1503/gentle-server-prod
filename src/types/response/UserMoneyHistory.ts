
import { Field, ObjectType } from "type-graphql";
import { IResponse } from "./IResponse";
import { MoneyBonus } from "../../entites/MoneyBonus";
import { TakeMoneyField } from "../../entites/TakeMoneyField";



@ObjectType({implements : IResponse})
export class UserMoneyHistoryResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;


    @Field(_return =>[TakeMoneyField],{nullable:true})
    takeMoneyFields?:TakeMoneyField[]

    @Field(_return =>[MoneyBonus],{nullable:true})
    moneyBonuses?:MoneyBonus[]
}
