require('../.config/config.js');
// require('module/')
// imports
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

// declaration
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is now up on port ${port}`);
});

require('./modules/messager.emitter.js')(io);
module.exports = { app, server };
