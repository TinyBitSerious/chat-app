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

// Handle chat messages
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle incoming chat message
  socket.on('chat message', (msg) => {
    // Emit the message with a unique id
    const messageId = Date.now();
    msg.id = messageId;
    msg.status = 'delivered'; // Initial status is delivered

    io.emit('chat message', msg);

    // Emit "read" status after a delay to simulate message reading
    setTimeout(() => {
      msg.status = 'read';
      io.emit('message status', msg);
    }, 3000); // Assuming the message is read after 3 seconds
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