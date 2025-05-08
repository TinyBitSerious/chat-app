const http = require('http'); // Native Node module for HTTP
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200; // Status code
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!'); // Response to show on the page
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});