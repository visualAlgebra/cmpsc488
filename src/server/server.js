var fs = require("fs");
var http = require("http");
var url = require("url");
var events = require("events");


class Server {
    constructor() {
        let DB = require('../db/database.js');
        this.database = new DB();

        // //setting up event emitter for callbacks
        // this.eventEmitter = new events.EventEmitter();
        // this.eventEmitter.addListener("database file recieved", this.sendDatabaseFile);

	    this.accessibleFolders = ["/src/site/assets/", "/src/site/css/","/src/site/js/", "/node_modules/"]; //filepath from default directory of folders that are accessible for requests
        this.accessibleHTMLFiles = ["/index.html", "/Explorer.html", "/About_Contact_Us.html", "/creator.html","/LessonPage.html", "/manipulator.html", "/user_profile_page.html"];
        this.databaseActions = ["/src/db/problems&lessons/"];
    }

    //returns true is filePath is an html file we allow to be found
    isAccessibleHTMLFile(filePath) {
        for (var i = 0; i < this.accessibleHTMLFiles.length; i++) {
		    if (filePath === this.accessibleHTMLFiles[i] ) {
			    return true;
		    }
	    }
	return false;
    }

    // sendDatabaseFile() {
    //     console.log("========== SENT =========");
    // }


    //returns true if filePath is accessible (ie its in a folder that is set up in accessibleFolders array)
    isAccessibleFolder(filePath) {
	
        for (var i = 0; i < this.accessibleFolders.length; i++) {
	        if (filePath.startsWith(this.accessibleFolders[i])) {
		    //check for .. so file cannot back up (security)
	        	if (!filePath.includes("..")) {
		            console.log(filePath + " allowed");
		            return true;
	    	    }
                
	        }
	    }
	    console.log(filePath + " FAILED");
        return false;
    }
    

    //creates a server session that listens on port 8080 of localhost
    listen() {
        //so can call methods inside other function
        var self = this;
        http.createServer(function (request, response) {
            let sentUrl = url.parse(request.url, true);

            //determine action required
            if (sentUrl.pathname.startsWith(self.databaseActions[0])) { //get request for problem
                self.sendProblem(sentUrl.pathname, response);
            } else {
                self.sendPage(sentUrl.pathname, response);
            }

        }).listen(8080);
    }


    //function that will send requested problem back as a response
    sendProblem(pathName, serverResponse) {
        //remove starting part of pathname to get problem id
        let problemID = pathName.substr(this.databaseActions[0].length)
        this.database.getProblemOrLesson(problemID, serverResponse);
    }
    
    
    //function that sends page back as response
    sendPage(pageName, res) {
        let filename;
        if (pageName == "/") {
            filename = "./src/site/index.html";
	    } else if (this.isAccessibleFolder(pageName)) {
            filename = pageName.substr(1);
	    } else if (this.isAccessibleHTMLFile(pageName)) {
	        filename = "src/site" + pageName; 
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'})
            res.write("Error 404: File not found");
            return res.end();
	    }
	

        //determine Content-type
        var contentType = "text/html";
        if (filename.substr(-3) === "css") {
            contentType = 'text/css';
        } else if (filename.substr(-2) === "js") {
                contentType = "application/javascript";
        } else if (filename.substr(-3) === "png") {
                contentType = "image/png";
        }
	
	    console.log(contentType);

        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.write("Error 404: File not found");
                return res.end();
            }
            else {
                res.writeHead(200, {'Content-Type': contentType});
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



// ============================
//      Testing
// ============================

var server = new Server();
server.listen();
test();

function test() {

    let filename = "src/site/index.html";
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
