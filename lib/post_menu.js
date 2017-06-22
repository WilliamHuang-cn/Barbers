// Post menu from predefined JSON file. Callback function handles errors if one occurs.

exports.postMenu = function (accessToken, cb) {

    var https = require('https');
    var options = {
        host: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/menu/create?access_token='+accessToken,
        method: 'POST'
    };

    var req = https.request(options, (res) => {
        var data = '';
        res.on('data', (chunck) => {
                data += chunck;
        });

        res.on('end', () => {
            console.log(data);
            var err = null;
            rsp = JSON.parse(data);
            if (rsp['errcode'] != 0) {
                 err = new Error(rsp['errmsg']);
                 console.error(err);
            }
            cb(err);
        });
    });

    // req.write('');
    req.end();
    // console.log('Request sent: '+req);
};
