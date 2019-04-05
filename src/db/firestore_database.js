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

  //contacts firebase and gets user based on provided token
  //server: Server class that made call, response: Response class that request was from, idToken: oauth token, callback: success callback with string username as only argument
  //calls callback on success with accountID as argument, calls server.respondWithError with response as first argument on fail
  getAccountIDFromToken(server, response, idToken, callback) {
    if(idToken === undefined) {
      return callback(undefined);
    }
    
    this.admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
        let email = decodedToken.email;
        let atIndex = email.indexOf('@');
        let userName = email.substring(0,atIndex);
        callback(userName);
   
      }).catch(function(error) {
        server.respondWithError(response, 403, "Error 403: oauth token not accepted");
      });
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
          server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(problem));
        }
      })
      .catch(err => {
        console.log("Error getting file from database: ", err);
        server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
      });
  }



  //calls firestore database to assemble the "creations" array in Lesson with full lessons and problems and not 
  assembleLesson(server, lesson, serverResponse) {
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
              return element === "problems/" + problem.problemID;
            })
            creations[index] = problem;
          });
        }
        if (lessonsFinished) {
          lesson.creations = creations;
          server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(lesson))
        } else {
          problemsFinished = true;
        }
      })
      .catch(err => {
        console.log(err);
        server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
      });


      lessonsQuery.get()
      .then(snapshot => {
        if(!snapshot.empty) {
          snapshot.forEach(doc => {
            let newLesson = doc.data();
            newLesson.timeCreated = newLesson.timeCreated._seconds;
            let index = creations.findIndex( element => {
              return element === "lessons/" + newLesson.lessonID;
            })
            creations[index] = newLesson;
          });
        }
        if (problemsFinished) {
          lesson.creations = creations;
          server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(lesson))
        } else {
          lessonsFinished = true;
        }
      })
      .catch(err => {
        console.log(err);
        server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
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
          this.assembleLesson(server, lesson, serverResponse);
        }
      })
      .catch(err => {
        console.log("Error getting file from database: ", err);
        server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
      });
  }


  //takes an account object recieved from the firestore and makes calls to get the user's problems and lessons to put in "problems" and "lessons" tag respectively
  assembleAccount(server, account, serverResponse) {
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
          server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(account))
        } else {
          problemsFinished = true;
        }
      })
      .catch(err => {
        console.log(err);
        server.respondWithError(serverResponse, 500, "Error 500: Internal Server Error");
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
          server.respondWithData(serverResponse, 200, "application/json", JSON.stringify(account))
        } else {
          lessonsFinished = true;
        }
      })
      .catch(err => {
        console.log(err);
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
          account.timeCreated = account.timeCreated._seconds;
          let lessons = [];
          let problems = [];

          this.assembleAccount(server, account, serverResponse);
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
  
  getAllLessonIDs(server, response) {
    let lessonIDs = [];
    let lessonCollectionReference = this.session.collection("lessons");
    lessonCollectionReference.listDocuments()
      .then(docReferences => {
        docReferences.forEach(docRef => {
          lessonIDs.push(docRef.id);
        })
        server.respondWithData(response, 200, 'application/json', JSON.stringify({ 'results': lessonIDs }));
      })
      .catch(error => {
        console.log("============ Error =============");
        console.log("Error with getting all lesson ids");
        console.log(error);
        console.log("==========End of Error =========");
        server.respondWithError(response, 500, 'text/plain', "Error 500: Internal Database Error");
      });
  }

  getAllProblemIDs(server, response) {
    let problemIDs = [];
    let problemCollectionReference = this.session.collection("problems");
    problemCollectionReference.listDocuments()
      .then(docReferences => {
        docReferences.forEach(docRef => {
          problemIDs.push(docRef.id);
        })
        server.respondWithData(response, 200, 'application/json', JSON.stringify({ 'results': problemIDs }));
      })
      .catch(error => {
        console.log("============ Error =============");
        console.log("Error with getting all problem ids");
        console.log(error);
        console.log("==========End of Error =========");
        server.respondWithError(response, 500, 'text/plain', "Error 500: Internal Database Error");
      });
  }


// ==========================================================
// ================== write handling ========================
// ==========================================================



  //used to verify types of data points sent by user when saving problem
  //problem is the problem object sent by the user
  //
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

  //used to verify types of data points sent by user when saving lesson
  //lesson is the lesson object sent by the user
  //
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

  //used to verify types of data points sent by user when saving account
  //account is the account object sent by the user
  //
  verifyAccountData(account) {
    if(account.bio !== undefined && !(typeof(account.bio) == 'string')) {
      return false;
    } else if (account.bio.length > this.ACCOUNT_BIO_CHARACTER_LIMIT) {
      return false;
    }
    return true;
  }

  //used to save a problem
  //server must be the server that calls saveProblem, response is the Response object that the call to save the problem comes from
  //accountID is either a valid account in the database, or undefined, problem is the data sent from the client, enteredName is a string
  saveProblem(server, response, accountID, problem, enteredName) {
    var self = this;
    if(this.verifyProblemData(problem)) {
      let databaseProblem = {};
      if(problem.description === undefined) {
        databaseProblem.description = "";
      } else {
        databaseProblem.description = problem.description;
      }
      databaseProblem.startExpression = problem.startExpression;
      databaseProblem.goalExpression = problem.goalExpression;
      databaseProblem.timeCreated = Date.now();
      databaseProblem.ownerLessons = [];

      let problemReference;
      if (accountID !== undefined) {
        let ownerAccountReference = this.session.collection("accounts").doc(accountID);

        ownerAccountReference.get().then(doc => {
          if(!doc.exists) {
            return server.respondWithError(response, 400, "Error 400: Account does not exist in database");
          }
          let ownerAccount = doc.data();
          let creationCount = ownerAccount.lessons.length + ownerAccount.problems.length;
          if (creationCount >= self.ACCOUNT_CREATION_LIMIT) {
            return server.respondWithError(response, 400, "Account already has limit of " + self.ACCOUNT_CREATION_LIMIT + " creations. Delete an old creation to save a new one.")
          }
          databaseProblem.problemID = accountID + "\\" + enteredName;
          databaseProblem.creatorAccountID = accountID;
          problemReference = this.session.collection("problems").doc(databaseProblem.problemID);
          problemReference.get()
          .then( doc => {
            if(doc.exists) { //need to check to see if problem already exists in database, if so, block from overwriting
              server.respondWithError(response, 400, "problem with that name already exists");
            } else {

              //atomically write problem & add to account
              let batch = self.session.batch();
              batch.set(problemReference, databaseProblem);
              batch.update(ownerAccountReference, {
                problems: self.admin.firestore.FieldValue.arrayUnion(databaseProblem.problemID)
              });
              batch.commit().then(value => {
                return server.respondWithData(response, 201, 'text/plain', "Problem Saved at " + self.domainName + "/problems/" + databaseProblem.problemID);
              }).catch(error => {
                console.log("============ Error =============");
                console.log("Error with batch write in saveProblem()");
                console.log(error);
                console.log("==========End of Error =========");
                return server.respondWithError(response, 500, "Internal Database Error");
              });
              
            }
          })
          .catch( error => {
            server.respondWithError(response, 500, "Error 500: Internal Database Error");
          });



        })
        .catch(err => {
          console.log("============ Error =============");
          console.log("Error posting problem with account");
          console.log(err);
          console.log("==========End of Error =========");
          server.respondWithError(response, 500, "Error 500: Internal Database Error");
        });

      } else {
        problemReference = this.saveProblemWithoutAccount(problemReference, databaseProblem, server, response);
      }
    } else {
      return server.respondWithError(response, 400, "Error 400: Problem Data not formatted correctly");
    }
  }


  //used in saveProblem to save problem if problem is being saved without an account
  //problemReference: FirestoreReference to problem being saved, databaseProblem: Problem Object being saved
  //server: Server object that called save Problem, response: ServerResponse object that called for problem to be saved 
  saveProblemWithoutAccount(problemReference, databaseProblem, server, response) {
    let self = this;
    problemReference = this.session.collection("problems").doc();
    databaseProblem.problemID = problemReference.id;
    databaseProblem.creatorAccountID = null;
    //console.log(problemReference.id);
    problemReference.set(databaseProblem)
      .then(function () {
        server.respondWithData(response, 201, 'application/text', "Problem Saved at " + self.domainName + "/problems/" + databaseProblem.problemID);
      })
      .catch(err => {
        console.log("============ Error =============");
          console.log("Error posting problem without account");
          console.log(err);
          console.log("==========End of Error =========");
        server.respondWithError(response, 500, "Error 500: Internal Database Error");
      });
    return problemReference;
  }



  //used in saveLesson to save lesson in an atomic write
  //
  //
  saveLessonBatchWrite(server, response, databaseLesson) {
    let batch = this.session.batch();
    let self = this;
    
    for(let i = 0; i < databaseLesson.creations.length; i++) {
      let slashIndex = databaseLesson.creations[i].indexOf('/');
      let creationType = databaseLesson.creations[i].substring(0,slashIndex);
      if(creationType === 'problems') {
        if (databaseLesson.creations[i].indexOf('\\') === -1) {
          return server.respondWithError(response, 400, "Error 400: Cannot create Lesson with a Problem created by a non-member");
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
        return server.respondWithError(response, 400, "Error 400: Cannot create Lesson with a Problem created by a non-member");
      }
    }

    let accountReference = this.session.collection("accounts").doc(databaseLesson.creatorAccountID);
    batch.update(accountReference, {
      lessons: self.admin.firestore.FieldValue.arrayUnion(databaseLesson.lessonID)
    });
    
    let lessonReference = this.session.collection("lessons").doc(databaseLesson.lessonID);
    batch.set(lessonReference, databaseLesson);

    return batch.commit().then(value => {
      server.respondWithData(response, 201, 'plain/text', self.domainName + "/lessons/" + databaseLesson.lessonID);
    })
    .catch(error => {
      console.log("============ Error =============");
      console.log("Error with batch posting lesson to database");
      console.log(error);
      console.log("==========End of Error =========");
      server.respondWithError(response, 500, "Error 500: Internal Database Error");
    })
  }


  //used to save lesson sent by user
  //
  //
  saveLesson(server, response, accountID, lesson, enteredName) {
    let self = this;
    if(accountID === null || accountID === undefined || typeof(accountID) != 'string') {
      return server.respondWithError(response, 401, "Error 401: Authorization required to post lesson")
    }
    if(this.verifyLessonData(lesson)) {
      let databaseLesson = {};
      if(lesson.description === undefined) {
        databaseLesson.description = "";
      } else {
        databaseLesson.description = lesson.description;
      }
      databaseLesson.creations = lesson.creations;
      databaseLesson.timeCreated = Date.now();
      databaseLesson.ownerLessons = [];
      databaseLesson.lessonID = accountID + "\\" + enteredName;
      databaseLesson.creatorAccountID = accountID;

      return this.session.collection("lessons").doc(databaseLesson.lessonID).get()
      .then(doc => {
        if(doc.exists) {
          return server.respondWithError(response, 400, "lesson wtih that name already exists");
        } else {
          //first determine if account has too many saved items
          let ownerAccountReference = this.session.collection("accounts").doc(accountID);
          ownerAccountReference.get().then(doc => {
            let ownerAccount = doc.data();
            let creationCount = ownerAccount.lessons.length + ownerAccount.problems.length;
            if (creationCount >= self.ACCOUNT_CREATION_LIMIT) {
              return server.respondWithError(response, 400, "Account already has limit of " + self.ACCOUNT_CREATION_LIMIT + " creations. Delete an old creation to save a new one.")
            } else {
              return self.saveLessonBatchWrite(server, response, databaseLesson);
            }
          })
          .catch( error => {
            console.log("============ Error =============");
            console.log("Error with getting creator's account in SaveLesson()");
            console.log(error);
            console.log("==========End of Error =========");
            return server.respondWithError(response, 500, "Error 500: Error getting account of user");
          });
        }
      })
      .catch(error => {
        console.log("============ Error =============");
        console.log("Error with getting lesson in saveLesson()");
        console.log(error);
        console.log("==========End of Error =========");
        return server.respondWithError(response, 500, "Error 500: Internal Database Error");
      });


    } else {
      console.log("============ Error =============");
      console.log("Posted lesson is not formatted correctly");
      console.log("==========End of Error =========");
      return server.respondWithError(response, 400, "Error 400: Lesson Data not formatted correctly");
    }
  }

  
  //used by addAccount to write account to database
  //
  //
  addAccountIntoDatabase(server, response, account, accountID) {
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


  //used to add account to database
  addAccount(server, response, account, accountID) {
    let self = this;
    return this.session.collection("accounts").doc(accountID).get()
    .then(doc => {
      if(doc.exists) {
        return server.respondWithError(response, 400, 'text/plain', "account already exists");
      } else {
        return self.addAccountIntoDatabase(server,response,account,accountID);
      }
    })
    .catch(error => {
      return self.addAccountIntoDatabase(server,response,account,accountID);
    })
    
  }


  //========================
  // DELETE METHODS
  //========================


  //used to delete a user's problem when deleting entire account
  //
  //
  deleteUserProblem(problemID) {
    let self = this;
    let unassembledLink = problemID.split('/');
    let correctLink = unassembledLink.reduce((assembler, part) => assembler + "\\" + part);
    return this.session.collection("problems").doc(correctLink).get()
    .then(doc => {
      if(!doc.exists) {
        return -1;
      }

      //make deletes atomic
      let batch = self.session.batch();
      //remove problem from lessons that it exists in
      let problem = doc.data();
      problem.ownerLessons.forEach(lessonID => {
        let lessonReference = self.session.collection("lessons").doc(lessonID);
        batch.update(lessonReference, {
          creations: self.admin.firestore.FieldValue.arrayRemove("problems/" + correctLink)
        });
      });

      //remove problem
      batch.delete(doc.ref);

      //commit all deletes/updates
      return batch.commit()
      .then(result => {
        return;
      })
      .catch(error => {
        return;
      });
    })

    .catch(error => {
      return;
    });
  }


  //delete problem from database.  can only delete problems for which accountID == problem's creator
  // will also remove from user's creations and any lessons the problem is in
  //
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

      let problem = doc.data();
      if(problem.creatorAccountID !== accountID) {
        return server.respondWithError(response, 403, "Error 403: Invalid Authorization to delete problem")
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
        console.log("============ Error =============");
        console.log("Error with comitting batch delete in deleteProblem()");
        console.log(error);
        console.log("==========End of Error =========");
        return server.respondWithError(response, 500, 'Error 500: Internal Server Error');
      });
    })

    .catch(error => {
      console.log("============ Error =============");
      console.log("Error with getting problem in deleteProblem())");
      console.log(error);
      console.log("==========End of Error =========");
      return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    });
  }



  //used to delete a user's lesson when deleting account
  //
  //
  deleteUserLesson(lessonID) {
    let self = this;

    
    let unassembledLink = lessonID.split('/');
    let correctLink = unassembledLink.reduce((assembler, part) => assembler + "\\" + part);
    return this.session.collection("lessons").doc(correctLink).get()
    .then(doc => {
      if(!doc.exists) {
        return;
      }
      let lesson = doc.data()
      
      //make deletes atomic
      let batch = self.session.batch();

      for(let i = 0; i < lesson.creations.length; i++) {
        let databaseLink = lesson.creations[i];
        let splitLink = databaseLink.split('/'); //since it should be "problems/lksjdflsdkjf" OR "lessons/laksjdflasdjf"
        if (splitLink[0] === "problems") {
          let problemReference = self.session.collection("problems").doc(splitLink[1]);
          batch.update(problemReference, {
            ownerLessons: self.admin.firestore.FieldValue.arrayRemove(correctLink)
          });
        } else if (splitLink[0] === "lessons") {
          let problemReference = self.session.collection("lessons").doc(splitLink[1]);
          batch.update(problemReference, {
            ownerLessons: self.admin.firestore.FieldValue.arrayRemove(correctLink)
          });
        } else {
          return;
        }
      }

      //remove lesson from lessons that it exists in
      lesson.ownerLessons.forEach(ownerLessonID => {
        let lessonReference = self.session.collection("lessons").doc(ownerLessonID);
        batch.update(lessonReference, {
          creations: self.admin.firestore.FieldValue.arrayRemove("lessons/" + correctLink)
        });
      });

      //remove lesson
      batch.delete(doc.ref);

      //commit batched deletes/updates
      return batch.commit()
      .then(result => {
        return;
      })
      .catch(error => {
        return;
      })
    })
    .catch(error => {
      return;
    })
  }


  //deletes lesson from database atomically. only deletes if creatorAccountID == accountID.  removes
  //lesson from it's creations' ownerLessons array.  also removes lesson from account @ accountID
  //
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
        return server.respondWithError(response, 403, "Error 403: User does not have permission to delete file");
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

      //remove lesson from lessons that it exists in
      lesson.ownerLessons.forEach(ownerLessonID => {
        let lessonReference = self.session.collection("lessons").doc(ownerLessonID);
        batch.update(lessonReference, {
          creations: self.admin.firestore.FieldValue.arrayRemove("lessons/" + correctLink)
        });
      });

      //remove lesson from list of account's creations
      let accountReference = self.session.collection("accounts").doc(accountID);
      batch.update(accountReference, {
        lessons: self.admin.firestore.FieldValue.arrayRemove(correctLink)
      });

      //remove lesson
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


  //used to delete account from database
  //
  //
  deleteAccount(server, response, accountID) {
    let self = this;
    return this.session.collection("accounts").doc(accountID).get()
    .then(doc => {
      let account = doc.data();
      account.lessons.forEach(lesson => {
        self.deleteUserLesson(lesson);
      });
      account.problems.forEach(problem => {
        self.deleteUserProblem(problem);
      });

      doc.ref.delete()
      .then(results => {
        return server.respondWithData(response, 200, 'text/plain', "account deleted successfully");
      })
      .catch(error => {
        console.log("============ Error =============");
        console.log("Error with deleting account in deleteAccount()");
        console.log(error);
        console.log("==========End of Error =========");
        return server.respondWithError(response, 500, "Error 500: Interal Server Error");
      })

    })
    .catch(error => {
      console.log("============ Error =============");
      console.log("Error with getting account in deleteAccount()");
      console.log(error);
      console.log("==========End of Error =========");
      return server.respondWithError(response, 500, "Error 500: Internal Server Error");
    });
  
  }


  //dev function. do not use in server code
  deleteFile(collection, file) {
    this.session.collection(collection).doc(file).delete()
    .then(value => {return;})
    .catch(error => {
      console.log("failed to delete " + collection + "/" + file);
      return;
    })
  }


}

module.exports = FirestoreDatabase;
