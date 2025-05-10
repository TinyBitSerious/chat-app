const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Load saved messages from the JSON file, or create an empty array if not found
const messagesFilePath = path.join(__dirname, 'messages.json');
let messages = [];

// Attempt to read the messages from the file on server start
if (fs.existsSync(messagesFilePath)) {
  const data = fs.readFileSync(messagesFilePath, 'utf8');
  try {
    messages = JSON.parse(data);
  } catch (err) {
    console.log('Error reading messages file, starting with empty messages array');
    messages = [];
  }
}

// Handle chat messages
io.on('connection', (socket) => {
  console.log('a user connected');

  // Send the existing messages when a new user connects
  socket.emit('chat history', messages);

  // When a message is sent
  socket.on('chat message', (msg) => {
    const message = {
      user: msg.user,
      text: msg.text,
      timestamp: Date.now()
    };

    messages.push(message);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2)); // Save to file

    io.emit('chat message', message); // Emit the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Cleanup messages older than 24 hours
setInterval(() => {
  const now = Date.now();
  messages = messages.filter(message => now - message.timestamp < 24 * 60 * 60 * 1000); // Keep only messages from the last 24 hours
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2)); // Save the updated messages
}, 60 * 60 * 1000); // Run every hour

// Use the port provided by Render (or 3000 as fallback)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
