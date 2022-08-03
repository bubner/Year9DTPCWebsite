const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./modules/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./modules/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require("dotenv").config();

const port = process.env.PORT || 8080;
const publicDirectoryPath = path.join(__dirname, "./public");

app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

app.post("/", (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

io.on("connection", socket => {
    console.log("New WebSocket connection");

    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        } else {
            socket.join(user.room);

            socket.emit("message", generateMessage("SYSTEM", `Connection successful. Welcome, ${user.username}!`));
            socket.broadcast.to(user.room).emit("message", generateMessage("SYSTEM", `${user.username} has joined!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });

            callback();
        }
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("message", generateMessage(user.username, message));
        callback();
    });

    socket.on("sendLocation", (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", generateMessage("SYSTEM", `${user.username} has left!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});