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




