var fs = require('fs');
var path = require('path');
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
}

exports.mkuserProfilePath = (cb) => {
    mkdirs(userProfilePath,(err,dirpath) => {
        if (err) {
            console.log("creat userProfile dir err: " + err);
            cb(err);
        }
        else {
            userProfilePath = dirpath;
            cb(null,dirpath);
        }
    });
}

exports.saveUserProfile = (userProfile, cb) => {
    var err = null;
    var userProfileName = '';
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

exports.loadUserProfile = (openid, cb) => {
    var err = null;
    var userProfileName = '';

    if (openid == undefined || openid == null) {
        err = new Error('customerID is unavaliable.');
        cb(err,null);
        return;
    }

    userProfileName = openid + '.json';
    fs.readFile(userProfilePath + '/' + userProfileName, (err,data) => {
        if (err) {
            console.log("userProfile load error: " + err);
            cb(err,null);
        }
        else {
            // read json file
            var Profile = JSON.parse(data);
            console.log("userProfile loaded.");
            cb(err,Profile);
        }
    });
}
