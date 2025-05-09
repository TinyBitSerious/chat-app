const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let messages = [];  // Store messages

// Handle chat messages
io.on('connection', (socket) => {
  console.log('a user connected');

  // When a message is sent
  socket.on('chat message', (msg) => {
    const message = {
      user: msg.user,
      text: msg.text
    };

    messages.push(message);
    io.emit('chat message', message); // Emit the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Use the port provided by Render (or 3000 as fallback)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});