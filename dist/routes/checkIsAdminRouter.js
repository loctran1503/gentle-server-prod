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
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reFreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
        console.log(reFreshToken);
        if (!reFreshToken)
            return res.json({
                success: false,
                message: "Not have token",
            });
        const decodeUser = (0, jsonwebtoken_1.verify)(reFreshToken, process.env.REFRESH_TOKEN_SECRET);
        const admin = yield Admin_1.Admin.findOne({ where: { id: decodeUser.userId } });
        console.log(admin);
        if (!admin)
            return res.json({
                success: false,
                message: "Admin not found",
            });
        return res.json({
            success: true,
            message: "Check Admin Successfully!",
        });
    }
    catch (error) {
        console.log(`REFRESH TOKEN ERROR :${error.message}`);
        return res.sendStatus(500).json({
            success: false,
            message: error.message,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=checkIsAdminRouter.js.map