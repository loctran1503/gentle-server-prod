import { Field, InputType } from "type-graphql";

@InputType()
export class MyEventInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  thumbnailForDesktop: string;

  @Field()
  thumbnailForMobile: string;



  
}
