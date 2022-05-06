import { Field, InputType } from "type-graphql";

@InputType()
export class CommentInput {
 
  @Field()
  content: string;

  @Field()
  rating:number

  @Field(_type => [String])
  imagesComment:string[]

  @Field()
  billId: number;


}
