"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStatus = calculateStatus;
function calculateStatus(quantity, minThreshold) {
    if (quantity === 0)
        return "out_of_stock";
    if (quantity <= minThreshold)
        return "low_stock";
    return "in_stock";
}
//# sourceMappingURL=calculate.inventory.js.map