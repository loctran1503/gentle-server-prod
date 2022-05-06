import { Field, InputType } from "type-graphql";

@InputType()
export class CartInput{
    @Field()
    priceId:number

    @Field()
    productAmount:number

    

    
   
}