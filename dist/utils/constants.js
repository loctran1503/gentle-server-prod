"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIETNAM_INFO = exports.KOREA_INFO = exports.AMERICA_INFO = exports.VIETNAM = exports.KOREA = exports.AMERICA = exports.resolvers = exports.__prod__ = exports.MONEY_INTRODUCE_PERCENT = exports.MONEY_COMMENT_PERCENT = exports.REJECTED_AMOUNT = exports.USER_LIMIT = exports.COMMENT_LIMIT_PER_PAGE = exports.PRODUCT_LIMIT_PER_PAGE = void 0;
const PriceResolver_1 = require("../resolver/PriceResolver");
const AdminResolver_1 = require("../resolver/AdminResolver");
const BillResolver_1 = require("../resolver/BillResolver");
const BrandResolver_1 = require("../resolver/BrandResolver");
const CommentResolver_1 = require("../resolver/CommentResolver");
const MoneyBonusResolver_1 = require("../resolver/MoneyBonusResolver");
const MyEventResolver_1 = require("../resolver/MyEventResolver");
const ProductResolver_1 = require("../resolver/ProductResolver");
const UserResolver_1 = require("../resolver/UserResolver");
exports.PRODUCT_LIMIT_PER_PAGE = 10;
exports.COMMENT_LIMIT_PER_PAGE = 5;
exports.USER_LIMIT = 5;
exports.REJECTED_AMOUNT = 2;
exports.MONEY_COMMENT_PERCENT = 1 / 100;
exports.MONEY_INTRODUCE_PERCENT = 3 / 100;
exports.__prod__ = process.env.NODE_ENV === "production";
exports.resolvers = [
    AdminResolver_1.AdminResolver,
    BillResolver_1.BillResolver,
    BrandResolver_1.BrandResolver,
    CommentResolver_1.CommentResolver,
    MoneyBonusResolver_1.MoneyBonusResolver,
    MyEventResolver_1.MyEventResolver,
    ProductResolver_1.ProductResolver,
    UserResolver_1.UserResolver,
    PriceResolver_1.PriceResolver
];
exports.AMERICA = "MỸ";
exports.KOREA = "HÀN QUỐC";
exports.VIETNAM = "VIỆT NAM";
exports.AMERICA_INFO = [
    `Bạn sẽ nhận được hóa đơn trực tiếp từ những cửa hàng uy tín ở ${exports.AMERICA}.`,
    `Bạn có thể liên hệ qua email hoặc mạng xã hội với các cửa hàng ở ${exports.AMERICA} để kiểm tra sản phẩm.`,
    "Miễn phí vận chuyển với đơn hàng trên 8.000.000đ.",
    "Thời gian nhận hàng từ 9 đến 21 ngày kể từ ngày đơn hàng được xác nhận.",
    "Bạn vui lòng thanh toán trước 25% giá trị đơn hàng.",
    "Trân trọng cảm ơn Bạn đã đọc thông tin này.",
];
exports.KOREA_INFO = [
    `Bạn sẽ nhận được hóa đơn trực tiếp từ những cửa hàng uy tín ở ${exports.KOREA}.`,
    `Bạn có thể liên hệ qua email hoặc mạng xã hội với các cửa hàng ở ${exports.KOREA} để kiểm tra sản phẩm.`,
    `Miễn phí vận chuyển với đơn hàng trên 5.000.000đ.`,
    `Thời gian nhận hàng từ 7 đến 14 ngày kể từ ngày đơn hàng được xác nhận.`,
    `Bạn vui lòng thanh toán trước 15% giá trị đơn hàng.`,
    `Trân trọng cảm ơn Bạn đã đọc thông tin này.`,
];
exports.VIETNAM_INFO = [
    "sản phẩm đảm bảo nguồn gốc và chất lượng 100%.",
    "Miễn phí đổi trả nếu sản phẩm có vấn đề.",
    "Miễn phí vận chuyển với đơn hàng trên 500.000đ.",
    "Thời gian nhận hàng từ 3 đến 8 ngày kể từ ngày đơn hàng được xác nhận.",
    "Bạn vui lòng thanh toán trước 5% giá trị đơn hàng.",
    "Trân trọng cảm ơn Bạn đã đọc thông tin này."
];
//# sourceMappingURL=constants.js.map