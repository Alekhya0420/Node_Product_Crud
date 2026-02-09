"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const app = (0, express_1.default)();
const PORT = 3000;
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (_req, res) => {
    res.send('Product CRUD API is running');
});
app.use('/api/products', product_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/supplier', supplier_routes_1.default);
const startServer = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map