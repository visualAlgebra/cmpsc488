function get_problem_from_db(problem_id, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      let k=JSON.parse(http.responseText);
      callback(new ProblemInfo(k.problem_id,k.startExpression,k.goalExpression, k.description, k.timeCreated));
    }
  }
  http.open("GET", "http://localhost:8080/problems/" + problem_id, true);
  http.send();
}
//{"problems": ["TEST_PROBLEM_1", "TEST_PROBLEM_2", "TEST_PROBLEM_3"], "creatorAccountID": "TEST_USER_1"}
function get_lesson_from_db(lesson_id, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      let k=JSON.parse(http.responseText);
      callback(new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description));
    }
  }
  http.open("GET", "http://localhost:8080/lessons/" + lesson_id, true);
  http.send();
}

function post_problem_from_site(problem) {
  try {
    let http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/problems/" + problem.problemID, true);
    http.setRequestHeader("Content-type", "application/json");
    user = "Fractalyst, ofcourse, why would any other user be here?";
    http.setRequestHeader("Account", user);
    let str = '{ "problemName": "' + problem.problemID + '\",';
    str += ' "startExpression": [' + problem.expression_start + '],';
    str += ' "goalExpression": [' + problem.expression_goal + '],';
    str += ' "description": \"' + problem.description + '\",';
    //str += ' "timeCreated": [' + problem.timeCreated + '],';
    str += ' "createdBy": "' + user + '" }';
    console.log(str);
    http.send(str);
  } catch (e) {}
}
//delete_problem_from_db("RAND_978265029","Fractalyst");
function delete_problem_from_db(problem_id, acc_id) {
  let http = new XMLHttpRequest();
  http.open("DELETE", "http://localhost:8080/problems/" + problem_id, true);
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader('Account', acc_id);
  http.send();
}

function get_account_from_db(account_id, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      callback(new AccountInfo(JSON.parse(http.responseText)));
    }
  }
  http.open("GET", "http://localhost:8080/accounts/" + account_id, true);
  http.setRequestHeader('account', account_id);
  http.send();
}

//get_problems_from_db(2,res=>console.log(res));
function get_problems_from_db(queryAmt, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      callback(parseMultiProblem(JSON.parse(http.responseText)));
    }
  }
  http.open("GET", "http://localhost:8080/problems?number=" + queryAmt + "&sort=timeCreated", true);
  // TODO hard coded query for now
  http.setRequestHeader("Content-type", "application/json");
  http.send();
}
//get_lessons_from_db(2,res=>console.log(res));
function get_lessons_from_db(queryAmt, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      callback(JSON.parse(http.responseText));
    }
  }
  http.open("GET", "http://localhost:8080/lessons?number=" + queryAmt + "&sort=timeCreated", true);
  // TODO hard coded query for now
  http.setRequestHeader("Content-type", "application/json");
  http.send();
}
