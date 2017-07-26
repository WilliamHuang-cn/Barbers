var socketio = require('socket.io');
var queue;
var io;

exports.listen = (server,inqueue) => {
    queue = inqueue;
    var io = socketio(server);
    io.set('log level',1);
    io.sockets.on('connection', (socket) => {

        // console.log('Client successfully connect to server via socket.io!');

        // TODO: socket.emit('serviceTypes',{

        // });

        socket.on('joinQueue',(customerInfo) => {
            console.log(customerInfo);
            queue.addCustomerToQueue({name:customerInfo.name,openid:'abc',serviceType:customerInfo.seriveType,tel:customerInfo.tel,sex:customerInfo.sex,remark:customerInfo.remark},(err) => {
                if (err != null) {
                    console.log(err);
                    socket.emit('joinResult',{success:false,msg:err.msg});
                }
                else {
                    socket.emit('joinResult',{success:true,msg:null});
                }
            });
        });

        socket.on('disconnect',() => {

        });
    });
};
