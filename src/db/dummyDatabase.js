const Database = require('./database.js');


//returns preset files rather than ones from actual database
class DummyDatabase extends Database {
    constructor() {
        super();
        this.session = require('fs');
    }

    getCurrentTimeStamp() {
        return "2012-12-12T10:10:10";
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
        let filename = "src/db/dbfiles/accounts/" + accountID + ".json";
        this.session.readFile(filename, function (err, data) {
            if (err) {
                return server.respondWithError(serverResponse, 404, "Error 404: File Not Found");
            }
            else {
                return server.respondWithData(serverResponse, 200, 'application/json', data.toString());
            }
        });
    }

    queryProblems(server, response, query) {
            query.number = parseInt(query.number);
        if (query.number === undefined || query.sort === undefined || typeof(query.number) != typeof(0)) {
		return server.respondWithError(response, 400, "Error 400: Query not supported");
        } else if (query.number <= 0 || query.number > 100 || query.sort !== "timeCreated") {
                return server.respondWithError(response, 400, "Error 400: Query not supported");
        } else {
                let fileName = "src/db/dbfiles/queries/TEST_QUERY_3.json"
                this.session.readFile(fileName, function (err, data) {
                    if (err) {
                        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
                    } else {
                        let queryResult = JSON.parse(data);
                        let obj = {};
                        obj.queryResults = queryResult.results.splice(0,query.number);
                        return server.respondWithData(response, 200, 'application/json', JSON.stringify(obj));
                    }
                });
        }
    }

    queryLessons(server, response, query) {
            query.number = parseInt(query.number);
        if (query.number === undefined || query.sort === undefined || typeof(query.number) != typeof(0)) {
                return server.respondWithError(response, 400, "Error 400: Query not supported");
        } else if (query.number <= 0 || query.number > 100 || query.sort !== "timeCreated") {
                return server.respondWithError(response, 400, "Error 400: Query not supported");
        } else {
                let fileName = "src/db/dbfiles/queries/TEST_QUERY_2.json"
                this.session.readFile(fileName, function (err, data) {
                    if (err) {
                        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
                    } else {
                        let queryResult = JSON.parse(data);
                        let obj = {};
                        obj.queryResults = queryResult.results.splice(0,query.number);
                        return server.respondWithData(response, 200, 'application/json', JSON.stringify(obj));
                    }
                });
        }
    }


    saveProblem(server, response, accountID, problem, enteredName) {
        let fileName = "";
        let usedName;
        problem.timeCreated = this.getCurrentTimeStamp();
        if (enteredName === "") {
            fileName = "src/db/dbfiles/problems/TEST_PROBLEM_0.json";
            usedName = "TEST_PROBLEM_0";
        } else {
            if (accountID === undefined) {
                return server.respondWithError(response, 401, "Error 401: No Authorization Provided");
            }
            fileName = "src/db/dbfiles/problems/" + enteredName + ".json";
            usedName = enteredName;
            problem.creatorAccountID = accountID;

        }
	    problem.problemID = usedName;
        this.session.writeFile(fileName, JSON.stringify(problem), function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 500: Internal Server Error");
            } else {
                return server.respondWithData(response, 201, 'text/plain', 'localhost:8080/problems/' + usedName);
            }
        });
    }

    saveLesson(server, response, accountID, lesson, enteredName) {
        let fileName = "";
        if (accountID === undefined) {
            return server.respondWithError(response, 401, "Error 401: No Authorization Provided");
        }
        lesson.creatorAccountID = accountID;
        lesson.timeCreated = this.getCurrentTimeStamp();
        lesson.lessonID = enteredName;

        if (enteredName === "") {
            fileName = "src/db/dbfiles/lessons/TEST_LESSON_0.json";
        } else {
            fileName = "src/db/dbfiles/lessons/" + enteredName + ".json";
        }
        this.session.writeFile(fileName, JSON.stringify(lesson), function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 500: Internal Server Error");
            } else {
                return server.respondWithData(response, 201, 'text/plain', 'localhost:8080/lessons/' + enteredName);
            }
        });
    }

    addAccount(server, response, account, accountID) {
        if (accountID === undefined) {
            return server.respondWithError(response, 401, "Error 401: No Authorization Provided");
        }
        account.accountID = accountID;
        account.timeCreated = this.getCurrentTimeStamp();
        let fileName = "src/db/dbfiles/accounts/" + accountID + ".json";

            this.session.writeFile(fileName, JSON.stringify(account), function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 500: Internal Server Error");
            } else {
                return server.respondWithData(response, 201, 'text/plain', 'Added Account Successfully');
            }
        });
    }

    unlinkFile(server, response, fileName, id) {
        this.session.unlink(fileName, function(err) {
            if(err) {
                return server.respondWithError(response, 500, "Error 400: Bad Request");
            } else {
                return server.respondWithData(response, 200, 'text/plain', id + " Deleted.");
            }
        });
    }

    deleteProblem(server, response, accountID, problemID) {
        let self = this;
        if (accountID === undefined) {
            return server.respondWithError(response, 401, "Error 401: No Authorization Provided");
        }
        let fileName = "src/db/dbfiles/problems/" + problemID + ".json";
        this.session.readFile(fileName, function (err, data) {
            if (err) {
                return server.respondWithError(response, 404, "Error 404: File Not Found");
            }
            else {
                let problem;
                try{
                problem = JSON.parse(data);
                } catch (error) {
                   return self.unlinkFile(server, response, fileName, problemID);
                }
                if (problem.creatorAccountID === accountID) {
                    return self.unlinkFile(server, response, fileName, problemID);
                } else {
                    return server.respondWithError(response, 401, "Error 401: Can only be deleted by creator");
                }

            }
        });
    }

    deleteLesson(server, response, accountID, lessonID) {
        let self = this;
        if (accountID === undefined) {
            return server.respondWithError(response, 401, "Error 401: No Authorization Provided");
        }
        let fileName = "src/db/dbfiles/lessons/" + lessonID + ".json";
        this.session.readFile(fileName, function (err, data) {
            if (err) {
                console.log("failed to find lesson @:" + fileName);
                return server.respondWithError(response, 404, "Error 404: File Not Found");
            }
            else {
                let lesson;
                try{
                lesson = JSON.parse(data);
                } catch (error) {
                   return self.unlinkFile(server, response, fileName, lessonID);
                }
                if (lesson.creatorAccountID === accountID) {
                    return self.unlinkFile(server, response, fileName, lessonID);
                } else {
                    return server.respondWithError(response, 401, "Error 401: Can only be deleted by creator");
                }

            }
        });
    }

    deleteAccount(server, response, accountToDelete, accountID) {
        if(accountID === undefined) {
            return server.respondWithError(response, 401, "Error 401: No Authorization Provided");
        }
        if(accountID === accountToDelete) {
            let fileName = "src/db/dbfiles/accounts/" + accountToDelete + ".json";
            return this.unlinkFile(server, response, fileName, accountID);
        } else {
            return server.respondWithError(response, 401, "Error 401: Can only be deleted by creator");
        }
    }

}

module.exports = DummyDatabase;

