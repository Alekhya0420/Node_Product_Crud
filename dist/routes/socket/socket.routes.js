"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const socket_controller_1 = require("../../controllers/socket/socket.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
//Get all conversations
router.get("/conversations", auth_middleware_1.authMiddleware, socket_controller_1.getAllConversations);
// Get messages of a conversation
router.get("/messages/:conversationId", auth_middleware_1.authMiddleware, socket_controller_1.getMessages);
exports.default = router;
//# sourceMappingURL=socket.routes.js.map