

//abstract class
class Database {
    constructor(emitter) {
        this.session;
        this.eventEmitter = emitter;
    }
    getProblem(server, serverResponse, link) {
        return server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
    }
    getLesson(server, serverResponse, link) {
        return server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
    }
    getAccount(server, serverResponse, accountID) {
        return server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
    }
    saveProblem(server, response, accountID, problem, enteredName) {
        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    }
    saveLesson(server, response, accountID, lesson, enteredName) {
        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    }
    addAccount(server, response, account, accountID) {
        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    }
    deleteProblem(server, response, accountID, problemID) {
        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    }
    deleteLesson(server, response, accountID, lessonID) {
        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    }
}


//returns preset files rather than ones from actual database
class DummyDatabase extends Database {
    constructor() {
        super();
        this.session = require('fs');
    }

    getProblem(server, serverResponse, link) {
        let filename = "src/db/dbfiles/problems/" + link + ".json";
        this.session.readFile(filename, function (err, data) {
            if (err) {
                return server.respondWithError(serverResponse, 404, "Error 404: File Not Found");
            }
            else {
                return server.respondWithData(serverResponse, 200, 'application/json', data.toString());
            }
        });
    }


    getLesson(server, serverResponse, link) { 
        let filename = "src/db/dbfiles/lessons/" + link + ".json";
        this.session.readFile(filename, function (err, data) {
            if (err) {
                return server.respondWithError(serverResponse, 404, "Error 404: File Not Found");
            }
            else {
                return server.respondWithData(serverResponse, 200, 'application/json', data.toString());
            }
        });
    }

    getAccount(server, serverResponse, accountID) {
        let filename = "src/db/dbfiles/account/" + accountID + ".json";
        this.session.readFile(filename, function (err, data) {
            if (err) {
                return server.respondWithError(serverResponse, 404, "Error 404: File Not Found");
            }
            else {
                return server.respondWithData(serverResponse, 200, 'application/json', data.toString());
            }
        });
    }

    saveProblem(server, response, accountID, problem, enteredName) {
        let fileName = "";
        if (enteredName === null) {
            fileName = "src/db/dbfiles/problems/TEST_PROBLEM_0.json";
        } else {
            fileName = "src/db/dbfiles/problems/" + enteredName + ".json";
        }
        this.session.writeFile(fileName, problem, function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 500: Internal Server Error");
            } else {
                return server.respondWithData(response, 201, 'text/plain', 'localhost:8080/problems/' + enteredName);
            }
        }); 
    }

    saveLesson(server, response, accountID, lesson, enteredName) {
        let fileName = "";
        if (enteredName === null) {
            fileName = "src/db/dbfiles/lessons/TEST_LESSON_0.json";
        } else {
            fileName = "src/db/dbfiles/lessons/" + enteredName + ".json";
        }
        this.session.writeFile(fileName, lesson, function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 500: Internal Server Error");
            } else {
                return server.respondWithData(response, 201, 'text/plain', 'localhost:8080/lessons/' + enteredName);
            }
        }); 
    }

    addAccount(server, response, account, accountID) {
        let fileName = "src/db/dbfiles/accounts/" + accountID + ".json";
        this.session.writeFile(fileName, account, function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 500: Internal Server Error");
            } else {
                return server.respondWithData(response, 201, 'text/plain', 'Added Account Successfully');
            }
        }); 
    }

    deleteProblem(server, response, accountID, problemID) {
        let fileName = "src/db/dbfiles/problems/" + problemID + ".json";
        this.session.unlink(fileName, function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 400: Bad Request");
            } else {
                return server.respondWithData(response, 200, 'text/plain', problemID + " Deleted.");
            }
        }); 
    }

    deleteLesson(server, response, accountID, lessonID) {
        let fileName = "src/db/dbfiles/lessons/" + lessonID + ".json";
        this.session.unlink(fileName, function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 400: Bad Request");
            } else {
                return server.respondWithData(response, 200, 'text/plain', lessonID + " Deleted.");
            }
        });
    }

}

module.exports = DummyDatabase;
// let db = new DummyDatabase();