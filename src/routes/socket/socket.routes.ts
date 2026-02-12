import { Router } from "express";
import { getMessages,getAllConversations } from "../../controllers/socket/socket.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

//Get all conversations
router.get("/conversations", authMiddleware, getAllConversations);

// Get messages of a conversation
router.get("/messages/:conversationId", authMiddleware, getMessages);

export default router;
