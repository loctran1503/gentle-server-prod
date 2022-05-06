import { Field, ObjectType } from "type-graphql";
import { IResponse } from "../IResponse";

@ObjectType({ implements: IResponse })
export class DashboardResponse implements IResponse {
  code: number;
  success: boolean;
  message?: string;

  @Field({ nullable: true })
  takeMoneyField?: number;

  @Field({ nullable: true })
  cancel?: number;

  @Field({ nullable: true })
  confirmWaiting?: number;

  @Field({ nullable: true })
  confirmed?: number;

  @Field({ nullable: true })
  packed?: number;

  @Field({ nullable: true })
  delivering?: number;

  @Field({ nullable: true })
  commentNoFeedback?: number;
}
