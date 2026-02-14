"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chat_socket_1 = require("./chat.socket");
const createSocketServer = (app) => {
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        },
    });
    /* ------------------------- Socket Authentication-------------------------- */
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        console.log("Incoming token:", token);
        console.log("JWT Secret:", process.env.JWT_SECRET);
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            socket.data.user = decoded;
            next();
        }
        catch (error) {
            next(new Error("Authentication error"));
        }
    });
    /*-------------------------Register Chat Events--------------------------*/
    (0, chat_socket_1.registerChatHandlers)(io);
    return server;
};
exports.createSocketServer = createSocketServer;
//# sourceMappingURL=socket.server.js.map