var weChat = require('../lib/weChatAPI');

exports.fetchUserInfoSuccess_test = function (test) {
    test.expect(1);
    weChat.getAccessToken((err, token) => {
        weChat.fetchUserInfo(token,'o1VHv0YxhJ9b4BI-qZZ1EnSIN73g','zh_CN',(err,data) => {
            console.log(data);
            test.equal(err,null,'Should not have error from WeChat server.');
            test.done();
        });
    });
};
