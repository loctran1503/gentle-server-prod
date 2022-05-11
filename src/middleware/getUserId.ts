import { AuthenticationError } from "apollo-server-core";
import { Secret, verify } from "jsonwebtoken";
import { UserJwtPayload } from "src/types/others/UserJwtPayload";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/others/Context";

export const getUserId : MiddlewareFn<Context> = ({context},next) =>{
    try {
        const authHeader = context.req.header("Authorization")
        const token = authHeader && authHeader.split(" ")[1]
      
        if(!token) {
          
            return next()
        }
        const decodeUser = verify(token,process.env.ACCESS_TOKEN_SECRET as Secret) as UserJwtPayload
       context.user = decodeUser
        return next()
    } catch (error) {
        throw new AuthenticationError(`Error:${error.message}`)
    }

}
