var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', socket => {
    console.log('a user connected');
    socket.broadcast.emit('hi');
});