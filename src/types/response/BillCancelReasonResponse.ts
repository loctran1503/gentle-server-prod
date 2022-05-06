
import { Field, ObjectType } from "type-graphql";
import { BillCancelReason } from "../../entites/BillCancelReason";
import { IResponse } from "./IResponse";





@ObjectType({implements : IResponse})
export class BillCancelReasonResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field(_return =>BillCancelReason,{nullable:true})
    billCancelReason?:BillCancelReason

    @Field(_return =>[BillCancelReason],{nullable:true})
    billCancelReasons?:BillCancelReason[]
}
