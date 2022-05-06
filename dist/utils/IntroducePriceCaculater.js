"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentPriceCaculater = exports.IntroducePriceCaculater = void 0;
const constants_1 = require("./constants");
const IntroducePriceCaculater = (value) => {
    return value * constants_1.MONEY_INTRODUCE_PERCENT;
};
exports.IntroducePriceCaculater = IntroducePriceCaculater;
const CommentPriceCaculater = (value) => {
    return value * constants_1.MONEY_COMMENT_PERCENT;
};
exports.CommentPriceCaculater = CommentPriceCaculater;
//# sourceMappingURL=IntroducePriceCaculater.js.map