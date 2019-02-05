var fs = require("fs");
var http = require("http");
var url = require("url");


class Server {
    constructor() {
        this.database = null;
    }
    

    //creates a server session that listens on port 8080 of localhost
    listen() {
        //so can call methods inside other function
        var self = this;
        http.createServer(function (req, res) {
            let sentUrl = url.parse(req.url, true);
            self.sendPage(sentUrl.pathname, res);
        }).listen(8080);
    }


    //function that will send requested problem back as a response
    sendProblem(problemID) {
        return 0;
    }
    
    
    //function that sends page back as response
    sendPage(pageName, res) {
        let filename;
        if (pageName == "/") {
            filename = "../index.html";
        } else {
            filename = ".." + pageName;
        }
        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.write("Error 404: File not found");
                return res.end();
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
        return 0;
    }
    

    sendLesson(lessonID) {
        return 0;
    }

    sendMessage(message) {
        return 0;
    }

    sendAccount(accountID) {
        return 0;
    }

    sendURL(urlString) {
        return 0;
    }


}


var server = new Server();
server.listen();
test();

function test() {

    let filename = "../index.html";
    let file1 = fs.readFileSync(filename, 'utf-8');
    let resFile1 = "";
    http.get({hostname: 'localhost', port: 8080, path: '/', agent: false},
        function (res) {
        res.on("data", function(chunk) {
            resFile1 += chunk.toString();
        res.on("end", function() {
            if(file1 === resFile1) {
                console.log("--- Test 1 Passed. ---");
            } else {
                console.log("--- Test 1 Failed. ---");
            }
        })
        });
    });

}