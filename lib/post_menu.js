// Post menu from predefined JSON file. Callback function handles errors if one occurs.

exports.postMenu = function (accessToken, cb) {

    // var fs = require('fs');
    // const menuFilePath = '../public/menu.json';
    var https = require('https');
    var options = {
        host: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/menu/create?access_token='+accessToken,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': 10
        }
    };

console.log(options);

    var req = https.request(options, (res) => {
        console.log('qweqwe');
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

    // console.log(req);

    // stream = fs.createReadStream(menuFilePath);
    // stream.pipe(process.stdout);
    // stream.pipe(req);
    // console.log(req);
    // req.write('{"button":[{"type":"click","name":"今日歌曲","key":"V1001_TODAY_MUSIC"}]}');
    req.write('0123456789');
    req.end();
    console.log('request sent');
};
