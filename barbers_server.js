var http = require('http');
var qs = require('querystring');

var server = http.createServer((req,res) => {
    var url = qs.parse(req.url);
    console.log(url);

    var body = '';
    req.on('data', (chunck) => {
        body += chunck;
    });
    req.on('end', () => {
      var parseString = require("xml2js").parseString;
      parseString(body, function (err, data) {
        if(!err){
          console.log(data)
          res.end("success");
        }
      });
    });
});

server.listen(80, () => {
    console.log('Server running on port 80.');
});

var queue = [];
