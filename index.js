const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const secret = "secret";

// Set up CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://pn6c7sfj-3000.inc1.devtunnels.ms/", // The client-side URL where the React app is hosted
    methods: ["GET", "POST"], // Allowed methods for CORS
    credentials: true,
  },
});
app.get("/", (req, res) => {
  "hello";
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (room) => {
    console.log("a user join room:", room);
    socket.join(room);
  });

  socket.on("call", ({ to, offer, from }) => {
    io.to(to).emit("requestCall", { offer, from });
  });

  socket.on("call:accepted", ({ to, answer, from }) => {
    console.log(to, from, answer);
    io.to(to).emit("callRequest:accepted", { answer, from });
  });

  socket.on("peer:negotiation", ({ from, to, offer }) => {
    // console.log("peer:negotiation", offer);
    console.log("inneed", to, "from:", from);
    io.to(to).emit("peer:negotiation", { from, offer });
  });

  socket.on("peer:negotiation:done", ({ from, to, answer }) => {
    console.log("peer:negotiation:done", answer);
    io.to(to).emit("peer:negotiation:done", { from, answer });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
