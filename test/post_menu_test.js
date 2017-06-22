var weChat = require('../lib/weChatAPI');

exports.postMenuSuccess_test = function (test) {
    test.expect(1);
    weChat.getAccessToken((err, token) => {
        weChat.postMenu(token,(err) => {
            test.doesNotThrow(err,Error,'Should not have error from WeChat server.');
            test.done();
        });
    });
};

exports.postMenuFail_cridential_test = function (test) {
    test.expect(1);
    weChat.postMenu('758Fu9V',(err) => {
        test.throws(() => {throw err},/invalid/,'Should receive error from WeChat server.');
        test.done();
    });
};
