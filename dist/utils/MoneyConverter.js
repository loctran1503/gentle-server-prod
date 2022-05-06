"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyConverter = void 0;
const MoneyConverter = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
exports.MoneyConverter = MoneyConverter;
//# sourceMappingURL=MoneyConverter.js.map