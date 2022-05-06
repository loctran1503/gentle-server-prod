
import { Field, InputType } from "type-graphql";

@InputType()
export class BrandInput{
    @Field()
    kindId:number

    @Field()
    brandName:string

    @Field()
    thumbnail:string

    @Field()
    description:string

    @Field()
    productClassId:number
   
}