
import { Field, ObjectType } from "type-graphql";

import { IResponse } from "./IResponse";
import { Bill } from "../../entites/Bill";



@ObjectType({implements : IResponse})
export class BillResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field(_return =>Bill,{nullable:true})
    bill?:Bill

    @Field(_return =>[Bill],{nullable:true})
    bills?:Bill[]
}
