import { Field, ObjectType } from "type-graphql";
import { Brand } from "../../../entites/Brand";
import { ProductClass } from "../../../entites/ProductClass";
import { ProductKind } from "../../../entites/ProductKind";
import { IResponse } from "../../response/IResponse";

@ObjectType({ implements: IResponse })
export class KindBrandClassResponse implements IResponse {
  code: number;
  success: boolean;
  message?: string;



  @Field((_return) => [ProductKind], { nullable: true })
  kinds?: ProductKind[];

  @Field((_return) => [Brand], { nullable: true })
  brands?: Brand[];

  @Field((_return) => [ProductClass], { nullable: true })
  classes?: ProductClass[];
}
