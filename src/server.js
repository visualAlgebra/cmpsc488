var fs = require("fs");
var http = require("http");
var url = require("url");

http.createServer(function (req, res) {
    let sentUrl = url.parse(req.url, true);
    let filename;
    if (sentUrl.pathname == "/") {
        filename = "./index.html";
    } else {
        filename = "." + sentUrl.pathname;
    }
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'})
            return res.end("Error 404: File not found");
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        }
    })
    
}).listen(8080);