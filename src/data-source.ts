import { DataSource } from "typeorm";
import { Admin } from "./entites/Admin";
import { Bill } from "./entites/Bill";
import { BillCancelReason } from "./entites/BillCancelReason";
import { BillProduct } from "./entites/BillProduct";
import { Brand } from "./entites/Brand";
import { Country } from "./entites/Country";

import { Customer } from "./entites/Customer";
import { Feedback } from "./entites/Feedback";
import { MoneyBonus } from "./entites/MoneyBonus";
import { MyEvent } from "./entites/MyEvent";
import { Price } from "./entites/Price";
import { Product } from "./entites/Product";
import { ProductClass } from "./entites/ProductClass";
import { ProductKind } from "./entites/ProductKind";
import { TakeMoneyField } from "./entites/TakeMoneyField";
import { User } from "./entites/User";
import { UserComment } from "./entites/UserComment";
import { __prod__ } from "./utils/constants";
console.log("prod",__prod__)
export const dataSource = new DataSource({

  host: __prod__ ? process.env.HOST_DEV : process.env.HOST_DEV,
  type: "postgres",
  ...(__prod__
    ? {
   
        username: process.env.PG_USERNAME_PROD,
        password: process.env.PG_PASSWORD_PROD,
        database: process.env.DATABASE_NAME_PROD,
        port: 5432,
      }
    : {
        username: process.env.PG_USERNAME_DEV,
        password: process.env.PG_PASSWORD_DEV,
        database: process.env.DATABASE_NAME_DEV,
      }),
  ...(__prod__
    ? {
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        ssl: true,
      }
    : {}),
  // ...(__prod__ ? { migrationsRun: true } : { synchronize: true }),
  migrationsRun:true,
  ...(__prod__ ? { logging: true } : { logging: false }),

  entities: [
    Admin,
    Bill,
    BillCancelReason,
    BillProduct,
    Brand,
    Country,
    Customer,
    Feedback,
    MoneyBonus,
    MyEvent,
    Price,
    Product,
    ProductClass,
    ProductKind,
    TakeMoneyField,
    User,
    UserComment,
  ],

  migrations: [__dirname + "/migrations/*{.js,.ts}"],
});
