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
const Admin_1 = require("../entites/Admin");
const User_1 = require("../entites/User");
const auth_1 = require("../utils/auth");
const randomCode_1 = require("../utils/randomCode");
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body)
            return res.status(400).json({ message: "Body null" });
        const authInput = req.body;
        if (authInput.id === "lc0woETn6BO0dOCcPwo3ssNbdln2") {
            const admin = yield Admin_1.Admin.findOne({
                where: {
                    adminId: authInput.id,
                },
            });
            if (admin) {
                (0, auth_1.sendRefreshToken)(res, admin.id.toString());
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: "Admin Login successfully!",
                    token: (0, auth_1.createToken)("accessToken", admin.id.toString()),
                });
            }
            else {
                const newAdmin = Admin_1.Admin.create({
                    adminId: authInput.id,
                    adminName: "Memories",
                    avatar: authInput.avatar,
                });
                yield Admin_1.Admin.save(newAdmin);
                (0, auth_1.sendRefreshToken)(res, newAdmin.id.toString());
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: "Admin Resgisting successfully!",
                    token: (0, auth_1.createToken)("accessToken", newAdmin.id.toString()),
                });
            }
        }
        else {
            const user = yield User_1.User.findOne({
                where: {
                    userId: authInput.id,
                },
            });
            if (user) {
                (user.userAvatar = authInput.avatar), (user.userName = authInput.name);
                yield User_1.User.save(user);
                (0, auth_1.sendRefreshToken)(res, user.id.toString());
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: "User Login successfully!",
                    user,
                    token: (0, auth_1.createToken)("accessToken", user.id.toString()),
                });
            }
            else {
                let isStop = true;
                while (isStop) {
                    const introduceCode = (0, randomCode_1.randomIntroduceCode)(100000, 999999);
                    const existingUser = yield User_1.User.findOne({
                        where: {
                            introduceCode,
                        },
                    });
                    if (!existingUser) {
                        const newUser = User_1.User.create({
                            userId: authInput.id,
                            userAvatar: authInput.avatar,
                            userName: authInput.name,
                            introduceCode: (0, randomCode_1.randomIntroduceCode)(100000, 999999),
                        });
                        yield User_1.User.save(newUser);
                        (0, auth_1.sendRefreshToken)(res, newUser.id.toString());
                        isStop = false;
                        return res.sendStatus(200).json({
                            code: 200,
                            success: true,
                            message: "Register successfully!",
                            user: newUser,
                            token: (0, auth_1.createToken)("accessToken", newUser.id.toString()),
                        });
                    }
                }
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: `Something wrong`,
                });
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Server error:${error.message}`,
        });
    }
}));
router.get("/checkAuth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME]) {
            console.log("not have cookie");
            return res.status(400).json({
                code: 400,
                success: false,
                message: `Not Authenticated`,
            });
        }
        const cookie = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
        console.log(cookie);
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Authenticated`,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Server error:${error.message}`,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=authRouter.js.map