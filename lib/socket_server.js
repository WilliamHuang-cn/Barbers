var socketio = require('socket.io');
var io;

exports.listen = (server) => {
    var io = socketio(server);
    io.set('log level',1);
    io.sockets.on('connection', (socket) => {

        console.log('Client successfully connect to server via socket.io!');
        socket.on('hello',() => {
            console.log('Client emitted event hello');
        });

        socket.on('joinQueue',() => {

        });

        socket.on('disconnect',() => {

        });
    });
};
