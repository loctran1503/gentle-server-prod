
import { ObjectType } from "type-graphql";
import { IResponse } from "./IResponse";



@ObjectType({implements : IResponse})
export class SimpleResponse implements IResponse{
    code: number;
    success: boolean;
    message?: string;


 
}
