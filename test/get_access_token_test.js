// var getToken = require('../lib/get_access_token');
var getToken = require('../lib/weChatAPI');

exports.queue_test = function (test) {
    test.expect(1);
    getToken.getAccessToken((err,token) => {
        console.log('Token retrieved: '+token);
        test.ok(token,'Should receive token.');
        test.done();
    });
};
