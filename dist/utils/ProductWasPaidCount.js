"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductManager = () => {
    let productWasPaidCount;
    const getProductCount = () => productWasPaidCount;
    const setProductCount = (value) => {
        productWasPaidCount = value;
    };
    return { getProductCount, setProductCount };
};
exports.default = ProductManager();
//# sourceMappingURL=ProductWasPaidCount.js.map