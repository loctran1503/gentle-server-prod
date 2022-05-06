import { Request, Response } from "express";
import { UserJwtPayload } from "./UserJwtPayload";

export interface Context{
    req:Request
    res:Response
    user:UserJwtPayload
}