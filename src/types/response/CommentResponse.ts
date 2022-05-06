
import { Field, ObjectType } from "type-graphql";

import { IResponse } from "./IResponse";

import { UserComment } from "../../entites/UserComment";



@ObjectType({implements : IResponse})
export class CommentResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;

    @Field(_return =>UserComment,{nullable:true})
    comment?:UserComment

    @Field(_return =>[UserComment],{nullable:true})
    comments?:UserComment[]
}
