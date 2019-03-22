const problems = [{"startExpression":[93,0,0,0,2,41,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,28,-33,-104,50,-61,-46,98,25,-116,-61,56,-36,39,117,103,-35,-68,-31,70,-97,-1,-16,118,112,0],"goalExpression":[93,0,0,0,2,35,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,90,8,-110,32,12,94,-49,111,-58,106,-38,104,-40,-112,-101,10,-123,-32,-87,-85,75,62,52,-103,-93,-89,89,-70,-1,-13,105,-22,0]},
{}];
const lessons = [];
const accounts = [];
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

class emptyServer {
  respondWithData(response, statusCode, mediaType, data) {

  }
  respondWithError(response, errorCode, errorMessage) {

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
  database.getProblem(server, new FakeResponse(200, 0, "TEST_PROBLEM_1 is retrieved from database", noCheck, null), "TEST_PROBLEM_1");
  database.getLesson(server, new FakeResponse(200, 1, "TEST_USER_0/TEST_LESSON_0 is retrieved from database", noCheck, null), "TEST_USER_0/TEST_LESSON_0");
  database.getAccount(server, new FakeResponse(200, 2, "TEST_USER_0 is retrieved from database", noCheck, null), "TEST_USER_0");

  database.saveProblem(server, new FakeResponse(200, 3, "Problem is successfully posted to database", noCheck, null), undefined, problems[0], "");


  
}


function cleanUp() {
  let server = new emptyServer();
  
}

runTests();