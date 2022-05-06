import { Field, InputType } from "type-graphql";

@InputType()
export class MyEventInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  thumbnail: string;

  @Field()
  summary: string;

  @Field(_type => [String],{nullable:true})
  instructionImages?: string[];
}
