var http = require('http');
var qs = require('querystring');
var api = require('./lib/weChatAPI');

api.getAccessToken((err,token) => {
    api.postMenu(token,'./public/menu.json',(err) => {
    if (err != null) {
        console.log('Error posting menu: '+err);
    }});
});

var server = http.createServer((req,res) => {
    // var url = qs.parse(req.url);
    // console.log(url);

    var body = '';
    req.on('data', (chunck) => {
        body += chunck;
    });
    req.on('end', () => {
      var parseString = require("xml2js").parseString;
      parseString(body, function (err, data) {
        if(!err){
          console.log(data)
          switch (data.xml.MsgType[0]) {
              case 'event':
                  console.log('An event is received;');

                  break;
              case 'text':
                  console.log('A text is received.');
                  break;
              default:
                  console.log('Unknown type received: '+data.xml.MsgType[0]);
          }

          res.end('success');
        }
      });
    });
});

server.listen(80, () => {
    console.log('Server running on port 80.');
});
