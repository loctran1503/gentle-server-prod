import { Field, ObjectType } from "type-graphql";
import { IResponse } from "../../response/IResponse";
import { Price } from "../../../entites/Price";

@ObjectType({ implements: IResponse })
export class PriceResponse implements IResponse {
  code: number;
  success: boolean;
  message?: string;

  @Field((_return) => Price, { nullable: true })
  price?: Price;

  @Field((_return) => [Price], { nullable: true })
  prices?: Price[];
}
