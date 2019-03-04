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


  //takes an account object recieved from the firestore and makes calls to get the user's problems and lessons to put in "problems" and "lessons" tag respectively
  assembleAccount(account, serverResponse, successCallback, failureCallback) {
    let problemsQuery = this.session.collection('problems').where('creatorAccountID', '==', account.accountID);
    let lessonsQuery = this.session.collection('lessons').where('creatorAccountID', '==', account.accountID);
    let lessons = [];
    let problems = [];
    let lessonsFinished = false;
    let problemsFinished = false;

    problemsQuery.get()
      .then(snapshot => {
        if(!snapshot.empty) {
          snapshot.forEach(doc => {
            let problem = doc.data();
            problem.timeCreated = problem.timeCreated._seconds;
            problems.push(problem);
          });
        }
        account.problems = problems;
        if (lessonsFinished) {
          successCallback(serverResponse, 200, "application/json", JSON.stringify(account))
        } else {
          problemsFinished = true;
        }
      })
      .catch(err => {
        console.log(err);
        failureCallback(serverResponse, 500, "Error 500: Internal Server Error");
      });

    lessonsQuery.get()
      .then(snapshot => {
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            let lesson = doc.data();
            lesson.timeCreated = lesson.timeCreated._seconds;
            lessons.push(lesson);
          });
        }
        account.lessons = lessons;
        if (problemsFinished) {
          successCallback(serverResponse, 200, "application/json", JSON.stringify(account))
        } else {
          lessonsFinished = true;
        }
      })
      .catch(err => {
        console.log(err);
        failureCallback(serverResponse, 500, "Error 500: Internal Server Error");
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
          account.timeCreated = account.timeCreated._seconds;
          let lessons = [];
          let problems = [];

          this.assembleAccount(account, serverResponse, server.respondWithData, server.respondWithError);
        }
      })
      .catch(err => {
        console.log("Error getting file from database: ", err);
        server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
      });
  }




}

module.exports = FirestoreDatabase;
