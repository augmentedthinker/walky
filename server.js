const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

// 1. Initialize Express
const app = express();
app.use(cors()); // Allow standard HTTP requests

// 2. Create the HTTP server
const server = http.createServer(app);

// 3. Initialize Socket.io with permissive CORS settings
// This is critical. It allows your frontend (hosted anywhere) to talk to this backend.
const io = new Server(server, {
    cors: {
        origin: "*", // DANGER: For production, we lock this down. For "Tracer Bullet", we allow all.
        methods: ["GET", "POST"]
    }
});

// 4. Handle Connection Events
io.on('connection', (socket) => {
    console.log('A vibe-coder connected:', socket.id);

    // Listen for incoming 'chat message' events
    socket.on('chat message', (msg) => {
        // Broadcast the message to ALL connected clients (including the sender)
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 5. Start the Server
// Railway provides a PORT environment variable. We fallback to 3000 for local testing.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Vibe Link Server running on port ${PORT}`);
});