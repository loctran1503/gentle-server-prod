
import { Field, ObjectType } from "type-graphql";
import { IResponse } from "./IResponse";
import { UserComment } from "../../entites/UserComment";


@ObjectType({implements : IResponse})
export class PaginationCommentsResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable:true})
    totalCount?:number

    @Field({nullable:true})
    pageSize?:number

    @Field({nullable:true})
    cursor?:number

    @Field({nullable:true})
    hasMore?:boolean

    @Field(_return =>[UserComment],{nullable:true})
    comments?:UserComment[]

    
}
