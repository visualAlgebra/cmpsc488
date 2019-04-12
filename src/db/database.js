

//abstract class
class Database {
    constructor(domain) {
        this.session;
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
    deleteAccount(server, response, accountID) {
        return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    }
}

module.exports = Database;
// let db = new DummyDatabase();
