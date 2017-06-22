var pm = require('../lib/post_menu');
var getToken = require('../lib/get_access_token');

exports.queue_test = function (test) {
    test.expect(1);
    getToken.getAccessToken((token) => {
        pm.postMenu(token,(data) => {
            test.ok(data,'Should receive data.');
            test.done();
        });
    });
};
