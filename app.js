// Lucas Bubner, 2022

// Initialise application using Express and Socket frameworks
const socketio = require("socket.io");
const express = require('express');
const http = require("http");
const port = process.env.PORT || 8888;
const app = express();
// Get our modules for the chat function
const { generateMessage } = require("./modules/messages");
const { userJoin, removeUser, getUser } = require("./modules/users");
const server = http.createServer(app);
const io = socketio(server);

// Set public folder for static requests such as our CSS and our images
app.use(express.static('public'));

require("dotenv").config();

// Default request
app.get('/', (req, res) => {
  res.sendFile('./html/index.html', { root: __dirname });
});

io.on("connection", socket => {

  socket.on("join", (options, callback) => {
    const { error, user } = userJoin({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    } else {
      socket.join(user);

      socket.emit("message", generateMessage("SYSTEM", "Connection successful."));
      socket.broadcast.to(user).emit("message", generateMessage("SYSTEM", `${user.username} has joined!`));
      callback();
    }
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user).emit("message", generateMessage("SYSTEM", `${user.username} has left!`));
      };
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});