"use strict";
// import multer from 'multer';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// const storage = multer.diskStorage({
//   destination: 'uploads/products',
//   filename: (_req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// export const upload = multer({ storage });
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (_req, file, cb) => {
            cb(null, `products/${Date.now()}-${file.originalname}`);
        },
    }),
});
//# sourceMappingURL=multer.js.map