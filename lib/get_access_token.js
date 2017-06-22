// Request access_token for WeChat API. Callback fucntion recieves token as parameter.

exports.getAccessToken = function (cb){

    var https = require('https');
    var options = {
        host: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?grant_type=client_credential&appid=wx4782a4f874fc9778&secret=97dfe43f546a0fb1f1a1a2bdc1c2909f',
        method: 'GET'
    };

    var req = https.request(options, (res) => {
        var data = '';
        res.on('data', (chunck) => {
                data += chunck;
        });

        res.on('end', () => {
            // console.log(data);
            token = JSON.parse(data)['access_token'];
            cb(token);
        });
    });
    req.end();
};
