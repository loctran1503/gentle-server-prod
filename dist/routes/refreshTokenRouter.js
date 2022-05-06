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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const Admin_1 = require("../entites/Admin");
const User_1 = require("../entites/User");
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
    console.log(req.cookies);
    console.log(`refreshToken${refreshToken}`);
    if (!refreshToken)
        return res.sendStatus(401);
    try {
        const decodedUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existingUser = yield User_1.User.findOne({
            where: {
                id: decodedUser.userId,
            },
        });
        if (!existingUser) {
            const adminExisting = yield Admin_1.Admin.findOne({
                where: {
                    id: decodedUser.userId,
                },
            });
            if (adminExisting) {
                (0, auth_1.sendRefreshToken)(res, adminExisting.id.toString());
                return res.json({
                    success: true,
                    token: (0, auth_1.createToken)("accessToken", adminExisting.id.toString()),
                    type: "admin",
                    avatar: adminExisting.avatar,
                });
            }
            else {
                return res.sendStatus(401);
            }
        }
        else {
            (0, auth_1.sendRefreshToken)(res, existingUser.id.toString());
            return res.json({
                success: true,
                token: (0, auth_1.createToken)("accessToken", existingUser.id.toString()),
                type: "user",
                avatar: existingUser.userAvatar,
                isHidden: existingUser.isHidden
            });
        }
    }
    catch (error) {
        console.log(`REFRESH TOKEN ERROR :${error.message}`);
        return res.sendStatus(500);
    }
}));
exports.default = router;
//# sourceMappingURL=refreshTokenRouter.js.map