var serviceList = require('./service_list');
// var queue = require('./barber_queue');
var queue;

const remoteHost = 'http://www.wtmoose.com';
const main = {
    'jgcx':'价格查询',
    'dwcx':'队伍查询',
    'wylf':'排队理发'
}

// TODO: User localization to replace this list
var secondaryRef = null;
var secondary = null;
var ref = null;

function setSecondaryRef(inSecondaryRef) {
    secondaryRef = secondaryRef || inSecondaryRef;
    secondary = secondary || secondaryRef.secondary;
    ref = ref || secondaryRef.ref;
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

exports.answerMessage = (data,inqueue,secondaryRef,cb) => {
    setSecondaryRef(secondaryRef);
    queue = inqueue;
    var err = null;
    var msg = '';
    var customer = null;
    var reply = '';
    if (data.Content != undefined) msg = data.Content[0].toLowerCase();
    switch (msg) {
        case 'jgcx':        // Price query
            serviceList.priceSummary((err,summary) => {
                cb(err,constructTextReply(data,summary));
            });
            break;
        case 'wylf':
            reply = constructArticle(data,'我要理发！💈','点击进入进行排队',`/register?openid=${data.FromUserName[0]}`);
            cb(err,reply);
            break;
        case 'lkdl':
            queue.removeCustomerFromQueue({'openid':data.FromUserName[0]},(err) => {
                if (err == null) {
                    reply = '您已从队伍中移除。';
                }
                else {
                    console.log(err);
                    reply = '您无法从队伍中移除。原因：'+err.message;
                }
                cb(err,constructTextReply(data,reply));
            });
            break;
        case 'dwcx':
            queue.totalEstimatedTime({openid:data.FromUserName[0]},(err,totalInfo) => {
                reply = '在您之前有'+totalInfo.totalCustomer+'人，预计等待时间约'+totalInfo.totalETime+'分钟';
                cb(err,constructTextReply(data,reply));
            });
            break;
        default:
            queue.hasCustomer({openid:data.FromUserName[0]},(err,cus) => {
                if (!err) {
                    reply = `您已经在队伍中。项目：${cus.serviceName}。\n回复lkdl离开队列\n回复dwcx查询队列`;
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
                cb(err,constructTextReply(data,reply));
            });
    }
};
