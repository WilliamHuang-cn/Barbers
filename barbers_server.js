var http = require('http');
var qs = require('querystring');
var api = require('./lib/weChatAPI');
var connect = require('connect');
var util = require('util');

api.getAccessToken((err,token) => {
    api.postMenu(token,'./public/CustomMenu.json',(err) => {
    if (err != null) {
        console.log('Error posting menu: '+err);
    }});
});

// var server = http.createServer((req,res) => {
//     // var url = qs.parse(req.url);
//     // console.log(url);
//
//     var body = '';
//     req.on('data', (chunck) => {
//         body += chunck;
//     });
//     req.on('end', () => {
//       var parseString = require("xml2js").parseString;
//       parseString(body, function (err, data) {
//         if(!err){
//           console.log(data);
//           if (data == null || data.xml == undefined) {
//               return;
//           }
//           data = data.xml;              // Remove xml layer
//           switch (data.MsgType[0]) {
//               case 'event':
//                 //   console.log('An event is received;');
//                   switch (data.Event[0]) {
//                       case 'CLICK':
//                           clickEventHandler(data,res);
//                           break;
//                       default:
//                       res.end('success');
//                   }
//                   break;
//               case 'text':
//                   console.log('A text is received.');
//                   res.end('success');
//                   break;
//               default:
//                   console.log('Unknown type received: '+data.xml.MsgType[0]);
//                   res.end('success');
//           }
//         }
//       });
//     });
// });

var server = connect();
server.use((req,res,next) => {
    console.log('%s %s', req.method, req.url);
    // console.log(req.headers)
    next();
});
var bodyParser = require('body-parser');
server.use(bodyParser.text({'type':'text/*'}));
// Deal with WeChat message/event call
server.use((req,res,next) => {
    if (req.method == 'post' && req.url == '/' && req.headers['content-type'] == 'text/xml') {
        var parseString = require("xml2js").parseString;
        parseString(body, function (err, data) {
            if(!err){
                console.log(data);
            if (data == null || data.xml == undefined) {
                return;
            }
              data = data.xml;              // Remove xml layer
              switch (data.MsgType[0]) {
                  case 'event':
                    //   console.log('An event is received;');
                      switch (data.Event[0]) {
                          case 'CLICK':
                              clickEventHandler(data,res);
                              break;
                          default:
                          res.end('success');
                      }
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
    }
});

// Deal with web service
server.use('/add_to_queue',(req,res,next) => {
    if (req.method == 'post' && req.body != null) {

    }
});

server.use((req,res,next) => {
    console.log(req.body);
});

server.listen(80, () => {
    console.log('Server running on port 80.');
});

function clickEventHandler(data,res) {
    switch (data.EventKey[0]) {
        case 'V1001_QUEUE_QUERY':
            const customerCount = 3;
            const waitingTime = 5
            const reply = '在您之前有'+customerCount+'人，预计等待时间约'+waitingTime+'分钟';
            res.end('<xml>'+
            '<ToUserName><![CDATA['+data.FromUserName+']]></ToUserName>'+
            '<FromUserName><![CDATA['+data.ToUserName+']]></FromUserName>'+
            '<CreateTime>1348831860</CreateTime>'+
            '<MsgType><![CDATA[text]]></MsgType>'+
            '<Content><![CDATA['+reply+']]></Content>'+
            '</xml>');
            break;
        default:
            res.end('success');
    }
}
