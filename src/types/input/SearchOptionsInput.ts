import { Field, InputType } from "type-graphql";



@InputType()
export class PaginationOptionsInput{
    @Field()
    skip!:number

    @Field({nullable:true})
    kindId?:number

    @Field({nullable:true})
    productClassId?:number

    @Field({nullable:true})
    brandId?:number

    @Field({nullable:true})
    type?:string = "PRICE_DESC" || "PRICE_ASC" || "DATE_DESC" || "SALES_DESC"
}