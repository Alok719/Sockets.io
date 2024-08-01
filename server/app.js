import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("message", ({ message, room }) => {
    console.log({ message, room });
    socket.to(room).emit("received-message", message);
  });
  socket.on("join-room", (room) => {
    socket.join(room);
  });
});
server.listen(port, () => console.log(`listening on port ${port}`));
