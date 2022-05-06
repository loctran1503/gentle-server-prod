import { Field, InputType } from "type-graphql";

@InputType()
export class CustomerInput {
  @Field()
  customerName: string;

  @Field()
  customerPhone: string;

  @Field()
  city: string;

  @Field()
  province: string;

  @Field()
  address: string;
}
