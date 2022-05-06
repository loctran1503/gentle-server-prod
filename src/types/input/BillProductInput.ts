import { Field, InputType } from "type-graphql";

@InputType()
export class BillProductInput {
  @Field()
  productName: string;

  @Field()
  productThumbnail: string;

  @Field()
  productType: string;

  @Field()
  productPrice: number;

  @Field()
  productAmount: number;

  @Field({nullable:true})
  priceIdForLocal?: number;
}
