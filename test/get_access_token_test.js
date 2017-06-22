var getToken = require('../lib/get_access_token');

exports.queue_test = function (test) {
    test.expect(1);
    getToken.getAccessToken((err,token) => {
        test.ok(token,'Should receive token.');
        test.done();
    });
};
