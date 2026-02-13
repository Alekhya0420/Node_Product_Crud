import { Server, Socket } from "socket.io";
import { MessageModel } from "../models/socket/message.models";

export const registerChatHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on("send_message", async (data) => {
      try {
        const message = await MessageModel.create({
          conversationId: data.conversationId,
          sender: data.sender,
          text: data.text,
        });

        io.to(data.conversationId).emit("receive_message", message);
      } catch (error) {
        console.error("Message save error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
