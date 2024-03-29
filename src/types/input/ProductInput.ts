import { Field, InputType } from "type-graphql";
import { PriceInput } from "./PriceInput";

@InputType()
export class ProductInput{
    @Field()
    productName!:string

    @Field()
    thumbnail!:string

    @Field(_return => [String])
    imgDescription!:string[]

    @Field()
    description!:string



    @Field(_return => [PriceInput])
    prices!:PriceInput[]

    @Field()
    countryName:string

    @Field()
    kindId!:number

    @Field()
    classId!:number

    @Field()
    brandId!:number

    @Field({nullable:true})
    sales?:number

    
}