import { Field, InputType } from "type-graphql";




@InputType()
export class MoneyBonusInput {
  @Field()
  moneyNumber: number;

  @Field()
  description: string;

  @Field()
  userId:number



}
