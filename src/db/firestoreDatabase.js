const Database = require('./database.js');

class FirestoreDatabase extends Database {
    constructor() {
        super();
        this.admin = require("firebase-admin");
        this.serviceAccount = require("./vatest-83fa4-firebase-adminsdk-kvm0g-7c0191ca53.json");
        this.admin.initializeApp({
            credential: this.admin.credential.cert(this.serviceAccount),
            databaseURL: 'https://vatest-83fa4.firebaseio.com'
        });
        this.session = this.admin.firestore();

        
        

    }

    getProblem(server, serverResponse, link) {
        let problemReference = this.session.collection('problems').doc(link);
        let problemQuery = problemReference.get()
            .then(doc => {
                if (!doc.exists) {
                    server.respondWithError(serverResponse, 404, "Problem not found");
                } else {
                    let problem = doc.data();
                    problem.timeCreated = problem.timeCreated._seconds;
                    server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(problem));
                }
            })
            .catch(err => {
                console.log("Error getting file from database: ", err);
                server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
            });
    }

    getLesson(server, serverResponse, link) {
        let lessonReference = this.session.collection('lessons').doc(link);
        let lessonQuery = lessonReference.get()
            .then(doc => {
                if (!doc.exists) {
                    server.respondWithError(serverResponse, 404, "Problem not found");
                } else {
                    let lesson = doc.data();
                    lesson.timeCreated = lesson.timeCreated._seconds;
                    server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(lesson));
                }
            })
            .catch(err => {
                console.log("Error getting file from database: ", err);
                server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
            });
    }

    getAccount(server, serverResponse, accountID) {
        let accountReference = this.session.collection('accounts').doc(accountID);
        let accountQuery = accountReference.get()
            .then(doc => {
                if (!doc.exists) {
                    server.respondWithError(serverResponse, 404, "Problem not found");
                } else {
                    let account = doc.data();
                    account.timeCreated = lesson.timeCreated._seconds;
                    server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(account));
                }
            })
            .catch(err => {
                console.log("Error getting file from database: ", err);
                server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
            });
    }




}

module.exports = FirestoreDatabase;
