import { Field, InputType } from "type-graphql";
import { BillStatusType } from "../others/BillStatusType";


import { registerEnumType } from "type-graphql";

registerEnumType(BillStatusType, {
  name: "BillStatusType", // this one is mandatory

});

@InputType()
export class BillStatusInput {
  @Field(_type => BillStatusType) // it's very important
  billStatus: BillStatusType;
}