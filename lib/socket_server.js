var socketio = require('socket.io');
var fs = require('fs');
var path = require('path');
var queue;
var io;
var userProfileName = '';
var userProfilePath = __dirname + '/../public/users/';
var Profile = {};

function mkdirs(dirpath, cb) {
    dirpath = path.normalize(dirpath);
    fs.access(dirpath, (err) => {
        if(!err) {
            cb(null, dirpath);
        } else {
            //create parent dir
            mkdirs(path.dirname(dirpath), (err) => {
                if (!err) {
                    fs.mkdir(dirpath, cb);
                }
                else {
                  cb(err);
                }
            });
        }
    });
};

exports.listen = (server,inqueue) => {
    queue = inqueue;
    var io = socketio(server);
    var customer = null;

    // check userProfile dir
    mkdirs(userProfilePath,(err,dirpath) => {
        if (err) {
            console.log("creat userProfile dir err: " + err);
        }
        else {
            userProfilePath = dirpath;
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
                    var userProfile = {};
                    saveUserProfile(customer,(err, userProfile) => {
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

function saveUserProfile(userProfile, cb) {
    var err = null;
    if (userProfile == undefined || userProfile == null) {
        err = new Error('userProfile is unavaliable.');
        cb(err,null);
        return;
    }

    Profile.name = userProfile.name;
    Profile.openid = userProfile.openid;
    Profile.sex = userProfile.sex;
    Profile.tel = userProfile.tel;

    if (Profile.openid == undefined || Profile.openid == null) {
        err = new Error('customerID is unavaliable.');
        cb(err,null);
        return;
    }

    userProfileName = userProfile.openid + '.json';
    fs.writeFile(userProfilePath + '/' + userProfileName, JSON.stringify(Profile), function(err) {
        if(err) {
            console.log("userProfile save error: " + err);
            cb(err,null);
        }
        else {
            console.log("userProfile saved.");
            cb(err,Profile);
        }
    });
}

// funciton loadUserProfile(cb) {
//     var err = null;
//     var Profile = {};
//     cb(err,Profile);
// }
