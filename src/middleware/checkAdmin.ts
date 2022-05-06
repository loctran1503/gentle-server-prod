import { AuthenticationError } from "apollo-server-core";
import { Secret, verify } from "jsonwebtoken";

import { UserJwtPayload } from "../types/others/UserJwtPayload";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/others/Context";
import { Admin } from "../entites/Admin";

export const checkAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  try {
    const authHeader = context.req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) throw new AuthenticationError("Not authenticated");
    const decodeUser = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as UserJwtPayload;
    const admin = await Admin.findOne({ where: { id: decodeUser.userId } })
    if (!admin)throw new AuthenticationError("You can't redirect here");
    context.user = decodeUser;
    return next();
  } catch (error) {
    throw new AuthenticationError(`Error:${error.message}`);
  }
};
