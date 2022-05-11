import { Field, InputType } from "type-graphql";

@InputType()
export class PriceInput{
    @Field()
    type!:string

    @Field()
    price!:number

    @Field()
    status!:number

    @Field({defaultValue:0})
    salesPercent:number

    @Field({nullable:true})
    isGift?:boolean
}