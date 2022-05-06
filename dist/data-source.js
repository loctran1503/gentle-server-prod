"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const Admin_1 = require("./entites/Admin");
const Bill_1 = require("./entites/Bill");
const BillCancelReason_1 = require("./entites/BillCancelReason");
const BillProduct_1 = require("./entites/BillProduct");
const Brand_1 = require("./entites/Brand");
const Customer_1 = require("./entites/Customer");
const Feedback_1 = require("./entites/Feedback");
const MoneyBonus_1 = require("./entites/MoneyBonus");
const MyEvent_1 = require("./entites/MyEvent");
const Price_1 = require("./entites/Price");
const Product_1 = require("./entites/Product");
const ProductClass_1 = require("./entites/ProductClass");
const ProductKind_1 = require("./entites/ProductKind");
const TakeMoneyField_1 = require("./entites/TakeMoneyField");
const User_1 = require("./entites/User");
const UserComment_1 = require("./entites/UserComment");
const constants_1 = require("./utils/constants");
exports.dataSource = new typeorm_1.DataSource(Object.assign(Object.assign(Object.assign(Object.assign({ host: constants_1.__prod__ ? process.env.HOST_PROD : process.env.HOST_DEV, type: "postgres" }, (constants_1.__prod__
    ? {
        url: process.env.DATABASE_URL,
        username: process.env.PG_USERNAME_PROD,
        password: process.env.PG_PASSWORD_PROD,
        database: process.env.DATABASE_NAME_PROD,
    }
    : {
        username: process.env.PG_USERNAME_DEV,
        password: process.env.PG_PASSWORD_DEV,
        database: process.env.DATABASE_NAME_DEV,
    })), (constants_1.__prod__
    ? {
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
        ssl: true,
    }
    : {})), (!constants_1.__prod__ && { synchronize: true })), { logging: false, entities: [
        Admin_1.Admin,
        Bill_1.Bill,
        BillCancelReason_1.BillCancelReason,
        BillProduct_1.BillProduct,
        Brand_1.Brand,
        Customer_1.Customer,
        Feedback_1.Feedback,
        MoneyBonus_1.MoneyBonus,
        MyEvent_1.MyEvent,
        Price_1.Price,
        Product_1.Product,
        ProductClass_1.ProductClass,
        ProductKind_1.ProductKind,
        TakeMoneyField_1.TakeMoneyField,
        User_1.User,
        UserComment_1.UserComment,
    ], migrations: [__dirname + "/migrations/*{.js,.ts}"] }));
//# sourceMappingURL=data-source.js.map