import http from "http";
import { Server } from "socket.io";
import { Express } from "express";
import jwt from "jsonwebtoken";
import { registerChatHandlers } from "./chat.socket";

export const createSocketServer = (app: Express) => {

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  /* ------------------------- Socket Authentication-------------------------- */
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );

      socket.data.user = decoded; 
      next();

    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  /*-------------------------Register Chat Events--------------------------*/
  registerChatHandlers(io);

  return server;
};
