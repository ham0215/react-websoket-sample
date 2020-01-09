var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('sendMessage', (msg) => {
    console.log(`message: ${msg}`);
    io.emit('receiveMessage', { msg });
  });
});

http.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});