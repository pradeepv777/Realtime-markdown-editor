import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Document from "./models/Document.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect("mongodb://127.0.0.1:27017/realtime-md");

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("get-document", async docId => {
    let document = await Document.findById(docId);
    if (!document) document = await Document.create({ _id: docId, content: "" });
    socket.join(docId);
    socket.emit("load-document", document.content);

    socket.on("send-changes", delta => {
      socket.broadcast.to(docId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(docId, { content: data });
    });
  });
});

server.listen(5000, () => console.log("Server running on 5000"));
