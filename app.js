const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io"); // Ensure this line is correct

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5500', // Ensure this matches your front-end origin
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Ensure this matches your front-end origin
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 204 // For older browsers
}));

// Middleware

// // Serve static files from the public directory
// app.use(express.static('public'));

const users = {};
// Socket.IO connection
io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    // socket.on('custom-event', (number, string, obj) => {
    //     console.log(number, string, obj);
    // });
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit("user-connected", name)
    });

    // Handle chat message
    socket.on('message', message => {
        io.emit('message', {message: message, user: users[socket.id]}); // Broadcast the message to all connected clients
        console.log(`Message received: ${message}`);
    });

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit("user-disconnected", users[socket.id])
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
