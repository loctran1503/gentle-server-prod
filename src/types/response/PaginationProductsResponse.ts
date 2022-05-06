import { Product } from "../../entites/Product";
import { Field, ObjectType } from "type-graphql";
import { IResponse } from "./IResponse";
import { ProductClass } from "../../entites/ProductClass";




@ObjectType({implements : IResponse})
export class PaginationProductsResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable:true})
    totalCount?:number

    @Field({nullable:true})
    pageSize?:number

    @Field({nullable:true})
    kindId?:number

    @Field({nullable:true})
    kindName?:string

    @Field(_return => [ProductClass],{nullable:true})
    productClasses?:ProductClass[]

    @Field(_return =>[Product],{nullable:true})
    products?:Product[]

    

    
}
