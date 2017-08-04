var serviceList = require('./service_list');
// var queue = require('./barber_queue');
var queue;

const remoteHost = 'http://47.92.109.146';
const main = {
    'jgcx':'查询价格',
    'wylf':'排队理发'
}

// TODO: User localization to replace this list
const secondary = {
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

function constructTextReply(data,reply) {
    return '<xml>'+
    `<ToUserName><![CDATA[${data.FromUserName}]]></ToUserName>`+
    `<FromUserName><![CDATA[${data.ToUserName}]]></FromUserName>`+
    `<CreateTime><![CDATA[${data.CreateTime}]]></CreateTime>`+
    '<MsgType><![CDATA[text]]></MsgType>'+
    `<Content><![CDATA[${reply}]]></Content>`+
    '</xml>';
}

function constructArticle(data,title,description,relativeURL) {
    return '<xml>'+
    `<ToUserName><![CDATA[${data.FromUserName}]]></ToUserName>`+
    `<FromUserName><![CDATA[${data.ToUserName}]]></FromUserName>`+
    `<CreateTime><![CDATA[${data.CreateTime}]]></CreateTime>`+
    '<MsgType><![CDATA[news]]></MsgType>'+
    '<ArticleCount>1</ArticleCount>'+
    '<Articles>'+
        '<item>'+
            `<Title><![CDATA[${title}]]></Title>`+
            `<Description><![CDATA[${description}]]></Description>`+
            `<Url><![CDATA[${remoteHost}${relativeURL}]]></Url>`+
        '</item>'+
    '</Articles>'+
    '</xml>';
}

exports.answerMessage = (data,inqueue,cb) => {
    queue = inqueue;
    var err = null;
    var msg = '';
    var customer = null;
    if (data.Content != undefined) msg = data.Content[0].toLowerCase();
    switch (msg) {
        case 'jgcx':        // Price query
            serviceList.priceSummary((err,summary) => {
                cb(err,constructTextReply(summary));
            });
            break;
        case 'wylf':
            var reply = '';
            // for (var key in secondary) {
            //     if (secondary.hasOwnProperty(key)) {
            //         reply += secondary[key]+'请回复'+key+'\n';
            //     }
            // }
            reply = constructArticle(data,'我要理发！💈','点击进入进行排队',`/register?openid=${data.FromUserName[0]}`);
            cb(err,reply);
            break;
        case 'lkdl':
            queue.removeCustomerFromQueue({'openid':data.FromUserName[0]},(err) => {
                if (err == null) {
                    cb(null,'您已从队伍中移除。');
                }
                else {
                    console.error(err);
                    cb(null,'您无法从队伍中移除。原因：'+err.message);
                }
            });
            break;
        default:
            // if (secondary.hasOwnProperty(msg)) {
            //     queue.addCustomerToQueue({
            //         'openid':data.FromUserName[0],
            //         'serviceType':ref[msg]
            //     },(customer, err) => {
            //         if (err != null && err.message.includes('openid already exist')) {
            //             cb(null,'您已经在对列中。回复lkdl离开队列');
            //         }
            //         else {
            //             cb(null,'您已经成功加入队列。项目：'+secondary[msg]);
            //         }
            //     });
            queue.hasCustomer({openid:data.FromUserName[0]},(err,cus) => {
                var reply = '';
                if (!err) {
                    reply = `您已经在队伍中。项目：${result.serviceType}。回复lkdl离开队列`;
                } else {
                    if (err.message.match(/No customer found/)) {
                        err = null;
                        for (var key in main) {
                            if (main.hasOwnProperty(key)) {
                                reply += main[key]+'请回复'+key+'\n';
                            }
                        }
                    }
                }
                cb(err,constructTextReply(reply));
            });
    }
};
