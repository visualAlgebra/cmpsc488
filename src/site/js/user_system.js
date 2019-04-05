import firebase from "firebase";

class User {
  constructor(accountID, token) {
    this.accountID = accountID;
    this.token = token;
  }
}

//called to sign in user via google 
export function signIn(callback) {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var user = result.user;
    let email = user.email;
    let atIndex = email.indexOf('@');
    let userName = email.substring(0,atIndex);
    var token = result.user.getIdToken()
    .then(token => {
      let currentUser = new User(userName, token);
      checkIfAccountExists(currentUser, function () {return;})
      callback(currentUser);
    })
    .catch(error => {
      console.log("Error getting token: " + error);
    });
    
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
  });

}

export function signOut(callback) {
  firebase.auth().signOut().then(function() {
    callback()
  }).catch(function(error) {
    console.log("Error: could not sign out user");
    console.log(error);
  });
}


//user is User class. callback is called on success of deleting account from database & authorization
export function deleteCurrentUser(user, callback) {
  deleteFromDatabase(user, function () {
    firebase.auth().currentUser.delete().then(function () {
      callback();
    }).catch(function (error) {
      console.log("Error: could not delete user");
      console.log(error);
    });
  });
}


//user is User class
function deleteFromDatabase(user, successCallback) {
  let http = new XMLHttpRequest();
  http.open("DELETE", "http://localhost:8080/accounts/" + user.accountID, true);
  http.setRequestHeader("oauth_token", user.token);
  http.send();

  http.onreadystatechange = function () {
		if ( http.readyState == 4 && http.status == 200) {
			successCallback();
    } else {
      console.log("Error: failed to delete account");
    }
	}
}

function checkIfAccountExists(user, callback) {
  let http = new XMLHttpRequest();
  http.open("GET", "http://localhost:8080/accounts/" + user.accountID, true);
  http.send();

  http.onreadystatechange = function () {
		if ( http.readyState == 4 && http.status == 404) {
			addNewAccount("new account", user, callback);
    } else if (http.readyState == 4 && http.status != 200) {
      console.log("Error: failed checking if account exists");
    }
	}
}


//posts new account, called when signIn signs in a new user
function addNewAccount(bio, user, callback) {
  let http = new XMLHttpRequest();
  http.open("POST", "http://localhost:8080/accounts/", true);
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader("oauth_token", user.token);
  let str = JSON.stringify({"bio": bio});
  http.send(str);

  http.onreadystatechange = function () {
		if ( http.readyState == 4 && http.status == 201) {
			callback(); 
		} else if (http.readyState == 4){
      console.log("Error: account creation error");
      console.log(http.status)
      console.log(http.responseText);
    }
	};
}

//needs to be called on load of every page that has user (every page)
export function addListenerForUser(callback) {
  var config = {
    apiKey: " AIzaSyCDFM-e3QGmKcxarHC9KFeAv_HzwFq3w3M ",
    authDomain: "vatest-83fa4.firebaseapp.com",
    databaseURL: "https://vatest-83fa4.firebaseio.com",
    projectId: "vatest-83fa4"
  };
  firebase.initializeApp(config);

  
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      user.getIdToken()
      .then(token => {
        let email = user.email;
        let atIndex = email.indexOf('@');
        let userName = email.substring(0,atIndex);
        let currentUser = new User(userName, token);
        callback(currentUser);
      })
      .catch(error => {
        console.log(error);
      });
    }
  });
}
