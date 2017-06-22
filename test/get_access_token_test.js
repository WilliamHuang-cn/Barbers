var getToken = require('../lib/get_access_token');

exports.queue_test = function (test) {
    test.expect(1);
    getToken.getAccessToken((data) => {
        test.ok(data,'Should receive data.');
        test.done();
    });
};
