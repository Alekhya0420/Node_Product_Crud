import http from "http";
import { Server } from "socket.io";
import { Express } from "express";
import { registerChatHandlers } from "./chat.socket";

export const createSocketServer = (app: Express) => {

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  registerChatHandlers(io);

  return server;
};
