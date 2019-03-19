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
    this.ACCOUNT_CREATION_LIMIT = 100;
    this.domainName = "http://localhost:8080";
  }


  //firestore call to get problem in collection "problems" of document "link"
  getProblem(server, serverResponse, link) {
    let unassembledLink = link.split('/');
    let correctLink = unassembledLink.reduce((assembler, part) => assembler + "\\" + part);
    let problemReference = this.session.collection('problems').doc(correctLink);
    let problemQuery = problemReference.get()
      .then(doc => {
        if (!doc.exists) {
          server.respondWithError(serverResponse, 404, "Problem not found");
        } else {
          let problem = doc.data();
          problem.timeCreated = problem.timeCreated._seconds;
          console.log(problem);
          server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(problem));
        }
      })
      .catch(err => {
        console.log("Error getting file from database: ", err);
        server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
      });
  }



  //calls firestore database to assemble the "creations" array in Lesson with full lessons and problems and not 
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
    let unassembledLink = link.split('/');
    let correctLink = unassembledLink.reduce((assembler, part) => assembler + "\\" + part);
    let lessonReference = this.session.collection('lessons').doc(correctLink);
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
  verifyProblemData(problem) {
    let failed = false;
    if(problem.startExpression === undefined || typeof(problem.startExpression) !== 'object') {
      return false;
    } else if (problem.goalExpression === undefined || typeof(problem.goalExpression) !== 'object') {
      return false;
    } else if (problem.description !== undefined && typeof(problem.description) !== 'string') {
      return false;
    }


    return true;
  }

  verifyLessonData(lesson) {
    if(lesson.creations === undefined || typeof(lesson.creations) !== 'object') {
      return false;
    } else if (lesson.description !== undefined && typeof(lesson.description) !== 'string') {
      return false;
    }
    for (let i = 0; i < lesson.creations.length; i++) {
      if (typeof(lesson.creations[i]) !== 'string') {
        return false;
      }
    }
    return true;
  }

  verifyAccountData(account) {
    if(account.bio !== undefined && !(typeof(account.bio) == 'string')) {
      return false;
    } else if (account.bio.length > this.ACCOUNT_BIO_CHARACTER_LIMIT) {
      return false;
    }
    return true;
  }


  saveProblem(server, response, accountID, problem, enteredName) {
    var self = this;
    if(this.verifyProblemData(problem)) {
      let databaseProblem = {};
      databaseProblem.description = problem.description;
      databaseProblem.startExpression = problem.startExpression;
      databaseProblem.goalExpression = problem.goalExpression;
      databaseProblem.timeCreated = Date.now();
      databaseProblem.ownerLessons = [];

      let problemReference;
      if (accountID !== undefined) {
        let ownerAccountReference = this.session.collection("accounts").doc(accountID);

        ownerAccountReference.get().then(doc => {
          let ownerAccount = doc.data();
          let creationCount = ownerAccount.lessons.length + ownerAccount.problems.length;
          if (creationCount >= self.ACCOUNT_CREATION_LIMIT) {
            return server.respondWithError(response, 400, "Account already has limit of " + self.ACCOUNT_CREATION_LIMIT + " creations. Delete an old creation to save a new one.")
          }
          databaseProblem.problemID = accountID + "\\" + enteredName;
          databaseProblem.creatorAccountID = accountID;
          problemReference = this.session.collection("problems").doc(databaseProblem.problemID);
          let batch = self.session.batch();
          batch.set(problemReference, databaseProblem);
          batch.update(ownerAccountReference, {
            problems: self.admin.firestore.FieldValue.arrayUnion(databaseProblem.problemID)
          });
          batch.commit().then(value => {
            return server.respondWithData(response, 201, 'text/plain', "Problem Saved at " + self.domainName + "/problems/" + databaseProblem.problemID);
          }).catch(error => {
            return server.respondWithError(response, 500, "Internal Database Error");
          });
        })
        .catch(err => {
          console.log("============ Error =============");
          console.log("Error posting lesson with account");
          console.log(err);
          console.log("==========End of Error =========");
          server.respondWithError(response, 500, "Error 500: Internal Database Error");
        });

      } else {
        problemReference = this.session.collection("problems").doc();
        databaseProblem.problemID = problemReference.id;
        console.log(problemReference.id);
        problemReference.set(databaseProblem)
        .then(function() {
          server.respondWithData(response, 201, 'application/text', "Problem Saved at " + self.domainName + "/problems/" + databaseProblem.problemID);
        })
        .catch(err => {
          console.log(" =================== ");
          console.log("Error posting problem");
          console.log(err);
          console.elog(" =================== ");
          server.respondWithError(response, 500, "Error 500: Internal Database Error");
        });
      }
    } else {
      return server.respondWithError(response, 400, "Error 400: Problem Data not formatted correctly");
    }
  }


  saveLessonBatchWrite(response, databaseLesson, successCallback, failureCallback) {
    let batch = this.session.batch();
    let self = this;
    
    for(let i = 0; i < databaseLesson.creations.length; i++) {
      let slashIndex = databaseLesson.creations[i].indexOf('/');
      let creationType = databaseLesson.creations[i].substring(0,slashIndex);
      if(creationType === 'problems') {
        if (databaseLesson.creations[i].indexOf('\\') === -1) {
          return failureCallback(response, 400, "Error 400: Cannot create Lesson with a Problem created by a non-member");
        }
        let problem = this.session.collection("problems").doc(databaseLesson.creations[i].substring(slashIndex+1));
        batch.update(problem, {
          ownerLessons: self.admin.firestore.FieldValue.arrayUnion(databaseLesson.lessonID)
        });
      } else if (creationType === 'lessons') {
        let lesson = this.session.collection("lessons").doc(databaseLesson.creations[i].substring(slashIndex+1));
        batch.update(lesson, {
          ownerLessons: self.admin.firestore.FieldValue.arrayUnion(databaseLesson.lessonID)
        });
      } else {
        console.log("====");
        console.log("Error saving lesson:");
        console.log("Provided lesson creation '" + databaseLesson.creations[i] + "' not a problem or lesson");
        return failureCallback(response, 400, "Error 400: Cannot create Lesson with a Problem created by a non-member");
      }
    }

    let accountReference = this.session.collection("accounts").doc(databaseLesson.creatorAccountID);
    batch.update(accountReference, {
      lessons: self.admin.firestore.FieldValue.arrayUnion(databaseLesson.lessonID)
    });
    
    let lessonReference = this.session.collection("lessons").doc(databaseLesson.lessonID);
    batch.set(lessonReference, databaseLesson);

    return batch.commit().then(value => {
      successCallback(response, 201, 'application/text', self.domainName + "/lessons/" + databaseLesson.lessonID);
    })
    .catch(error => {
      console.log("============ Error =============");
      console.log("Error with batch posting lesson to database");
      console.log(error);
      console.log("==========End of Error =========");
      failureCallback(response, 500, "Error 500: Internal Database Error");
    })
  }



  saveLesson(server, response, accountID, lesson, enteredName) {
    if(this.verifyLessonData(lesson)) {
      let databaseLesson = {};
      databaseLesson.description = lesson.description;
      databaseLesson.creations = lesson.creations;
      databaseLesson.timeCreated = Date.now();
      databaseLesson.ownerLessons = [];
      databaseLesson.lessonID = accountID + "\\" + enteredName;
      databaseLesson.creatorAccountID = accountID;

      this.saveLessonBatchWrite(response, databaseLesson, server.respondWithData, server.respondWithError);

    } else {
      console.log("============ Error =============");
      console.log("Posted lesson is not formatted correctly");
      console.log("==========End of Error =========");
      return server.respondWithError(response, 400, "Error 400: Lesson Data not formatted correctly");
    }
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
        console.log(" =================== ");
        server.respondWithError(response, 500, "Error 500: Internal Database Error");
      });
    } else {
      server.respondWithError(response, 400, "Error 400: Account data not formatted correctly");
    }
    
  }

  // DELETE METHODS


  //delete problem from database.  can only delete problems for which accountID == problem's creator
  // will also remove from user's creations and any lessons the problem is in
  deleteProblem(server, response, accountID, problemID) {
    let self = this;
    //is problem deletable by user
    let unassembledLink = problemID.split('/');
    let correctLink = unassembledLink.reduce((assembler, part) => assembler + "\\" + part);
    this.session.collection("problems").doc(correctLink).get()
    .then(doc => {
      if(!doc.exists) {
        return server.respondWithError(response, 404, "Error 404: Problem not found");
      }
      //check if deleter is problem's creator
      let problem = doc.data()
      if(accountID !== problem.creatorAccountID) {
        return server.respondWithError(response, 401, "Error 401: User does not have permission to delete file");
      }

      //make deletes atomic
      let batch = self.session.batch();
      //remove problem from lessons that it exists in
      problem.ownerLessons.forEach(lessonID => {
        let lessonReference = self.session.collection("lessons").doc(lessonID);
        batch.update(lessonReference, {
          creations: self.admin.firestore.FieldValue.arrayRemove("problems/" + correctLink)
        });
      });

      //remove problem from list of account's creations
      let accountReference = self.session.collection("accounts").doc(accountID);
      batch.update(accountReference, {
        problems: self.admin.firestore.FieldValue.arrayRemove(correctLink)
      });

      //remove problem
      batch.delete(doc.ref);

      //commit all deletes/updates
      batch.commit()
      .then(result => {
        return server.respondWithData(response, 200, 'text/plain', problemID + " deleted successfully");
      })
      .catch(error => {
        return server.respondWithError(response, 500, 'Error 500: Internal Server Error');
      });
    })

    .catch(error => {
      return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    });
  }




  //deletes lesson from database atomically. only deletes if creatorAccountID == accountID.  removes
  //lesson from it's creations' ownerLessons array.  also removes lesson from account @ accountID
  deleteLesson(server, response, accountID, lessonID) {
    let self = this;

    //is lesson deletable by user
    let unassembledLink = lessonID.split('/');
    let correctLink = unassembledLink.reduce((assembler, part) => assembler + "\\" + part);
    this.session.collection("lessons").doc(correctLink).get()
    .then(doc => {
      if(!doc.exists) {
        return server.respondWithError(response, 404, "Error 404: Problem not found");
      }
      let lesson = doc.data()
      if(accountID !== lesson.creatorAccountID) {
        return server.respondWithError(response, 401, "Error 401: User does not have permission to delete file");
      }

      //make deletes atomic
      let batch = self.session.batch();

      lesson.creations.forEach(databaseLink => {
        let splitLink = databaseLink.split('/'); //since it should be "problems/lksjdflsdkjf" OR "lessons/laksjdflasdjf"
        if (splitLink[0] === "problems") {
          let problemReference = self.session.collection("problems").doc(splitLink[1]);
          return batch.update(problemReference, {
            ownerLessons: self.admin.firestore.FieldValue.arrayRemove(correctLink)
          });
        } else if (splitLink[0] === "lessons") {
          let problemReference = self.session.collection("lessons").doc(splitLink[1]);
          return batch.update(problemReference, {
            ownerLessons: self.admin.firestore.FieldValue.arrayRemove(correctLink)
          });
        } else {
          return server.respondWithError(response, 500, "Error 500: Internal Server Error");
        }
      });

      //remove problem from list of account's creations
      let accountReference = self.session.collection("accounts").doc(accountID);
      batch.update(accountReference, {
        lessons: self.admin.firestore.FieldValue.arrayRemove(correctLink)
      });

      //remove problem
      batch.delete(doc.ref);

      //commit batched deletes/updates
      batch.commit()
      .then(result => {
        server.respondWithData(response, 200, 'text/plain', lessonID + " deleted successfully");
      })
      .catch(error => {
        server.respondWithError(response, 500, 'Error 500: Internal Server Error');
      })
    })
    .catch(error => {
      server.respondWithError(response, 500, "Error 500: Internal Server Error");
    })
      
  }



  deleteAccount(server, response, accountID) {
    return server.respondWithError(response, 500, "Error 500: Internal Server Error");
}


  




}

module.exports = FirestoreDatabase;
