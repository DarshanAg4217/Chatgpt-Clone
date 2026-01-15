const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();
const initSocketServer = require('./src/socket/socket.server');
const http = require('http');
// Create HTTP server
const httpServer = http.createServer(app);


// Connect to the database
connectDB();

// Initialize Socket.IO server
initSocketServer(httpServer);



httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});