var socketio = require('socket.io');
var io;

exports.listen = (server) => {
    io = socketio(server);
    io.set('log level',1);
    io.sockets.on('connection', (socket) => {

        console.log('Client successfully connect to server via socket.io!');
        socket.on('rooms',() => {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        socket.on('disconnect',() => {

        });
    });
};
