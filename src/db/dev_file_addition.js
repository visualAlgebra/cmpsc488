const admin = require("firebase-admin");
const serviceAccount = require("./vatest-83fa4-firebase-adminsdk-kvm0g-7c0191ca53.json");
const fs = require("fs");
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

//dev function to insert a doc into database from file
function insertFile(fileName, collection, name) {
  fs.readFile(fileName, function (error, data) {
    if (data) {
      database.collection(collection).doc(name).set(JSON.parse(data))
      .then( result => {
        console.log("file written to database successfully");
      })
      .catch( error => {
        console.log("error writing file to database");
      });
    }
    if (error) {
      console.log("error reading file");
      console.log(error);
    }
  });
}

function deleteFile(collection, file) {
  database.collection(collection).doc(file).delete()
  .then(value => {return;})
  .catch(error => {
    console.log("failed to delete " + collection + "/" + file);
    return;
  })
}

insertFile('src/db/UPDATED_TEST_PROBLEM_1.json', "problems", 'tp1');
module.exports = deleteFile;




