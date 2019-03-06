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
    this.ACCOUNT_BIO_CHARACTER_LIMIT = 1000; //?
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




  assembleLesson(lesson, serverResponse, successCallback, failureCallback) {
    let problemsQuery = this.session.collection('problems').where('ownerLessons', 'array-contains', lesson.lessonID);
    let lessonsQuery = this.session.collection('lessons').where('ownerLessons', 'array-contains', lesson.lessonID);
    let creations = lesson.creations;
    let lessonsFinished = false;
    let problemsFinished = false;


    problemsQuery.get()
      .then(snapshot => {
        if(!snapshot.empty) {
          snapshot.forEach(doc => {
            let problem = doc.data();
            problem.timeCreated = problem.timeCreated._seconds;
            let index = creations.findIndex( element => {
              return element === problem.problemID;
            })
            creations[index] = problem;
          });
        }
        if (lessonsFinished) {
          lesson.creations = creations;
          successCallback(serverResponse, 200, "application/json", JSON.stringify(lesson))
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
        if(!snapshot.empty) {
          snapshot.forEach(doc => {
            let newLesson = doc.data();
            newLesson.timeCreated = newLesson.timeCreated._seconds;
            let index = creations.findIndex( element => {
              return element === newLesson.lessonID;
            })
            creations[index] = newLesson;
          });
        }
        if (problemsFinished) {
          lesson.creations = creations;
          successCallback(serverResponse, 200, "application/json", JSON.stringify(lesson))
        } else {
          lessonsFinished = true;
        }
      })
      .catch(err => {
        console.log(err);
        failureCallback(serverResponse, 500, "Error 500: Internal Server Error");
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
          this.assembleLesson(lesson, serverResponse, server.respondWithData, server.respondWithError);
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


  queryProblems(server, response, query) {
    query.number = parseInt(query.number);
    if (query.number === undefined || query.sort === undefined || typeof (query.number) != typeof (0)) {
      return server.respondWithError(response, 400, "Error 400: Query not supported");
    } else if (query.number <= 0 || query.number > 100 || query.sort !== "timeCreated") {
      return server.respondWithError(response, 400, "Error 400: Query not supported");
    } else {
      let queryResponse = [];
      let firebaseQuery = this.session.collection('problems').orderBy('timeCreated').limit(query.number);
      firebaseQuery.get()
      .then( snapshot => {
        if(!snapshot.empty) {
          snapshot.forEach(doc => {
            let problem = doc.data();
            problem.timeCreated = problem.timeCreated._seconds;
            queryResponse.push(problem);
          });
        }
        server.respondWithData(response, 200, 'application/json', JSON.stringify({'results': queryResponse}));
      })
      .catch( error => {
        console.log("Error with querying problems: ==========");
        console.log(error);
        console.log("=======end of error========");
        server.respondWithError(response, 500, "Error 500: Internal database error with query");
      });
    }
  }


  queryLessons(server, response, query) {
    query.number = parseInt(query.number);
    if (query.number === undefined || query.sort === undefined || typeof (query.number) != typeof (0)) {
      return server.respondWithError(response, 400, "Error 400: Query not supported");
    } else if (query.number <= 0 || query.number > 100 || query.sort !== "timeCreated") {
      return server.respondWithError(response, 400, "Error 400: Query not supported");
    } else {
      let queryResponse = [];
      let firebaseQuery = this.session.collection('lessons').orderBy('timeCreated').limit(query.number);
      firebaseQuery.get()
      .then( snapshot => {
        if(!snapshot.empty) {
          snapshot.forEach(doc => {
            let lesson = doc.data();
            lesson.timeCreated = lesson.timeCreated._seconds;
            queryResponse.push(lesson);
          });
        }
        server.respondWithData(response, 200, 'application/json', JSON.stringify({'results': queryResponse}));
      })
      .catch( error => {
        console.log("Error with querying lessons: ==========");
        console.log(error);
        console.log("=======end of error========");
        server.respondWithError(response, 500, "Error 500: Internal database error with query");
      });
    }
  }


// ==========================================================
// ================== write handling ========================
// ==========================================================
  verifyAccountData(account) {
    if(account.bio !== undefined && !(typeof(account.bio) == typeof(""))) {
      return false;
    } else if (account.bio.length > this.ACCOUNT_BIO_CHARACTER_LIMIT) {
      return false;
    }
    return true;
  }


  addAccount(server, response, account, accountID) {
    if (this.verifyAccountData(account)) {

      //make database object to store in database
      let databaseAccount = {};
      databaseAccount.accountID = accountID;
      databaseAccount.timeCreated = Date.now();
      databaseAccount.bio = account.bio;
      databaseAccount.lessons = [];
      databaseAccount.problems = [];

      //send query to database
      this.session.collection("accounts").doc(accountID).set(databaseAccount)
      .then(function() {
        server.respondWithData(response, 201, 'application/text', "account " + accountID + " successfully created");
      })
      .catch(err => {
        console.log(" =================== ");
        console.log("Error posting account");
        console.log(err);
        console.elog(" =================== ");
        server.respondWithError(response, 500, "Error 500: Internal Database Error");
      });
    } else {
      server.respondWithError(response, 400, "Error 400: Account data not formatted correctly");
    }
    
  }




}

module.exports = FirestoreDatabase;
