// Lucas Bubner, 2022

// Get the node modules we need
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// Get our custom module exports for user and message configurations
const { generateMessage, generateLocationMessage } = require("./modules/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./modules/users");

// Initalise application on port 8080
const app = express();
const server = http.createServer(app);
const io = socketio(server);
require("dotenv").config();

// Set public directory for static JS, CSS, images, and minichat
const port = process.env.PORT || 8080;
const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));

// Default request, homepage
app.get("/", (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

// Additional requests for each PC part
app.get("/cpu", (req, res) => {
    res.sendFile('./parts/cpu.html', { root: __dirname });
});

app.get("/mobo", (req, res) => {
    res.sendFile('./parts/motherboard.html', { root: __dirname });
});

app.get("/gpu", (req, res) => {
    res.sendFile('./parts/graphics.html', { root: __dirname });
});

app.get("/psu", (req, res) => {
    res.sendFile('./parts/powersupply.html', { root: __dirname });
});

app.get("/cool", (req, res) => {
    res.sendFile('./parts/cooling.html', { root: __dirname });
});

app.get("/stor", (req, res) => {
    res.sendFile('./parts/storage.html', { root: __dirname });
});

app.get("/case", (req, res) => {
    res.sendFile('./parts/case.html', { root: __dirname });
});

// Handles connection through socket.io websocket when minichat is initialised
io.on("connection", socket => {
    console.log("New WebSocket connection");

    // Create a user
    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        } else {
            socket.join(user.room);

            // Notify upon successful connection
            socket.emit("message", generateMessage("SYSTEM", `Connection successful. Welcome, ${user.username}!`));
            socket.broadcast.to(user.room).emit("message", generateMessage("SYSTEM", `${user.username} has joined!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });

            callback();
        }
    });

    // Handles attaching a message to the correct user
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("message", generateMessage(user.username, message));
        callback();
    });

    // Handles attaching location to the correct user
    socket.on("sendLocation", (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });

    // Handles when the connection to the chat is terminated, and notifies the chat
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

// Notify the server is online
server.listen(port, () => {
    console.log(`Server is running! -- http://127.0.0.1:${port}`);
});
