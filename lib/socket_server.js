var socketio = require('socket.io');
// const EventEmitter = require('events');
// var emitter = new EventEmitter();
var process = require('process');
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

    queue.on('queueUpdated',() => {
        process.nextTick(() => {io.sockets.emit('updateQueue');});
    });

    io.sockets.on('connection', (socket) => {

        console.log(`Client successfully connect to server via socket.io! id: ${socket.id}`);

        socket.on('registerInfo',() => {
            // TODO: complete registerInfo handout

        });

        socket.on('joinQueue',(customerInfo) => {
            var newCustomer = {name:customerInfo.name,
                                openid:customerInfo.openid,
                                serviceType:customerInfo.seriveType,
                                tel:customerInfo.tel,
                                sex:customerInfo.sex,
                                remark:customerInfo.remark};
            queue.hasCustomer(newCustomer,(err,customer) => {
                // add customer
                if (err) {
                    if (err.message.match(/No customer found/)) {
                        queue.addCustomerToQueue(newCustomer,(err,customer) => {
                            console.log('Customer join queue: '+JSON.stringify(customer));
                            if (err) {
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
                    }
                    else {
                        console.log(err.message);
                        socket.emit('joinResult',{success:false,msg:err.message});
                    }
                }
                // modify customer
                else {
                    queue.modifyCustomerInQueue(newCustomer,(err,customer) => {
                        console.log('Modify customer in queue: '+JSON.stringify(customer));
                        if (err) {
                            console.log(err.message);
                            socket.emit('ModifyResult',{success:false,msg:err.message});
                        }
                        else {
                            console.log('Modify customer in queue success');
                            socket.emit('ModifyResult',{success:true,msg:null});
                            // Save to User Profile
                            userInfo.saveUserProfile(customer,(err, userProfile) => {
                                if (err != null) {
                                    console.log(err.message);
                                }
                                else {
                                    console.log(userProfile.openid + ' profile saved.');
                                }
                            });
                        }
                    });
                }
            });
        });

        socket.on('monitorQueue',() => {
            queue.queueInfo((err,customers) => {
                socket.emit('queueInfo',customers);
            });
        });

        socket.on('removeCustomer',(options) => {
            console.log(options.openid);
            queue.removeCustomerFromQueue(options,(err,cus) => {
                if (err) {
                    socket.emit('removeResult',{success:false,msg:err.message});
                } else {
                    socket.emit('removeResult',{success:true,msg:''});
                }
            });
        });

        socket.on('disconnect',() => {
            console.log(`Client successfully disconnected from server! id: ${socket.id}`);
        });
    });
}
