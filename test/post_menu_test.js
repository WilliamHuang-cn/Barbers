var pm = require('../lib/post_menu');
var getToken = require('../lib/get_access_token');

exports.postMenuSuccess_test = function (test) {
    test.expect(1);
    getToken.getAccessToken((err, token) => {
        pm.postMenu(token,(err) => {
            test.doesNotThrow(err,Error,'Should not have error from WeChat server.');
            test.done();
        });
    });
};

exports.postMenuFail_cridential_test = function (test) {
    test.expect(1);
    pm.postMenu('asdf',(err) => {
        test.throws(() => {throw err},/invalid/,'Should receive error from WeChat server.');
        test.done();
    });
};
