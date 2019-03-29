const admin = require("firebase-admin");
const serviceAccount = require("./vatest-83fa4-firebase-adminsdk-kvm0g-7c0191ca53.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vatest-83fa4.firebaseio.com'
});
const database = admin.firestore();
const DAYS_FOR_FILES_TO_BE_SAVED = 10;
const currentTime = Date.now();
const timeLimit = currentTime - DAYS_FOR_FILES_TO_BE_SAVED*1000*60*60*24;



let query = database.collection("problems").where("creatorAccountID", "==", null);
query.get()
.then( snapshot => {
  snapshot.forEach(doc => {
    let data = doc.data();
    console.log(timeLimit);
    console.log(data.timeCreated);
    if(data.timeCreated < timeLimit) {
      database.collection("problems").doc(doc.id).delete()
      .then(value => {
        console.log(doc.id + " deleted");
      })
      .catch( error => {
        console.log("error deleting " + doc.id);
        console.log(error);
      })
    }
  })
})
.catch( error => {
  console.log("error getting snapshot of problems");
  console.log(error);
});