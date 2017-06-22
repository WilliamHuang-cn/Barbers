// Request access_token for WeChat API. Callback fucntion recieves token as parameter.

exports.getAccessToken = function (cb){
    const appid = 'wx4782a4f874fc9778';
    const secret = '97dfe43f546a0fb1f1a1a2bdc1c2909f';

    var https = require('https');
    var options = {
        host: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret,
        method: 'GET'
    };

    var req = https.request(options, (res) => {
        var data = '';
        res.on('data', (chunck) => {
                data += chunck;
        });

        res.on('end', () => {
            console.log(data);
            var err = null;
            msg = JSON.parse(data);
            token = msg['access_token'];
            if (!token && msg['errcode'] != 0) {
                err = new Error(msg['errmsg']);
                console.error(err);
            }
            cb(err,token);
        });
    });
    req.end();
};
