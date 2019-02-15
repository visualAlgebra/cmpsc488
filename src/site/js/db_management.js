function get_problem_from_db(problem_id, callback){
  let data="";
  let http=new XMLHttpRequest();
  http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          callback(new ProblemInfo(problem_id,JSON.parse(http.responseText).startExpression,JSON.parse(http.responseText).goalExpression));
        }
    }
  http.open("GET", "http://localhost:8080/problems/"+problem_id);
  http.send();
}
