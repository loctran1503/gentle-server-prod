"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const constants_1 = require("./constants");
const createToken = (type, userId) => {
    return (0, jsonwebtoken_1.sign)({
        userId,
    }, type === "accessToken"
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: type === "accessToken" ? "180days" : "180 days",
    });
};
exports.createToken = createToken;
const sendRefreshToken = (res, userId) => {
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, (0, exports.createToken)("refreshToken", userId), {
        httpOnly: true,
        secure: true,
        sameSite: !constants_1.__prod__ ? "none" : "lax",
        path: "/refresh_token",
        expires: new Date(Date.now() + 86400 * 1000 * 180),
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=auth.js.map