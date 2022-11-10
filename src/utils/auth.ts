import { Response } from "express";
import { Secret, sign } from "jsonwebtoken";
import { __prod__ } from "./constants";

export const createToken = (
  type: "accessToken" | "refreshToken",
  userId: string
) => {
  return sign(
    {
      userId,
    },
    type === "accessToken"
      ? (process.env.ACCESS_TOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === "accessToken" ? "180days" : "180 days",
    }
  );
};
export const sendRefreshToken = (res: Response, userId: string) => {
  res.cookie(
    process.env.REFRESH_TOKEN_COOKIE_NAME!,
    createToken("refreshToken", userId),
    {
      httpOnly: true,
      secure: true,
      sameSite: !__prod__ ? "none" : "lax",
      path:"/refresh_token",
      expires: new Date(Date.now() + 86400 * 1000 * 180),
    }
  );
};
