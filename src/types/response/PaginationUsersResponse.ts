
import { Field, ObjectType } from "type-graphql";
import { IResponse } from "./IResponse";
import { User } from "../../entites/User";


@ObjectType({implements : IResponse})
export class PaginationUsersResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable:true})
    totalCount?:number

    @Field()
    hasMore?:boolean

    @Field()
    cursor?:number

    @Field()
    userHideCount?:number

    @Field(_return =>[User],{nullable:true})
    users?:User[]

    
}
