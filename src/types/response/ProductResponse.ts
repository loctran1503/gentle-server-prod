import { Product } from "../../entites/Product";
import { Field, ObjectType } from "type-graphql";
import { IResponse } from "./IResponse";



@ObjectType({implements : IResponse})
export class ProductResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;


    @Field(_return =>Product,{nullable:true})
    product?:Product

    @Field(_return =>[Product],{nullable:true})
    products?:Product[]
}
