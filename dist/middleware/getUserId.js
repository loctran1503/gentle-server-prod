"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const apollo_server_core_1 = require("apollo-server-core");
const jsonwebtoken_1 = require("jsonwebtoken");
const getUserId = ({ context }, next) => {
    try {
        const authHeader = context.req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (!token)
            return next();
        const decodeUser = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        context.user = decodeUser;
        return next();
    }
    catch (error) {
        throw new apollo_server_core_1.AuthenticationError(`Error:${error.message}`);
    }
};
exports.getUserId = getUserId;
//# sourceMappingURL=getUserId.js.map