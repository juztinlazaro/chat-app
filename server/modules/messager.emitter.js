const socketIO = require('socket.io');
const {
  generateMessage,
  generateLocationMessage,
} = require('../utils/message');
const { isRealString } = require('../utils/validation');

module.exports = function(io) {
  io.on('connection', socket => {
    console.log('new user connected');

    socket.on('disconnect', socket => {
      console.log('new user disconnected');
    });

    socket.on('createMessage', (message, callback) => {
      console.log('createMessage', message);
      // submit all
      io.emit('newMessage', generateMessage(message.from, message.text));

      callback('nice, This is from the server');
      // submit all except you
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime(),
      // });
    });

    socket.on('join', (params, callback) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        callback('Name and room name are required');
      }

      socket.join(params.room);
      socket.leave(params.room);

      // socket.emit from Admin text welcome to the chat app
      socket.emit(
        'newMessage',
        generateMessage('Admin', 'Welcome to the chat app'),
      );

      // socket.broadcast.emit from admin text new user joined
      socket.broadcast.emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has joined`),
      );
      callback();
    });

    //listener for create location
    socket.on('createLocationMessage', coords => {
      io.emit(
        'newLocationMessage',
        generateLocationMessage('Admin', coords.latitude, coords.longitude),
      );
    });
  });
};
