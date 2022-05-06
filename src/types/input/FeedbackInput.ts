import { Field, InputType } from "type-graphql";

@InputType()
export class FeedbackInput{

    @Field()
  content!: string;

   
    @Field()
    commentId!:number
   
}