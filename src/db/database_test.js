const problems = [{"startExpression":[93,0,0,0,2,41,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,28,-33,-104,50,-61,-46,98,25,-116,-61,56,-36,39,117,103,-35,-68,-31,70,-97,-1,-16,118,112,0],"goalExpression":[93,0,0,0,2,35,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,90,8,-110,32,12,94,-49,111,-58,106,-38,104,-40,-112,-101,10,-123,-32,-87,-85,75,62,52,-103,-93,-89,89,-70,-1,-13,105,-22,0]},
{}];
const lessons = [];
const accounts = [{"bio":"a bio"}];
var savedIDs = [];
const DB = require("./firestore_database.js");
const database = new DB();


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
  
  respondWithData(response, statusCode, mediaType, data) {
    if(response.expectedCode !== 200 && response.expectedCode !== 201) {
      failedTest(response.testCase, "Expected: " + response.expectedResult + "\nInstead: file was written to database @ " + data);
    } else {
      let checkReturn = response.checkFunction(data, response.testComparison);
      if(!checkReturn) {
        successfulTest(response.testCase);
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


function saveName (data, testComparison) {
  savedIDs.append(data);
  return false;
}

function checkProblemExpressions(data, testComparison) {
  if(data.goalExpression === testComparison.goalExpression && data.startExpression === testComparison.startExpression) {
    return false;
  } else {
    return "goal and start expression do not match expected data";
  }
}




function runTests() {
  let server = new FakeServer();
  //account testing

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

  //account cannot be deleted by other user
  let loadServer2 = new LoadingServer(1, function() {
    database.deleteAccount(server, new FakeResponse(400, 3, "account-3 cannot be deleted ", noCheck, null), "not-correct-account");
  });
  database.addAccount(loadServer2, new EmptyResponse(noCheck), accounts[0], "account-3");

  //account can be deleted by creator of account
  let loadServer3 = new LoadingServer(1, function() {
    database.deleteAccount(server, new FakeResponse(200, 4, "account-4 is deleted", noCheck, null), "account-4");
  });
  database.addAccount(loadServer3, new EmptyResponse(noCheck), accounts[0], "account-4");











  // database.saveProblem(server, new FakeResponse(201, 0, "problem-1 is saved in database", noCheck, null), accountID, problems[0], "problem-1");



  // let loadServer1 = new LoadingServer(1, function () {
  //   let loadServer2 = new LoadingServer(1, function () {

  //   });
  //   database.postProblem(loadServer2,new EmptyResponse(noCheck), "A", problems[0], "Problem-1");

  // });
  // database.addAccount(loadServer1,new EmptyResponse(noCheck), "A", "A");


  // database.postProblem(loadServer,new EmptyResponse(saveName), undefined, problems[0], "");
  // database.postProblem(loadServer,new EmptyResponse(noCheck), undefined, problems[0], "");



  // database.getProblem(server, new FakeResponse(200, 0, "TEST_PROBLEM_1 is retrieved from database", noCheck, null), "TEST_PROBLEM_1");
  // database.getLesson(server, new FakeResponse(200, 1, "TEST_USER_0/TEST_LESSON_0 is retrieved from database", noCheck, null), "TEST_USER_0/TEST_LESSON_0");
  // database.getAccount(server, new FakeResponse(200, 2, "TEST_USER_0 is retrieved from database", noCheck, null), "TEST_USER_0");

  // database.saveProblem(server, new FakeResponse(200, 3, "Problem is successfully posted to database", noCheck, null), undefined, problems[0], "");

  
}

function runTestSetOne() {

}


runTests();