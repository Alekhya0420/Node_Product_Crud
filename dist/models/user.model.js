"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    password: String,
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    otp: String,
    otpExpiry: Date,
    otpVerified: { type: Boolean, default: false },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map