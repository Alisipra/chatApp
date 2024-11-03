import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

//server creations
const app = express();

const server = http.createServer(app);

///setup socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  //creating route
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ID:-${socket.id} joined ${data}`);
  });
  //route to send message
  socket.on("send_message", (data) => {
    console.log("send message here", data);
    socket.to(data.room).emit("receive_message", data);
  });
  //message receive logic

  socket.on("disconnect", () => {
    console.log("user disconnected...", socket.id);
  });
});
app.use(cors());
server.listen(2000, () => console.log("Server is listening 2000"));
