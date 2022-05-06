import { Field, InputType } from "type-graphql";


@InputType()
export class TakeMoneyFieldInput{
    @Field()
    accoutName:string

    @Field()
    accountNumber:string

    @Field()
    accountBankName:string

    @Field()
    money: number;

    @Field({nullable:true})
    isSuccessImage?: string;
    
}