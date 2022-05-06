"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = void 0;
const apollo_server_core_1 = require("apollo-server-core");
const jsonwebtoken_1 = require("jsonwebtoken");
const Admin_1 = require("../entites/Admin");
const checkAdmin = ({ context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = context.req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (!token)
            throw new apollo_server_core_1.AuthenticationError("Not authenticated");
        const decodeUser = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = yield Admin_1.Admin.findOne({ where: { id: decodeUser.userId } });
        if (!admin)
            throw new apollo_server_core_1.AuthenticationError("You can't redirect here");
        context.user = decodeUser;
        return next();
    }
    catch (error) {
        throw new apollo_server_core_1.AuthenticationError(`Error:${error.message}`);
    }
});
exports.checkAdmin = checkAdmin;
//# sourceMappingURL=checkAdmin.js.map