import { JwtPayload } from "jsonwebtoken";

export type UserJwtPayload = JwtPayload & {userId:number}