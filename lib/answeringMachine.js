var serviceList = require('./serviceList');
var queue = require('./barberQueue');

const main = {
    'jgcx':'查询价格',
    'wylf':'排队理发'
}

const secondary = { // User loclization to replace this list
    'jj':'精剪',
    'xc':'洗吹',
    'jc':'剪吹',
    'xj':'洗剪',
    'xjc':'洗剪吹',
    'dj':'单剪',
    'dx':'单洗',
    'xm':'修眉',
    'cj':'彩焗',
    'tf':'烫发'
}

const ref = {
    'jj':'fine_cut',
    'xc':'blow_dry',
    'jc':'cut',
    'xj':'wash',
    'xjc':'wash',
    'dj':'cut',
    'dx':'wash',
    'xm':'eyebrow_shaping',
    'cj':'hair_dyeing',
    'tf':'perm'
}

//
exports.answerMessage = (data,cb) => {
    var err = null;
    var msg = '';
    if (data.Content != undefined) msg = data.Content[0].toLowerCase();
    switch (msg) {
        case 'jgcx':        // Price query
            serviceList.priceSummary((err,summary) => {
                cb(err,summary);
                // replyToXML(err,summary,res);
            });
            break;
        case 'wylf':
            var reply = '';
            for (var key in secondary) {
                if (secondary.hasOwnProperty(key)) {
                    reply += secondary[key]+'请回复'+key+'\n';
                }
            }
            cb(err,reply);
            break;
        case 'lkdl':
            queue.removeCustomerFromQueue((err) => {
                if (err == null) {
                    cb(null,'您已从队伍中移除。');
                }
                else {
                    cb(null,'您无法从队伍中移除。');
                }
            });
            break;
        default:
            if (secondary.hasOwnProperty(msg)) {
                queue.addCustomerToQueue({
                    'openid':data.FromUserName[0],
                    'serviceType':ref[msg]
                },(err) => {
                    if (err != null && err.message.includes('openID already exist')) {
                        cb(null,'您已经在对列中。回复lkdl离开队列');
                    }
                    else {
                        cb(null,'您以及成功加入队列。项目：'+secondary[msg]);
                    }
                });
            } else {
                var reply = '';
                for (var key in main) {
                    if (main.hasOwnProperty(key)) {
                        reply += main[key]+'请回复'+key+'\n';
                    }
                }
                cb(err,reply);
            }
    }
};
