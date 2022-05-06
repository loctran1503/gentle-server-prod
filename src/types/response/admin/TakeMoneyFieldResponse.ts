
import { TakeMoneyField } from "../../../entites/TakeMoneyField";
import { Field, ObjectType } from "type-graphql";



import { IResponse } from "../IResponse";



@ObjectType({implements : IResponse})
export class TakeMoneyFieldResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field(_return =>TakeMoneyField,{nullable:true})
    field?:TakeMoneyField

    @Field(_return =>[TakeMoneyField],{nullable:true})
    fields?:TakeMoneyField[]
}
