import { Field, InputType, registerEnumType } from "type-graphql";
import { MoneyBonusType } from "../others/MoneyBonusType";

registerEnumType(MoneyBonusType, {
  name: "MoneyBonusType", // this one is mandatory
});

@InputType()
export class MoneyBonusInput {
  @Field()
  moneyNumber: number;

  @Field()
  description: string;

  @Field()
  userId:number

  @Field((_type) => MoneyBonusType) // it's very important
  type: MoneyBonusType;

}
