"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = void 0;
const message_models_1 = require("../models/socket/message.models");
const registerChatHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("join_conversation", (conversationId) => {
            socket.join(conversationId);
        });
        socket.on("send_message", async (data) => {
            try {
                const message = await message_models_1.MessageModel.create({
                    conversationId: data.conversationId,
                    sender: data.sender,
                    text: data.text,
                });
                io.to(data.conversationId).emit("receive_message", message);
            }
            catch (error) {
                console.error("Message save error:", error);
            }
        });
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });
};
exports.registerChatHandlers = registerChatHandlers;
//# sourceMappingURL=chat.socket.js.map