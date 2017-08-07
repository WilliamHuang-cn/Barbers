var http = require('http');
var qs = require('querystring');
var api = require('./lib/weChatAPI');
var connect = require('connect');
var util = require('util');
var queue = require('./lib/barber_queue');
var am = require('./lib/answeringMachine');
var express = require('express');
var app = express();
var userInfo = require('./lib/user_info');
var service_list = require('./lib/service_list');

var secondaryRef = null;
var serviceList = null;
var customerNum = 0;

// TODO: save access token for later use. Expires in 2 hours.
api.getAccessToken((err,token) => {
    api.postMenu(token,'./public/customer_menu.json',(err) => {
    if (err != null) {
        console.log('Error posting menu: '+err);
    }});
});

var server = http.createServer(app);
app.set('views',__dirname + '/public');

app.use((req,res,next) => {
    console.log('%s %s', '\n'+req.method, req.url+'\n');
    console.log(req.headers);
    secondaryRef = secondaryRef || service_list.getServiceListSecRef('zh_CN');
    serviceList = serviceList || secondaryRef.serviceList;
    next();
});

app.use(express.static(__dirname + '/public/'));

app.get('/register',(req,res,next) => {
    var id = req.query.openid;
    var monitor = req.query.monitoring;
    var redirection = '';
    var customer = {};
    if (monitor == 'yes') {
        redirection = './monitor';
        id = Date.now();
        customerNum ++;
        customer = {
            openid:id,
            name: '顾客' + customerNum,
            tel:'+86 (021) 1234-45678'
        };
    }
    userInfo.loadUserProfile(id,(err,Profile) => {
        if (!err) {
            customer = Profile;
        }
        queue.totalEstimatedTime({openid:id},(err,totalInfo) => {
            res.render('register.ejs', {openid:id,
                                        redirection:redirection,
                                        customer:customer,
                                        totalInfo:totalInfo,
                                        serviceList:serviceList
            });
        })
    });
});

var bodyParser = require('body-parser');

app.use('/register',bodyParser.urlencoded({extended: false}));
app.use('/register',(req,res,next) => {
    console.log(req.body);
    next();
});

app.get('/monitor',(req,res,next) => {
    var options = {
        root: __dirname + '/public/',
        dotfiles: 'deny'
    };

    res.sendFile('queue_monitor.html', options, function (err) {
        if (err) {
        //   next(err);
            console.log(err);
        }
    });
});

app.use('/',bodyParser.text({'type':'text/*'}));
app.use('/',(req,res,next) => {
    console.log(req.body);
    next();
});

// Deal with WeChat message/event call
app.post('/', (req,res,next) => {
    if (req.headers['content-type'] == 'text/xml') {
        var parseString = require("xml2js").parseString;
        parseString(req.body, function (err, data) {
            if(!err){
            if (data == null || data.xml == undefined) {
                console.log('parse post request xml body from WeChat error.');
                res.end('success');
                return;
            }
            data = data.xml;              // Remove xml layer
            switch (data.MsgType[0]) {
                case 'event':
                    console.log('A event (' + data.Event[0] + ':' + data.EventKey[0] + ') is received.');
                    eventSwitch(data,res);
                    break;
                case 'text':
                    console.log('A text is received.');
                    textHandler(data,res);
                    break;
                default:
                    console.log('Unknown type received: '+data.MsgType[0]);
                    textHandler(data,res);
            }
          }
        });
    }
});

server.listen(80, () => {
    console.log('Server running on port 80.');
});

// Handle socket.io connections from register page
var socketServer = require('./lib/socket_server');
socketServer.listen(server,queue,userInfo);

function eventSwitch(data,res) {
    switch (data.Event[0]) {
        case 'CLICK':
            clickEventHandler(data,res);
            break;
        case 'VIEW':
            viewEventHandler(data,res);
            break;
        default:
            res.end('success');
    }
}

function clickEventHandler(data,res) {
    switch (data.EventKey[0]) {
        case 'V1001_QUEUE_QUERY':
            queue.totalEstimatedTime({openid:data.FromUserName[0]},(err,totalInfo) => {
            const reply = '在您之前有'+totalInfo.totalCustomer+'人，预计等待时间约'+totalInfo.totalETime+'分钟';
            res.end('<xml>'+
            `<ToUserName><![CDATA[${data.FromUserName}]]></ToUserName>`+
            '<FromUserName><![CDATA['+data.ToUserName+']]></FromUserName>'+
            '<CreateTime><![CDATA['+data.CreateTime+']]></CreateTime>'+
            '<MsgType><![CDATA[text]]></MsgType>'+
            '<Content><![CDATA['+reply+']]></Content>'+
                '</xml>');
            });
            break;
        case 'V1001_QUEUE':
            res.end('<xml>'+
            '<ToUserName><![CDATA['+data.FromUserName+']]></ToUserName>'+
            '<FromUserName><![CDATA['+data.ToUserName+']]></FromUserName>'+
            '<CreateTime><![CDATA['+data.CreateTime+']]></CreateTime>'+
            '<MsgType><![CDATA[news]]></MsgType>'+
            '<ArticleCount>1</ArticleCount>'+
            '<Articles>'+
                '<item>'+
                    '<Title><![CDATA[点我理发！]]></Title>'+
                    '<Description><![CDATA[发送到发送短发]]></Description>'+
                    '<Url><![CDATA[http://47.92.109.146/register?openid='+data.FromUserName+']]></Url>'+
                '</item>'+
            '</Articles>'+
            '</xml>');
            break;
        case 'V1001_QUEUE_MONITOR':
            res.end('<xml>'+
            '<ToUserName><![CDATA['+data.FromUserName+']]></ToUserName>'+
            '<FromUserName><![CDATA['+data.ToUserName+']]></FromUserName>'+
            '<CreateTime><![CDATA['+data.CreateTime+']]></CreateTime>'+
            '<MsgType><![CDATA[news]]></MsgType>'+
            '<ArticleCount>1</ArticleCount>'+
            '<Articles>'+
                '<item>'+
                    '<Title><![CDATA[点我查看队列]]></Title>'+
                    '<Description><![CDATA[这里没有描述 :P]]></Description>'+
                    '<Url><![CDATA[http://47.92.109.146/monitor'+']]></Url>'+
                '</item>'+
            '</Articles>'+
            '</xml>');
            break;
        default:
            res.end('success');
    }
}

function viewEventHandler(data,res) {
    res.end('success');
}

function textHandler(data,res) {
    am.answerMessage(data,queue,secondaryRef,(err,reply) => {
        if (err != null) {
            console.log(err);
            res.end('success');
        }
        else {
            res.end(reply);
        }
    });
}
