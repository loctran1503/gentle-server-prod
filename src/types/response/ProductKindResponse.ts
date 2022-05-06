import { ProductClass } from "../../entites/ProductClass";
import { Field, ObjectType } from "type-graphql";
import { ProductKind } from "../../entites/ProductKind";
import { IResponse } from "./IResponse";



@ObjectType({implements : IResponse})
export class ProductKindResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    


    @Field(_return =>ProductKind,{nullable:true})
    kind?:ProductKind

    @Field(_return =>[ProductClass],{nullable:true})
    classes?:ProductClass[]

    @Field(_return =>[ProductKind],{nullable:true})
    kinds?:ProductKind[]
}
