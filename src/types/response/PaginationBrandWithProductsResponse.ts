import { Field, ObjectType } from "type-graphql";
import { Brand } from "../../entites/Brand";
import { IResponse } from "./IResponse";





@ObjectType({implements : IResponse})
export class PaginationBrandWithProductsResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable:true})
    totalCount?:number

    @Field({nullable:true})
    pageSize?:number

    

    @Field(_return =>Brand,{nullable:true})
    brandWithProducts?:Brand

    

    
}
