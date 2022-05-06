import { Field, ObjectType } from "type-graphql";
import { BillProduct } from "../../entites/BillProduct";
import { IResponse } from "./IResponse";




@ObjectType({implements : IResponse})
export class CartProductResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field(_return =>[BillProduct],{nullable:true})
    products?:BillProduct[]

    

}
