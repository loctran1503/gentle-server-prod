import { Field, InputType } from "type-graphql";

@InputType()
export class UserCommentInput{
    @Field()
    content!:string

    @Field()
    isPaid!:boolean

    @Field()
    producId!:number
}