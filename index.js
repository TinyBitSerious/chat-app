const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// SQLite database setup
const db = new sqlite3.Database('./chat.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT,
      text TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Handle chat messages
io.on('connection', (socket) => {
  console.log('a user connected');

  // Send all past messages on connect
  db.all('SELECT user, text FROM messages ORDER BY timestamp ASC', [], (err, rows) => {
    if (!err) {
      rows.forEach((row) => {
        socket.emit('chat message', row);
      });
    }
  });

  // When a new message is sent
  socket.on('chat message', (msg) => {
    db.run('INSERT INTO messages (user, text) VALUES (?, ?)', [msg.user, msg.text], (err) => {
      if (err) {
        console.error('DB insert error:', err);
        return;
      }
      io.emit('chat message', msg); // Send to all clients
    });
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
