import { Brand } from "../../entites/Brand"
import { Field, ObjectType } from "type-graphql";

import { IResponse } from "./IResponse";
import { ProductKind } from "../../entites/ProductKind";



@ObjectType({implements : IResponse})
export class BrandResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field(_return => ProductKind,{nullable:true})
    kind?:ProductKind

    @Field(_return =>[Brand],{nullable:true})
    brands?:Brand[]

    @Field(_return => Brand,{nullable:true})
    brandWithProduct?:Brand

}
