import { Request,Response } from "express";
import { MessageModel } from "../../models/socket/message.models";
import { ConversationModel } from "../../models/socket/conversation.model";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const messages = await MessageModel
      .find({ conversationId })
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};


export const getAllConversations = async (_req: Request, res: Response) => {
  try {
    const conversations = await ConversationModel
      .find()
      .populate("userId", "name email");

    return res.status(200).json(conversations);

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
};
