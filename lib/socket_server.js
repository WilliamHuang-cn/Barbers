var socketio = require('socket.io');
var io;

exports.listen = (server) => {
    var io = socketio(server);
    io.set('log level',1);
    io.sockets.on('connection', (socket) => {

        // console.log('Client successfully connect to server via socket.io!');

        // TODO: socket.emit('serviceTypes',{

        // });

        socket.on('joinQueue',(customerInfo) => {
            console.log(customerInfo);
        });

        socket.on('disconnect',() => {

        });
    });
};
