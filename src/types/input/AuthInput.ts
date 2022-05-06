import { Field, InputType } from "type-graphql";

@InputType()
export class AuthInput{
    @Field()
    userId:string

    @Field({nullable:true})
    type?:string

    @Field({nullable:true})
    userName?:string
    @Field({nullable:true})
    userAvartar?:string
}