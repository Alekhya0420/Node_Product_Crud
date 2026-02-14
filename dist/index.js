"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const socket_server_1 = require("./socket/socket.server");
const express_1 = __importDefault(require("express"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const order_routes_1 = __importDefault(require("./routes/user/order.routes"));
const cart_routes_1 = __importDefault(require("./routes/user/cart.routes"));
const socket_routes_1 = __importDefault(require("./routes/socket/socket.routes"));
const db_1 = require("./config/db");
const app = (0, express_1.default)();
const PORT = 3000;
//const MONGO_URI = 'mongodb+srv://Alekhya:VesEL_ND77thuQV@cluster0.xel9zn0.mongodb.net/productDB?retryWrites=true&w=majority'
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (_req, res) => {
    res.send('Product CRUD API is running');
    res.send('Product CRUD API is running');
});
app.use('/api/products', product_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/supplier', supplier_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/order', order_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/chat', socket_routes_1.default);
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        const server = (0, socket_server_1.createSocketServer)(app);
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map