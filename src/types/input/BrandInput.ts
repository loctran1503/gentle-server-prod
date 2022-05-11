
import { Field, InputType } from "type-graphql";

@InputType()
export class BrandInput{

    @Field()
    brandName:string

    @Field()
    thumbnail:string

  

    @Field()
    productClassId:number
   
}