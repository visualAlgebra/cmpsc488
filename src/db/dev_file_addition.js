const admin = require("firebase-admin");
const serviceAccount = require("./vatest-83fa4-firebase-adminsdk-kvm0g-7c0191ca53.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vatest-83fa4.firebaseio.com'
});
const database = admin.firestore();
const domainName = "http://localhost:8080";

//dev function to save problem to account without using random id
function saveProblemWithoutAccount(problem, enteredName) {
  let databaseProblem = {};
  databaseProblem.description = "";
  databaseProblem.problemID = enteredName;
  databaseProblem.startExpression = problem.startExpression;
  databaseProblem.goalExpression = problem.goalExpression;
  databaseProblem.timeCreated = Date.now();
  databaseProblem.ownerLessons = [];

  let problemReference = database.collection("problems").doc(enteredName);

  problemReference.set(databaseProblem)
  .then(result => {
    console.log("saved " + enteredName + " successfully");
  })
  .catch(error => {
    console.log("failed to save file");
  })
}


saveProblemWithoutAccount({
  "startExpression": [93, 0, 0, 0, 2, -28, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 8, -85, 11, 71, 75, -96, 89, -84, -114, -34, 11, -70, -102, -115, -125, 78, 39, 99, 64, -75, 27, -123, -124, 9, -43, -34, -39, 34, -85, -19, 125, 39, -109, 103, 58, 54, 86, -52, -56, 10, 32, -121, -3, -38, -16, 104, -56, 79, -36, 88, 1, -72, 66, -41, 17, -1, -119, -42, -1, -19, 88, -72, 0],
  "goalExpression": [93, 0, 0, 0, 2, 125, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 5, -48, -24, 113, 90, 8, -110, 32, 113, -87, -75, -61, 4, 117, -40, 123, 0, 72, -105, 88, -31, 114, 116, 95, 54, 114, -67, 59, -65, -107, -49, 27, 74, -17, -61, 80, -60, 56, 48, 124, 95, -92, -13, -10, -86, -126, 96, 29, -88, -51, -1, 124, 84, 78, 108, -30, -47, -61, 115, -124, 28, 127, -1, 88, 111, -128, 0]
}, "TEST_PROBLEM_1");

saveProblemWithoutAccount({
  "startExpression": [93, 0, 0, 0, 2, 57, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 5, -48, -24, 113, 90, 17, 94, 18, 100, -15, -23, -3, 88, -12, 52, 0, -122, -120, -111, -21, -87, -66, 107, 105, 18, -70, -61, -127, -26, -60, 27, 118, -2, -15, -1, -13, -63, 60, 0],
  "goalExpression": [93, 0, 0, 0, 2, 57, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 5, -48, -24, 113, 90, 17, 94, 18, 100, -15, -23, -5, 79, 53, 86, 13, -78, -75, 42, -42, -118, -40, -112, 105, -9, -113, -41, -76, 34, 11, -78, 15, -65, -92, 109, 89, 127, -1, -61, 28, -128, 0]
}, "TEST_PROBLEM_2");

saveProblemWithoutAccount({
  "startExpression": [93, 0, 0, 0, 2, 42, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 96, -15, -110, 25, 86, 101, 54, 117, 2, 83, -75, -5, 72, 120, 36, 34, -73, -114, -114, -83, -64, -86, -38, -68, 60, 74, -35, -67, 22, -3, 64, -126, 64],
  "goalExpression": [93, 0, 0, 0, 2, 42, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 30, -2, -120, 126, 7, 112, 43, -115, -2, -58, -47, -45, -70, 17, 68, 22, 7, -126, 103, 33, 41, -117, 74, -87, 27, -1, -1, -30, 34, 88, 0]
}, "TEST_PROBLEM_3");

saveProblemWithoutAccount({
  "startExpression": [93, 0, 0, 0, 2, 27, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 5, -48, -24, 113, 89, -26, -19, -16, 120, 82, -19, -87, -77, -28, 20, 46, 42, 83, 27, -37, -57, 59, -37, -1, -1, -28, -11, 88, 0],
  "goalExpression": [93, 0, 0, 0, 2, 19, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 5, -48, -24, 113, 89, -26, -19, -16, -69, -21, 1, 37, -48, 59, -62, 79, 50, -1, -1, -9, 85, -64, 0]
}, "TEST_PROBLEM_4");