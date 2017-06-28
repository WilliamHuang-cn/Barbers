var priceList = require('./priceList');


const main = {
    '查询价格':'jgcx',
    '排队理发':'wylf'
}

//
exports.answerMessage = (msg,cb) => {
    var err = null;
    switch (msg.toLowerCase()) {
        case 'jgcx':        // Price query
            priceList.priceSummary((err,summary) => {
                cb(err,summary);
                // replyToXML(err,summary,res);
            });
            break;
        case 'wylf':
            cb(err,'正在测试。。。');
        default:
            var reply = '';
            for (var key in main) {
                if (main.hasOwnProperty(key)) {
                    reply += key+'请回复'+main[key]+'\n';
                }
            }
            cb(err,reply);
    }
};
