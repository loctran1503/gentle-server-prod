
import { Field, ObjectType } from "type-graphql";
import { BillProduct } from "../../entites/BillProduct";
import { Brand } from "../../entites/Brand";

import { IResponse } from "./IResponse";

@ObjectType({implements : IResponse})
export class WebDataResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    
    @Field(_return =>[Brand],{nullable:true})
    brands?:Brand[]


    @Field(_return =>[BillProduct],{nullable:true})
    products?:BillProduct[]

    @Field({nullable:true})
    token?:String

    @Field({nullable:true})
    avatar?:String

    @Field({nullable:true})
    isHidden?:boolean

    @Field({nullable:true})
    type?:String
}