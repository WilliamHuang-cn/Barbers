// Request access_token for WeChat API. Callback fucntion recieves token as parameter.
exports.getAccessToken = function (cb){
    const appid = 'wx4782a4f874fc9778';
    const secret = '97dfe43f546a0fb1f1a1a2bdc1c2909f';

    var options = {
        host: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret,
        method: 'GET'
    };

    sendHTTPSRequest(options,'',null,(res,data) => {
        var err = null;
        msg = JSON.parse(data);
        token = msg['access_token'];
        if (!token && msg['errcode'] != 0) {
            err = new Error(msg['errmsg']);
            console.error(err);
        }
        cb(err,token);
    });
};

// Post menu from predefined JSON file. Callback function handles errors if one occurs.
exports.postMenu = function (accessToken, cb) {

    var fs = require('fs');
    const menuFilePath = '../public/menu.json';
    stream = fs.createReadStream(menuFilePath);
    var size = 0;
    fs.stat(menuFilePath,(err,stat) => {
        if (err == null) {
            size = stat.size;
        }
        else {
            console.error(new Error('Failed to load file at path: '+menuFilePath));
        }

        console.log(size);
        var options = {
            host: 'api.weixin.qq.com',
            path: '/cgi-bin/menu/create?access_token='+accessToken,
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': size
            }
        };

        sendHTTPSRequest(options,'stream',stream,(res,data) => {
            var err = null;
            rsp = JSON.parse(data);
            if (rsp['errcode'] != 0) {
                 err = new Error(rsp['errmsg']);
            }
            console.log(err);
            cb(err);
        });
    });
};


// Use input options and data to create an HTTPS request. Callback receives response and data
function sendHTTPSRequest(options,dataType,data,cb) {
    var https = require('https');
    var req = https.request(options, (res) => {
        var data = '';
        res.on('data', (chunck) => {
                data += chunck;
        });

        res.on('end', () => {
            if (cb === undefined) {
                console.log(res);
                console.log(data);
            }
            else cb(res,data);
        });
    });

    switch (dataType) {
        case 'stream':
            data.pipe(req);
            break;
        case 'string':
            req.write(data);
            req.end();
            break;
        default:
            req.end();
    }

}
