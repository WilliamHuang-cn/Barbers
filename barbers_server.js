var http = require('http');
var qs = require('querystring');
var api = require('./lib/weChatAPI');
var connect = require('connect');
var util = require('util');
var queue = require('./lib/barberQueue');

api.getAccessToken((err,token) => {
    api.postMenu(token,'./public/CustomMenu.json',(err) => {
    if (err != null) {
        console.log('Error posting menu: '+err);
    }});
});

var server = connect();
server.use((req,res,next) => {
    console.log('%s %s', req.method, req.url+'\r\n');
    console.log(req.headers);
    next();
});
var bodyParser = require('body-parser');
server.use('/',bodyParser.text({'type':'text/*'}));

server.use('/',(req,res,next) => {
    console.log(req.body);
    next();
});

// Deal with WeChat message/event call
server.use('/', (req,res,next) => {
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
                      res.end('success');
                      break;
                  default:
                      console.log('Unknown type received: '+data.xml.MsgType[0]);
                      res.end('success');
              }
            }
        });
    }
    else {
        next();
    }
});

server.use('/add_to_queue',bodyParser.urlencoded());
server.use('/add_to_queue',(req,res,next) => {
    console.log(req.body);
    next();
});
// Deal with web service
server.use('/add_to_queue',(req,res,next) => {
    if (req.method == 'GET') {
        res.setHeader('content-type','text/html');
        var stream = require('fs').createReadStream('./public/register.html');
        stream.pipe(res);
        stream.on('error', (err) => console.log(err));
    }
    if (req.method == 'POST' && req.body != null) {
        console.log('Request for adding customer to queue. ');


        queue.addCustomerToQueue({},()=>{});
        res.end();
        next();
    }
});

server.use('/stylesheets',(req,res,next) => {
    var stream = require('fs').createReadStream('./public/stylesheets'+req.url);
    stream.pipe(res);
    stream.on('error', (err) => console.log(err));
});

server.listen(80, () => {
    console.log('Server running on port 80.');
});

function eventSwitch(data,res) {
    switch (data.Event[0]) {
        case 'CLICK':
            clickEventHandler(data,res);
            break;
        default:
        res.end('success');
    }
}

function clickEventHandler(data,res) {
    switch (data.EventKey[0]) {
        case 'V1001_QUEUE_QUERY':
            queue.numberOfCustomersInQueue((err,number) => {
                queue.estimatedTime(err,waitingTime);
                const reply = '在您之前有'+number+'人，预计等待时间约'+waitingTime+'分钟';
                res.end('<xml>'+
                '<ToUserName><![CDATA['+data.FromUserName+']]></ToUserName>'+
                '<FromUserName><![CDATA['+data.ToUserName+']]></FromUserName>'+
                '<CreateTime>1348831860</CreateTime>'+
                '<MsgType><![CDATA[text]]></MsgType>'+
                '<Content><![CDATA['+reply+']]></Content>'+
                '</xml>');
            });
            break;
        default:
            res.end('success');
    }
}
