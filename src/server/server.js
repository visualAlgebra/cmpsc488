const fs = require("fs");
const http = require("http");
const url = require("url");
const maxPostSize = 1e6 //1MB
const qs = require("querystring");
const path = require("path");



class Server {
    constructor() {
        let DB = require('../db/database.js');
        this.database = new DB();

        // //setting up event emitter for callbacks
        // this.eventEmitter = new events.EventEmitter();
        // this.eventEmitter.addListener("database file recieved", this.sendDatabaseFile);

	    this.accessibleFolders = ["/src/site/assets/", "/src/site/css/","/src/site/js/", "/node_modules/"]; //filepath from default directory of folders that are accessible for requests
        this.accessibleHTMLFiles = ["/index.html", "/Explorer.html", "/About_Contact_Us.html", "/creator.html","/LessonPage.html", "/manipulator.html", "/user_profile_page.html"];
        this.databaseActions = ["/problems/", "/lessons/", "/accounts/"];
    }
    

    //returns true is filePath is an html file we allow to be found
    isAccessibleHTMLFile(filePath) {
        for (var i = 0; i < this.accessibleHTMLFiles.length; i++) {
		    if (filePath === this.accessibleHTMLFiles[i]) {
			    return true;
		    }
	    }
	return false;
    }

    mapToHTMLFile(filePath) {
	    for (var i = 0; i < this.accessibleHTMLFiles.length; i++) {
		    let file = this.accessibleHTMLFiles[i];
		    if (filePath.startsWith(file.substr(0, file.length - 5) + '/')) {
			    return file;
		    }
	    }
	    return null; 
    }


    //returns true if filePath is accessible (ie its in a folder that is set up in accessibleFolders array)
    isAccessibleFolder(filePath) {
        for (var i = 0; i < this.accessibleFolders.length; i++) {
	        if (filePath.startsWith(this.accessibleFolders[i])) {
		    //check for .. so file cannot back up (security)
	        	if (!filePath.includes("..")) {
		            return true;
	    	    }
                
	        }
	    }
	    console.log(filePath + " FAILED");
        return false;
    }

    //PROTOTYPE METHODS!!
    //returns accountID right now, but will need more added once Google Sign-in implemented
    authenticatedUser(account) {
	    return account;
    }
    getSentAccountID(request) {
        return request.headers.account;
    }

    removeExtraPaths(pathname) { //deprecated
	    let newName = pathname;
		let srcIndex = pathname.indexOf('/src/');
		if (srcIndex != -1) {
			newName = pathname.substring(srcIndex);
		}
		let nodeModIndex = pathname.indexOf('/node_modules/');
		if (nodeModIndex != -1) {
			newName = pathname.substr(nodeModIndex);
		}
	    return newName
    }

    static problemIsValid(problem) {
        if (problem.startExpression === undefined || problem.goalExpression === undefined) {
            return false;
        } else if (typeof(problem.startExpression) != typeof("") || typeof(problem.goalExpression) != typeof("")) {
            return false;
        } else {
            return true;
            
        }
    }

    static getSentProblemName(pathname) {
        return path.basename(pathname);
    }
    
    

    //creates a server session that listens on port 8080 of localhost
    listen() {
        //so can call methods inside other function
        var self = this; //so can call inside callback function
        http.createServer(function (request, response) {
            let sentUrl = url.parse(request.url, true);
            let method = request.method;
		    console.log("Request Recieved: " + method + ": " + sentUrl.pathname);


            //determine action required
            if (method == "GET") {
		        //sentUrl.pathname = removeExtraPaths(sentUrl.pathname);
                if (sentUrl.pathname.startsWith(self.databaseActions[0])) { //GET request for problem
                    self.getProblem(sentUrl.pathname, response);
                } else if (sentUrl.pathname.startsWith(self.databaseActions[1])) { //GET request for Lesson
                    self.getLesson(sentUrl.pathname, response);
                } else if (sentUrl.pathname.startsWith(self.databaseActions[2])) { //GET request for an account
                    self.getAccount(sentUrl.pathname, response);
                } else { //GET request for a webpage
                    self.getPage(sentUrl.pathname, response);
                }

            } else if (method == "POST") {
                let body = "";

                request.on('data', function (data) { //event listener for data received from POST request
                    body += data;
                    if (body.length > maxPostSize) { //stops outside from sending enormous file and crashing server
                        request.connection.destroy();
                    }
                });
                
                request.on('end', function () { //event listener for when data finished coming from POST request
                    let jsonData;
                    try {
                        jsonData = JSON.parse(body);
                    } catch(error) {
                        return self.respondWithError(response, 400, "Error 400: JSON POST data has bad syntax");
                    }
                    let accountID = self.authenticatedUser(self.getSentAccountID(request));

                    if (sentUrl.pathname.startsWith(self.databaseActions[0])) { //POST request for problem
                        self.saveProblem(sentUrl.pathname, response, jsonData, accountID);
                    } else if (sentUrl.pathname.startsWith(self.databaseActions[1])) { //POST request for Lesson
                        self.saveLesson(sentUrl.pathname, response, jsonData, accountID);
                    } else if (sentUrl.pathname.startsWith(self.databaseActions[2])) { //POST request for account
                        self.saveAccount(sentUrl.pathname, response, request);
                    } else {
                        return self.respondWithError(response, 400, "Error 400: Bad Request");
                    }
                });

            } else if (method == "DELETE") {
                if (sentUrl.pathname.startsWith(self.databaseActions[0])) { //DELETE request for problem
                    self.deleteProblem(sentUrl.pathname, response);
                } else if (sentUrl.pathname.startsWith(self.databaseActions[1])) { //DELETE request for Lesson
                    self.deleteLesson(sentUrl.pathname, response);
                } else if (sentUrl.pathname.startsWith(self.databaseActions[2])) { //DELETE request for account
                    self.deleteAccount(sentUrl.pathname, response);
                } else {
                    return self.respondWithError(response, 400, "Error 400: Bad Request");
                }
            } else { // we do not handle other methods 
                return self.respondWithError(response, 400, "Error 400: Bad Request");
            }


        }).listen(8080);
    }

    //==========================================================================
    //======================== Response Methods ================================
    //==========================================================================
    respondWithData(response, statusCode, mediaType, data) {
        // console.log(statusCode + " === " + mediaType + " === " + data);
        response.writeHead(statusCode, {'Content-Type': mediaType})
	   // if (mediaType === "application/json") {
		//    console.log(data);
	   // }
        response.write(data);
        return response.end();
    }

    respondWithError(response, errorCode, errorMessage) {
        // console.log(errorMessage);
        response.writeHead(errorCode, {'Content-Type': 'text/html'})
        response.write(errorMessage);
        return response.end();
    }


    //==========================================================================
    //========================= GET methods ====================================
    //==========================================================================

    //function that sends page back as response
    //pageName: string with file
    getPage(pageName, response) {
        let filename = "";
        if (pageName == "/") {
            filename = "./src/site/index.html";
	    } else if (this.isAccessibleFolder(pageName)) {
            filename = pageName.substr(1);
	    } else if (this.isAccessibleHTMLFile(pageName)) {
            filename = "src/site" + pageName; 
	    } else {
            let htmlFile = this.mapToHTMLFile(pageName);
		    if (htmlFile === null) {
                return this.respondWithError(response, 404, "Error 404: Page Not Found");
		    } else {
                filename = "src/site" + htmlFile;
		    }
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
        
        var self = this; //required for callback in readFile scope
        fs.readFile(filename, function (err, data) {
            if (err) {
                return self.respondWithError(response, 404, "Error 404: Page Not Found");
            }
            else {
                return self.respondWithData(response, 200, contentType, data);
            }
        });
        return 0;
    }
    

    //function that will send requested problem back as a response
    getProblem(pathName, serverResponse) {
        //remove starting part of pathname to get problem id
        let problemID = pathName.substr(this.databaseActions[0].length)
        this.database.getProblem(this, serverResponse, problemID);
    }
    
    getLesson(pathname, response) {
        let lessonID = pathname.substr(this.databaseActions[1].length);
	    return this.database.getLesson(this, response, lessonID);
    }
    
    getAccount(pathname, response) {
        let accountID = pathname.substr(this.databaseActions[2].length);
        return this.database.getAccount(this, response, accountID);
    }

    //==========================================================================
    //========================= POST methods ===================================
    //==========================================================================

    saveProblem(pathname, response, problem, accountID) {
        if (Server.problemIsValid(problem)) {
            let problemName = Server.getSentProblemName(pathname.substr(this.databaseActions[0].length));
            return this.database.saveProblem(this, response, accountID, problem, problemName);
        } else {
            return this.respondWithError(response, 400, "Error 400: Sent Problem is not Valid");
        }
    }


    saveLesson(pathname, response, lesson, accountID) {
        
    }


    saveAccount(accountID, response) {
        return response.end();
    }


    //==========================================================================
    //========================= DELETE methods =================================
    //==========================================================================

    deleteProblem(problemID, response) {
        return response.end();
    }


    deleteLesson(lessonID, response) {
        return response.end();
    }


    deleteAccount(accountID, response) {
        return response.end();
    }


}



// ============================
//      Testing
// ============================

var server = new Server();
server.listen();
test();
//testDatabase(server);

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

function testDatabase(server) {
    server.database.getProblem(server, null, "TEST_PROBLEM_1");
    server.database.getLesson(server, null, "TEST_LESSON_1");
    server.database.getAccount(server,null,"TEST_ACCOUNT_1");
    server.database.saveProblem(server, null, "TEST_ACCOUNT_1", '{"text": "TEST_PROBLEM_3"}', "TEST_PROBLEM_3");
    server.database.saveLesson(server, null, "TEST_ACCOUNT_1", '{"text": "TEST_LESSON_2"}', "TEST_LESSON_2");
    server.database.addAccount(server, null, '{"text": "TEST_LESSON_1"}', "TEST_ACCOUNT_2");
    server.database.deleteProblem(server, null, "TEST_ACCOUNT_1", "TEST_PROBLEM_1");
    server.database.deleteLesson(server, null, "TEST_ACCOUNT_1", "TEST_LESSON_1");
}
