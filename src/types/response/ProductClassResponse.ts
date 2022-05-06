import { Field, ObjectType } from "type-graphql";
import { ProductClass } from "../../entites/ProductClass";
import { IResponse } from "./IResponse";



@ObjectType({implements : IResponse})
export class ProductClassResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;


    @Field(_return =>ProductClass,{nullable:true})
    productClass?:ProductClass

    @Field(_return =>[ProductClass],{nullable:true})
    productClasses?:ProductClass[]
}
