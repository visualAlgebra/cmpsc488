

//abstract class
class Database {
    constructor(emitter) {
        this.session;
        this.eventEmitter = emitter;
    }
    getProblemOrLesson(link, serverResponse) {
        return "error";
    }
    getAccount(accountID) {
        return "error";
    }
    saveProblem() {
        return "error";
    }
    saveLesson() {
        return -1;
    }
    addAccount() {
        return -1;
    }
    deleteProblemOrLesson() {
        return -1;
    }
}


//returns preset files rather than ones from actual database
class DummyDatabase extends Database {
    constructor() {
        super();
        this.session = require('fs');
    }

    // readFile(filename, serverResponse) {
    //     let fileData = "";
    //     fileData = this.session.readFile(filename, function (err,data) {
    //         if (err) {
    //             return "error";
    //         } else {
    //             return data.toString();
    //         }
    //     });
    //     return fileData;
    // }

    getProblemOrLesson(link, serverResponse) {
        let filename = "src/db/dbfiles/fakeLesson.txt";
        this.session.readFile(filename, function (err, data) {
            if (err) {
                serverResponse.writeHead(404, {'Content-Type': 'text/html'})
                serverResponse.write("Error 404: File not found");
                return serverResponse.end();
            }
            else {
                serverResponse.writeHead(200, {'Content-Type': 'application/json'})
                serverResponse.write(data.toString());
                return serverResponse.end();
            }
        });
    }

}

module.exports = DummyDatabase;
// let db = new DummyDatabase();
// console.log(db.getProblemOrLesson("src/site/index.html"));