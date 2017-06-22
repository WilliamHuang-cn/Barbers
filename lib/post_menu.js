// Post menu from predefined JSON file. Callback function handles errors. 

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
            error = JSON.parse(data);
            errcode = error['errcode'];
            errmsg = error['errmsg'];
            cb(data);
        });
    });

    req.write('');
    req.end();
};
