const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Path to the messages file
const messagesFilePath = path.join(__dirname, 'messages.json');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let messages = [];  // Store messages temporarily in memory

// Load existing messages from the file
function loadMessages() {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
  } catch (err) {
    console.log('No previous messages or error reading file:', err);
    messages = [];
  }
}

// Save the messages to the file
function saveMessages() {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
}

// Clean messages that are older than 24 hours
function cleanupMessages() {
  const now = Date.now();
  messages = messages.filter(message => now - message.timestamp < 24 * 60 * 60 * 1000);
  saveMessages();  // Save the filtered messages back to the file
}

// Load messages when the server starts
loadMessages();

// Set an interval to clean up messages every 1 hour
setInterval(cleanupMessages, 60 * 60 * 1000);  // Run cleanup every hour

// Handle chat messages
io.on('connection', (socket) => {
  console.log('a user connected');

  // Send existing messages to the new client
  socket.emit('chat history', messages);

  // When a message is sent
  socket.on('chat message', (msg) => {
    const message = {
      user: msg.user,
      text: msg.text,
      timestamp: Date.now()  // Add a timestamp to each message
    };

    messages.push(message);
    saveMessages();  // Save the updated message list to the file
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
