
import { Field, ObjectType } from "type-graphql";

import { IResponse } from "./IResponse";
import { Price } from "../../entites/Price";



@ObjectType({implements : IResponse})
export class GiftResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field(_return =>Price,{nullable:true})
    gift?:Price

    @Field(_return =>[Price],{nullable:true})
    gifts?:Price[]
}
