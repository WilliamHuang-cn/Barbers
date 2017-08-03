var socketio = require('socket.io');
var queue;
var io;

exports.listen = (server,inqueue,userInfo) => {
    queue = inqueue;
    var io = socketio(server);
    var customer = null;

    // check userProfile dir
    userInfo.mkuserProfilePath((err,dirpath) => {
        if (!err) {
            //userProfilePath = dirpath;
        }
    });

    io.set('log level',1);
    io.sockets.on('connection', (socket) => {

        console.log(`Client successfully connect to server via socket.io! id: ${socket.id}`);

        socket.on('registerInfo',() => {
            // TODO: complete registerInfo handout

        });

        socket.on('joinQueue',(customerInfo) => {
            queue.addCustomerToQueue({name:customerInfo.name,
                                      openid:customerInfo.openid,
                                      serviceType:customerInfo.seriveType,
                                      tel:customerInfo.tel,
                                      sex:customerInfo.sex,
                                      remark:customerInfo.remark},(err,customer) => {
                console.log('Customer join queue: '+JSON.stringify(customer));
                if (err != null) {
                    console.log(err.message);
                    socket.emit('joinResult',{success:false,msg:err.message});
                }
                else {
                    console.log('Join queue success');
                    socket.emit('joinResult',{success:true,msg:null});
                    // Save to User Profile
                    userInfo.saveUserProfile(customer,(err, userProfile) => {
                        if (err != null) {
                            console.log(err.message);
                        }
                        else {
                            console.log(userProfile.openid + ' profile saved.');
                        }
                    })
                }
            });
        });

        socket.on('monitorQueue',() => {
            queue.queueInfo((err,customers) => {
                socket.emit('queueInfo',customers);
            });
        });

        socket.on('disconnect',() => {
            console.log(`Client successfully disconnected from server! id: ${socket.id}`);
        });
    });
};
