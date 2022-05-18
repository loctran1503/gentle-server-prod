import { PriceResolver } from "../resolver/PriceResolver";
import { NonEmptyArray } from "type-graphql";
import { AdminResolver } from "../resolver/AdminResolver";
import { BillResolver } from "../resolver/BillResolver";
import { BrandResolver } from "../resolver/BrandResolver";
import { CommentResolver } from "../resolver/CommentResolver";
import { MoneyBonusResolver } from "../resolver/MoneyBonusResolver";
import { MyEventResolver } from "../resolver/MyEventResolver";
import { ProductResolver } from "../resolver/ProductResolver";
import { UserResolver } from "../resolver/UserResolver";

export const PRODUCT_LIMIT_PER_PAGE = 10;
export const COMMENT_LIMIT_PER_PAGE = 5;
export const USER_LIMIT = 5;
export const REJECTED_AMOUNT = 2;
export const MONEY_COMMENT_PERCENT = 1 / 100;
export const MONEY_INTRODUCE_PERCENT = 3 / 100;
export const __prod__ = process.env.NODE_ENV === "production";

export const resolvers: NonEmptyArray<Function> = [
  AdminResolver,
  BillResolver,
  BrandResolver,
  CommentResolver,
  MoneyBonusResolver,
  MyEventResolver,
  ProductResolver,
  UserResolver,
  PriceResolver
];

export const AMERICA= "MỸ"
export const KOREA= "HÀN QUỐC"
export const VIETNAM= "VIỆT NAM"

export const AMERICA_INFO: string[] = [
  `Bạn sẽ nhận được hóa đơn trực tiếp từ những cửa hàng uy tín ở ${AMERICA}.`,
  `Bạn có thể liên hệ với các cửa hàng trên hóa đơn để kiểm tra sản phẩm.`,
  `Hoàn 100% tiền nếu sản phẩm bị vỡ trong quá trình vận chuyển`,
  
  "Miễn phí vận chuyển với đơn hàng trên 5.000.000đ.",
  "Thời gian nhận hàng từ 16 đến 21 ngày kể từ ngày đơn hàng được xác nhận.",
  "Bạn vui lòng thanh toán trước 25% giá trị đơn hàng.",
  "Trân trọng cảm ơn Bạn đã đọc thông tin này.",
];

export const KOREA_INFO: string[] = [
    `Bạn sẽ nhận được hóa đơn trực tiếp từ những cửa hàng uy tín ở ${KOREA}.`,
    `Bạn có thể liên hệ với các cửa hàng trên hóa đơn để kiểm tra sản phẩm.`,
    `Miễn phí vận chuyển với đơn hàng trên 3.000.000đ.`,
    `Thời gian nhận hàng từ 7 đến 14 ngày kể từ ngày đơn hàng được xác nhận.`,
    `Bạn vui lòng thanh toán trước 15% giá trị đơn hàng.`,
    `Trân trọng cảm ơn Bạn đã đọc thông tin này.`,
  ];

export const VIETNAM_INFO: string[] = [
  "sản phẩm đảm bảo nguồn gốc và chất lượng 100%.",
  "Miễn phí đổi trả nếu sản phẩm có vấn đề.",
  "Miễn phí vận chuyển với đơn hàng trên 500.000đ.",
  "Thời gian nhận hàng từ 3 đến 8 ngày kể từ ngày đơn hàng được xác nhận.",
  "Bạn vui lòng thanh toán trước 5% giá trị đơn hàng.",
  "Trân trọng cảm ơn Bạn đã đọc thông tin này."
];





