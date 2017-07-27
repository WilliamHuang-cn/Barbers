var http = require('http');
var qs = require('querystring');
var api = require('./lib/weChatAPI');
var connect = require('connect');
var util = require('util');
var queue = require('./lib/barberQueue');
var am = require('./lib/answeringMachine');
var express = require('express');
var app = express();

api.getAccessToken((err,token) => {
    api.postMenu(token,'./public/CustomMenu.json',(err) => {
    if (err != null) {
        console.log('Error posting menu: '+err);
    }});
});

// var server = connect();
var server = http.createServer(app);

app.use((req,res,next) => {
    console.log('%s %s', req.method, req.url+'\n');
    console.log(req.headers);
    next();
});

app.use(express.static(__dirname + '/public/'));


app.get('/register',(req,res,next) => {
    var options = {
        root: __dirname + '/public/',
        dotfiles: 'deny'
      };

    res.sendFile('register.html', options, function (err) {
        if (err) {
        //   next(err);
            console.log(err);
        }
    });
});

var bodyParser = require('body-parser');

app.use('/register',bodyParser.urlencoded());
app.use('/register',(req,res,next) => {
    console.log(req.body);
    console.log('\n');
    next();
});

app.post('/register',(req,res,next) => {
    if (req.method == 'POST' && req.body != null) {
        api.getAccessToken((err,token) => {
            console.log(tempID);
            api.fetchUserInfo(token,'',tempID,(err,data) => {
                if (err != null || data == null || data == undefined) {
                    console.log('Error feteching user info: '+err);
                }
                else {
                    queue.addCustomerToQueue({
                        // 'nickname':data.nickname,
                        'openid':data.openid,
                        'serviceType':req.body.serviceType,
                        // 'estimatedTime':50
                    },(err)=>{
                        console.log(err);
                    });
                }
                res.end();
                next();
            });
        });
    }
    else next();
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
    console.log('\n');
    next();
});

// Deal with WeChat message/event call
app.post('/', (req,res,next) => {
    // if (req.method == 'POST' && req.url == '/' && req.headers['content-type'] == 'text/xml') {
    if (req.method == 'POST' && req.headers['content-type'] == 'text/xml') {

        var parseString = require("xml2js").parseString;
        parseString(req.body, function (err, data) {
            if(!err){
            if (data == null || data.xml == undefined) {
                return;
            }
              data = data.xml;              // Remove xml layer
              switch (data.MsgType[0]) {
                  case 'event':
                      eventSwitch(data,res);
                      break;
                  case 'text':
                      console.log('A text is received.');
                      textHandler(data,res);
                      break;
                  default:
                      console.log('Unknown type received: '+data.MsgType[0]);
                      textHandler(data,res);
                    //   res.end('success');
              }
            }
        });
    }
    // else {
    //     next();
    // }
});

server.listen(80, () => {
    console.log('Server running on port 80.');
});

// Handle socket.io connections from register page
var socketServer = require('./lib/socket_server');
socketServer.listen(server,queue);

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
            queue.numberOfCustomersInQueue((err,number) => {
                queue.totalEstimatedTime((err,waitingTime) => {
                const reply = '在您之前有'+number+'人，预计等待时间约'+waitingTime+'分钟';
                res.end('<xml>'+
                '<ToUserName><![CDATA['+data.FromUserName+']]></ToUserName>'+
                '<FromUserName><![CDATA['+data.ToUserName+']]></FromUserName>'+
                '<CreateTime><![CDATA['+data.CreateTime+']]></CreateTime>'+
                '<MsgType><![CDATA[text]]></MsgType>'+
                '<Content><![CDATA['+reply+']]></Content>'+
                '</xml>');
                });
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
                    '<Description><![CDATA[阿斯顿发送到发送到发送到发送短发]]></Description>'+
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
    // tempID = data.FromUserName[0];
    res.end();
}

function textHandler(data,res) {
    am.answerMessage(data,(err,reply) => {
        if (err != null) {
            console.log(err);
            res.end('success');
        }
        else {
            res.end('<xml>'+
            '<ToUserName><![CDATA['+data.FromUserName+']]></ToUserName>'+
            '<FromUserName><![CDATA['+data.ToUserName+']]></FromUserName>'+
            '<CreateTime><![CDATA['+data.CreateTime+']]></CreateTime>'+
            '<MsgType><![CDATA[text]]></MsgType>'+
            '<Content><![CDATA['+reply+']]></Content>'+
            '</xml>');
        }
    });
}
