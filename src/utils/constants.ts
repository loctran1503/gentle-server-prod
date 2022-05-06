
import { NonEmptyArray } from "type-graphql";
import { AdminResolver } from "../resolver/AdminResolver";
import { BillResolver } from "../resolver/BillResolver";
import { BrandResolver } from "../resolver/BrandResolver";
import { CommentResolver } from "../resolver/CommentResolver";
import { MoneyBonusResolver } from "../resolver/MoneyBonusResolver";
import { MyEventResolver } from "../resolver/MyEventResolver";
import { ProductResolver } from "../resolver/ProductResolver";
import { UserResolver } from "../resolver/UserResolver";

export const PRODUCT_LIMIT_PER_PAGE = 10
export const COMMENT_LIMIT_PER_PAGE = 5
export const USER_LIMIT = 5
export const REJECTED_AMOUNT =2 
export const MONEY_COMMENT_PERCENT= 1/100
export const MONEY_INTRODUCE_PERCENT = 3/100
export const __prod__ = process.env.NODE_ENV === "production"



export const resolvers : NonEmptyArray<Function> =[AdminResolver,BillResolver,BrandResolver,CommentResolver,MoneyBonusResolver,MyEventResolver,ProductResolver,UserResolver]