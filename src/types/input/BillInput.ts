import { Field, InputType } from "type-graphql";
import { CustomerInput } from "./CustomerInput";
import { BillProductInput } from "./BillProductInput";

@InputType()
export class BillInput {
  @Field({nullable:true})
  notice?: string;

  @Field()
  paymentType: string;

  @Field({nullable:true})
  introduceCode?: number;

  @Field(_type => CustomerInput)
  customer: CustomerInput;

  @Field()
  deliveryPrice:number

  

  @Field(_type => [BillProductInput])
  products:BillProductInput[]
}
