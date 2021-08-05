const app = require("express")();
const server = require("http").createServer(app);

const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running!");
});

io.on("connection", (socket) => {
  // give us our own id on frontend
  socket.emit("me", socket.id);

  // bread cast a message to end the handshake
  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  // calling the user data
  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  //call recived by user and answered
  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });

  //Message the connected user
  socket.on("sendmessage", (body, room) => {
    io.emit("message", body);
  });


});

server.listen(PORT, (req, res) => {
  console.log(`Server Listing on Port : ${PORT}`);
});
