function get_problem_from_db(problem_id, callback){
  let http=new XMLHttpRequest();
  http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          callback(new ProblemInfo(problem_id,JSON.parse(http.responseText).startExpression,JSON.parse(http.responseText).goalExpression));
        }
    }
  http.open("GET", "http://localhost:8080/problems/"+problem_id);
  http.send();
}
function post_problem_from_site(problem, callback){
  let http=new XMLHttpRequest();
  http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          callback(true);
        }
    }
  http.open("POST", "http://localhost:8080/problems/"+problem.problem_id);
  http.setRequestHeader("Content-type", "application/json");
  user="Fractalyst, ofcourse, why would any other user be here?";
  let str='{ "problemName": "'+problem.problem_id+'\",';
  str+=      ' "startExpression": ['+problem.expression_start+'],';
  str+=      ' "goalExpression": ['+problem.expression_goal+'],';
  str+=      ' "createdBy": "'+user+'" }';
  console.log(str);
  http.send(str);
}