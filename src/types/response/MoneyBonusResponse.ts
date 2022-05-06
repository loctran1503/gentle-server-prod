
import { Field, ObjectType } from "type-graphql";
import { IResponse } from "./IResponse";
import { MoneyBonus } from "../../entites/MoneyBonus";



@ObjectType({implements : IResponse})
export class MoneyBonusResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;


    @Field(_return =>MoneyBonus,{nullable:true})
    moneyBonus?:MoneyBonus

    @Field(_return =>[MoneyBonus],{nullable:true})
    moneyBonuses?:MoneyBonus[]
}
