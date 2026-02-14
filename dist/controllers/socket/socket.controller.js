"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllConversations = exports.getMessages = void 0;
const message_models_1 = require("../../models/socket/message.models");
const conversation_model_1 = require("../../models/socket/conversation.model");
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await message_models_1.MessageModel
            .find({ conversationId })
            .sort({ createdAt: 1 });
        return res.status(200).json(messages);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch messages" });
    }
};
exports.getMessages = getMessages;
const getAllConversations = async (_req, res) => {
    try {
        const conversations = await conversation_model_1.ConversationModel
            .find()
            .populate("userId", "name email");
        return res.status(200).json(conversations);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch conversations" });
    }
};
exports.getAllConversations = getAllConversations;
//# sourceMappingURL=socket.controller.js.map