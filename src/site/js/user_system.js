import Firebase from "firebase";

class User {
  constructor(accountID, token) {
    var accountID = accountID;
    var token = token;
  }
}

//called to sign in user via google 
function signIn(callback) {
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken;
    var user = result.user;
    let email = user.email;
    let atIndex = email.indexOf('@');
    let userName = email.substring(0,atIndex);

  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
  });

}

function signOut() {

}

function checkIfAccountExists(accountID, callback) {
  let http = new XMLHttpRequest();
  http.open("GET", "http://localhost:8080/accounts/" + accountID, true);
  http.send();

  http.onreadystatechange = function () {
		if ( http.readyState == 4 && http.status == 404) {
			addNewAccount("new account", callback);
    } else if (http.readyState == 4 && http.status != 200) {
      console.log("Error: failed checking if account exists");
    }
	}
}


//posts new account, called when signIn signs in a new user
function addNewAccount(bio, callback) {
  let http = new XMLHttpRequest();
  http.open("POST", "http://localhost:8080/accounts/", true);
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader("oauth_token", token);
  let str = '{"bio": ' + bio + '}';
  http.send(str);

  http.onreadystatechange = function () {
		if ( http.readyState == 4 && http.status == 201) {
			callback(); 
		} else {
      console.log("Error: account creation error");
    }
	};
}

function addListenerForUser() {
  var config = {
    apiKey: " AIzaSyCDFM-e3QGmKcxarHC9KFeAv_HzwFq3w3M ",
    authDomain: "vatest-83fa4.firebaseapp.com",
    databaseURL: "https://vatest-83fa4.firebaseio.com",
    projectId: "vatest-83fa4"
  };
  Firebase.initializeApp(config);
  

  var provider = new Firebase.auth.GoogleAuthProvider();
  Firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      let token = user.getIdToken()
      .then(token => {
        
      })
      .catch(error => {
        console.log(error);
      });
    }
  });
}