var socketio = require('socket.io');
var io;

exports.listen = (server) => {
    io = socketio.listen(server);
    io.set('log level',1);
    io.sockets.on('connection', (socket) => {

        socket.on('rooms',() => {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        socket.on('disconnect',() => {
            
        });
    });
};
