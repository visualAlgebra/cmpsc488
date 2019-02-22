function get_problem_from_db(problem_id, callback){
  let http=new XMLHttpRequest();
  http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          callback(new ProblemInfo(problem_id,JSON.parse(http.responseText).startExpression,JSON.parse(http.responseText).goalExpression));
        }
    }
  http.open("GET", "http://localhost:8080/problems/"+problem_id, true);
  http.send();
}
//{"problems": ["TEST_PROBLEM_1", "TEST_PROBLEM_2", "TEST_PROBLEM_3"], "creatorAccountID": "TEST_USER_1"}
function get_lesson_from_db(lesson_id, callback){
  let http=new XMLHttpRequest();
  http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          callback(new LessonInfo(lesson_id,JSON.parse(http.responseText).problems));
        }
    }
  http.open("GET", "http://localhost:8080/lessons/"+lesson_id, true);
  http.send();
}

function post_problem_from_site(problem){
  try{
    let http=new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/problems/"+problem.problem_id, true);
    http.setRequestHeader("Content-type", "application/json");
    user="Fractalyst, ofcourse, why would any other user be here?";
    http.setRequestHeader("Account", user);
    let str='{ "problemName": "'+problem.problem_id+'\",';
    str+=      ' "startExpression": ['+problem.expression_start+'],';
    str+=      ' "goalExpression": ['+problem.expression_goal+'],';
    str+=      ' "createdBy": "'+user+'" }';
    console.log(str);
    http.send(str);
  }
  catch(e){}
}
//delete_problem_from_db("RAND_978265029","Fractalyst");
function delete_problem_from_db(problem_id, acc_id){
  let http=new XMLHttpRequest();
  http.open("DELETE", "http://localhost:8080/problems/"+problem_id, true);
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader('Account', acc_id);
  http.send();
}

function get_account_from_db(account_id, callback){
  let http=new XMLHttpRequest();
  http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          callback(new AccountInfo(account_id,
            JSON.parse(http.responseText).timeCreated,
            JSON.parse(http.responseText).creations));
        }
    }
  http.open("GET", "http://localhost:8080/accounts/"+account_id, true);
  http.setRequestHeader('account', account_id);
  http.send();
}

//get_query_problems_from_db(2,res=>console.log(res));
function get_problems_from_db(queryAmt, callback){
  let http=new XMLHttpRequest();
  http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          console.log(http.responseText);
        }
    }
  http.open("GET", "http://localhost:8080/problems?number="+queryAmt+"&sort=timeCreated", true);// TODO hard coded query for now
  http.setRequestHeader("Content-type", "application/json");
  http.send();
}