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
        console.log("==========================");
        console.log(link);
        var problemReference = this.session.collection('problems').doc(link);
        var problemQuery = problemReference.get()
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


}

module.exports = FirestoreDatabase;
