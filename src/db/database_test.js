const problems = [{"startExpression":[93,0,0,0,2,41,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,28,-33,-104,50,-61,-46,98,25,-116,-61,56,-36,39,117,103,-35,-68,-31,70,-97,-1,-16,118,112,0],"goalExpression":[93,0,0,0,2,35,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,90,8,-110,32,12,94,-49,111,-58,106,-38,104,-40,-112,-101,10,-123,-32,-87,-85,75,62,52,-103,-93,-89,89,-70,-1,-13,105,-22,0]},
{}];
const lessons = [{"creations":["problems/account-10\\problem-5"]}];
const accounts = [{"bio":"a bio"}];
var savedIDs = [];
var savedIDforDeleteTest;
const DB = require("./firestore_database.js");
const database = new DB();
const totalTests = 17;
const deleteFiles = ["accounts/account-0", "accounts/account-1", "accounts/account-2", "accounts/account-5", "accounts/account-6", "accounts/account-7",
"accounts/account-8", "accounts/account-9", "accounts/account-10", "problems/account-5\\problem-1", "problems/account-6\\problem-2", "problems/account-7\\problem-3",
"problems/account-8\\problem-3", "problems/account-10\\problem-5", "lessons/account-10\\lesson-1", "lessons/account-10\\lesson-3", "lessons/account-10\\lesson-4"];



class TestTracker {
  constructor(totalTests, toDelete) {
    this.totalTests = totalTests;
    this.testsCompleted = 0;
    this.toDelete = toDelete
  }
  testCompleted() {
    this.testsCompleted++;
    //console.log("Tests Completed: " + this.testsCompleted);
    if(this.testsCompleted >= this.totalTests) {
      this.cleanup();
    }
  }
  cleanup() {
    this.toDelete.forEach(file => {
      let slashIndex = file.indexOf('/');
      database.deleteFile(file.substring(0,slashIndex), file.substring(slashIndex+1));
    });
    savedIDs.forEach(file => {
      //console.log("deleting: " + file);
      database.deleteFile("problems", file);
    })
    database.deleteFile("problems", savedIDforDeleteTest);
    console.log("finished cleanup");
  }

}




class FakeResponse {
  constructor(expectedCode, testCase, expectedResult, checkFunction, testComparison) {
    this.expectedCode = expectedCode;
    this.testCase = testCase;
    this.expectedResult = expectedResult;
    this.checkFunction = checkFunction;
    this.testComparison = testComparison;
  }
}

class FakeServer {
  constructor(totalTests, toDelete) {
    this.testTracker = new TestTracker(totalTests, toDelete)
  }
  
  respondWithData(response, statusCode, mediaType, data) {
    if(response.expectedCode !== 200 && response.expectedCode !== 201) {
      failedTest(response.testCase, "Expected: " + response.expectedResult + "\nInstead: database file " + data);
    } else {
      let checkReturn = response.checkFunction(data, response.testComparison);
      if(!checkReturn) {
        successfulTest(response.testCase);
        this.testTracker.testCompleted();
      } else {
        failedTest(response.testCase, "Expected: " + response.expectedResult + "\n Instead " + checkReturn);
      }
    }
  }

  respondWithError(response, errorCode, errorMessage) {
    if(errorCode !== response.expectedCode) {
      failedTest(response.testCase, response.expectedResult + "\nInstead: returned with error code " + errorCode + "\nMessage: " + errorMessage);
    } else {
      successfulTest(response.testCase);
      this.testTracker.testCompleted();
    }
  }
}


//used to fake a server class for loading data into database before using it
class LoadingServer {
  constructor(docsToLoad, callback) {
    this.loadedDocuments = 0;
    this.documentsToLoad = docsToLoad;
    this.callback = callback;
  }
  respondWithData(response, statusCode, mediaType, data) {
    this.loadedDocuments++;
    response.checkFunction(data, null);
    if(this.loadedDocuments === this.documentsToLoad) {
      return this.callback();
    }
  }
  respondWithError(response, errorCode, errorMessage) {
    console.log("Failed to load needed documents to database.");
    console.log("Reason: " + errorMessage);
    return;
  }
}

//used to replace response class when loading problem without a name, but dont want any other behavior
class EmptyResponse {
  constructor(checkFunction) {
    this.checkFunction = checkFunction;
  }
}




function failedTest(testCase, errorMessage) {
  console.log("TEST " + testCase + ": FAILED");
  console.log(errorMessage);
}

function successfulTest(testCase) {
  console.log("TEST " + testCase + ": SUCCESS");
}

// ==================================================
// Check functions
// ==================================================

function noCheck (data, testComparison) {
  return false;
}


//for specific test case to store random name
function specialSaveName(data, testComparison) {
  savedIDforDeleteTest = data.substring(48);
  //console.log(savedIDforDeleteTest);
  return false;
}


function saveName (data, testComparison) {
  savedIDs.push(data.substring(48));
  return false;
}

function testName (data, testComparison) {
  savedIDs.push(data.substring(48));
  if(data === testComparison) {
    return false;
  } else {
    return "problem does not have expected name. Returned: " + data;
  }
}

function checkProblemExpressions(data, testComparison) {
  if(data.goalExpression === testComparison.goalExpression && data.startExpression === testComparison.startExpression) {
    return false;
  } else {
    return "goal and start expression do not match expected data";
  }
}

function checkOwnerLesson(data, testComparison) {
  for(let i = 0; i < data.length; i++) {
    if(data[i] === testComparison) {
      return false;
    }
  }
  return "ownerLessons does not contain " + testComparison;
}




function runTests() {
  let server = new FakeServer(totalTests, deleteFiles);




  //=============
  //ACCOUNT tests
  //=============

  //account can be posted
  database.addAccount(server, new FakeResponse(201,0, "account-0 is saved in database", noCheck, null), accounts[0], "account-0");

  //account can be read
  let loadServer0 = new LoadingServer(1, function() {
    database.getAccount(server, new FakeResponse(200, 1, "account-1 is returned by database", noCheck, null), "account-1");
  });
  database.addAccount(loadServer0, new EmptyResponse(noCheck), accounts[0], "account-1");

  //account can't be overwritten
  let loadServer1 = new LoadingServer(1, function() {
    database.addAccount(server, new FakeResponse(400, 2, "account-2 cannot be overwritten", noCheck, null), accounts[0], "account-2");
  });
  database.addAccount(loadServer1, new EmptyResponse(noCheck), accounts[0], "account-2");

  // //account cannot be deleted by other user
  // let loadServer2 = new LoadingServer(1, function() {
  //   database.deleteAccount(server, new FakeResponse(400, 3, "account-3 cannot be deleted by non-creator", noCheck, null), "not-correct-account");
  // });
  // database.addAccount(loadServer2, new EmptyResponse(noCheck), accounts[0], "account-3");

  //account can be deleted by creator of account
  let loadServer3 = new LoadingServer(1, function() {
    database.deleteAccount(server, new FakeResponse(200, 4, "account-4 is deleted", noCheck, null), "account-4");
  });
  database.addAccount(loadServer3, new EmptyResponse(noCheck), accounts[0], "account-4");




  //=============
  //PROBLEM tests
  //=============

  //problem is saved with random name when no account provided
  database.saveProblem(server, new FakeResponse(201, 5, "problem-0 is saved in database under random name", saveName, null), undefined, problems[0], "problem-0");

  //problem is saved with name when account provided
  let loadServer4 = new LoadingServer(1, function() {
    database.saveProblem(server, new FakeResponse(201, 6, "problem-1 is saved in database with name account-5\\problem-1", testName, "Problem Saved at http://localhost:8080/problems/account-5\\problem-1"), "account-5", problems[0], "problem-1");
  });
  database.addAccount(loadServer4, new EmptyResponse(noCheck), accounts[0], "account-5");

  //cannot repost problem when account used
  let loadServer5 = new LoadingServer(1, function() {
    let loadServer6 = new LoadingServer(1, function() {
      database.saveProblem(server, new FakeResponse(400, 7, "problem-2 cannot be overwritten", testName, null), "account-6", problems[0], "problem-2");
    });
    database.saveProblem(loadServer6, new EmptyResponse(noCheck), "account-6", problems[0], "problem-2");
  });
  database.addAccount(loadServer5, new EmptyResponse(noCheck), accounts[0], "account-6");

  //recieve problem from database
  let loadServer7 = new LoadingServer(1, function() {
    let loadServer8 = new LoadingServer(1, function() {
      database.getProblem(server, new FakeResponse(200, 8, "account-7\\problem-3 provided", noCheck, null), "account-7/problem-3");
    });
    database.saveProblem(loadServer8, new EmptyResponse(noCheck), "account-7", problems[0], "problem-3");
  });
  database.addAccount(loadServer7, new EmptyResponse(noCheck), accounts[0], "account-7");

  //cannot delete non-user problem
  let loadServer9 = new LoadingServer(1, function() {
      database.deleteProblem(server, new FakeResponse(403, 9, "problem without account creator cannot be deleted", noCheck, null), "account-6", savedIDforDeleteTest);
  });
  database.saveProblem(loadServer9, new EmptyResponse(specialSaveName), undefined, problems[0], "");
  

  //cannot delete other user's problem
  let loadServer10 = new LoadingServer(1, function() {
    let loadServer11 = new LoadingServer(1, function() {
      database.deleteProblem(server, new FakeResponse(403, 10, "problem-3 cannot be deleted by non-creator", noCheck, null), "not-correct-account", "account-8/problem-3");
    });
    database.saveProblem(loadServer11, new EmptyResponse(noCheck), "account-8", problems[0], "problem-3");
  });
  database.addAccount(loadServer10, new EmptyResponse(noCheck), accounts[0], "account-8");

  //the creator can delete problem
  let loadServer12 = new LoadingServer(1, function() {
    let loadServer13 = new LoadingServer(1, function() {
      database.deleteProblem(server, new FakeResponse(200, 11, "problem-4 can be deleted by creator", noCheck, null), "account-9", "account-9/problem-4");
    });
    database.saveProblem(loadServer13, new EmptyResponse(noCheck), "account-9", problems[0], "problem-4");
  });
  database.addAccount(loadServer12, new EmptyResponse(noCheck), accounts[0], "account-9");


  



  //============
  //LESSON tests
  //============

  
  let loadServer14 = new LoadingServer(1, function() {
    let loadServer15 = new LoadingServer(1, function() {

      //can post lesson w/account
      database.saveLesson(server, new FakeResponse(201, 12, "lesson is saved in database with name account-10\\lesson-1", noCheck, "Lesson Saved at http://localhost:8080/lessons/account-10\\lesson-1"), "account-10", lessons[0], "lesson-1");

      //cannot post lesson w/out account
      database.saveLesson(server, new FakeResponse(401, 13, "lesson cannot be saved without account", noCheck, null), null, lessons[0], "lesson-2");

      //can get lesson
      let loadServer16 = new LoadingServer(1, function() {
        database.getLesson(server, new FakeResponse(200, 14, "lesson is received from database", noCheck, null), "account-10\\lesson-3");
      });
      database.saveLesson(loadServer16, new EmptyResponse(noCheck), "account-10", lessons[0], "lesson-3");

      //cannot repost lesson && cannot delete other's lesson
      let loadServer17 = new LoadingServer(1, function() {
        database.saveLesson(server, new FakeResponse(400, 15, "lesson cannot be overwritten", noCheck, null), "account-10", lessons[0], "lesson-4");
        database.deleteLesson(server, new FakeResponse(403, 16, "lesson cannot be deleted by non-creator", noCheck, null), "not-correct-account", "account-10\\lesson-4");
      });
      database.saveLesson(loadServer17, new EmptyResponse(noCheck), "account-10", lessons[0], "lesson-4");

      //creator deletes owned lesson
      let loadServer18 = new LoadingServer(1, function() {
        database.deleteLesson(server, new FakeResponse(200, 17, "lesson is deleted by creator", noCheck, null), "account-10", "account-10\\lesson-5");
      });
      database.saveLesson(loadServer18, new EmptyResponse(noCheck), "account-10", lessons[0], "lesson-5");






    });
    database.saveProblem(loadServer15, new EmptyResponse(noCheck), "account-10", problems[0], "problem-5");
  });
  database.addAccount(loadServer14, new EmptyResponse(noCheck), accounts[0], "account-10");






  

  
}

function runTestSetOne() {

}


runTests();