var weChat = require('../lib/weChatAPI');

exports.postMenuSuccess_test = function (test) {
    test.expect(1);
    weChat.getAccessToken((err, token) => {
        weChat.postMenu(token,'../public/menu.json',(err) => {
            test.equal(err,null,'Should not have error from WeChat server.');
            test.done();
        });
    });
};

exports.postMenuFail_cridential_test = function (test) {
    test.expect(1);
    weChat.postMenu('758Fu9V','../public/menu.json',(err) => {
        test.throws(() => {throw err},/invalid/,'Should receive error from WeChat server.');
        test.done();
    });
};
