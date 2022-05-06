import { Field, ObjectType } from "type-graphql";
import { MyEvent } from "../../entites/MyEvent";
import { IResponse } from "./IResponse";



@ObjectType({implements : IResponse})
export class MyEventResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;


    @Field(_return =>MyEvent,{nullable:true})
    myEvent?:MyEvent

    @Field(_return =>[MyEvent],{nullable:true})
    myEvents?:MyEvent[]
}
