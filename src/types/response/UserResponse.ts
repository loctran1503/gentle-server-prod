import { User } from "../../entites/User"
import { Field, ObjectType } from "type-graphql";


import { IResponse } from "./IResponse";

@ObjectType({implements : IResponse})
export class UserResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable:true})
    user?:User

    @Field(_type => [User],{nullable:true})
    users?:User[]

    @Field({nullable:true})
    introducePrice?:number

    @Field({nullable:true})
    token?:string
}
