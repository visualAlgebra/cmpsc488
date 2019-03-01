//user_profile_page/accounts/account_id
//{"accountID":"TEST_USER_0","timeCreated":"120000T101010",
//"creations":["/problems/TEST_PROBLEM_0", "/lessons/TEST_LESSON_0"]}
//
var account_to_load = getAccountFromURL();

window.onload = ()=>{
  if (account_to_load !== null) {
    get_account_from_db(account_to_load, res=>covertToInfo(res));
  }
}
;

var probAmt = 0;
var lessAmt = 0;
function covertToInfo(res){
  let les=[];
  for(let x in res.lessons){
    x=parseInt(x);
    let k=res.lessons[x];
    les[x]=new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description);
  }
  let prob=[];
  for(let x in res.problems){
    x=parseInt(x);
    let k=res.problems[x];
    prob[x]=new ProblemInfo(k.problemID, k.startExpression, k.goalExpression, k.description, k.timeCreated);
  }
  res.lessons=les;
  res.problems=prob;
  fillPage(res);
}
function fillPage(accInfo) {
  let id_field = document.getElementById('userAccountIdField');
  id_field.innerHTML = accInfo.id;
  let bio_field = document.getElementById('bioField');
  bio_field.innerHTML=accInfo.bio;
  let creation_date_field = document.getElementById('creationDateField');
  creation_date_field.innerHTML = "Creation date: " + new Date(accInfo.timeCreated);
  let problems_amt = document.getElementById('problemsSavedAmountField');
  let lessons_amt = document.getElementById('lessonsSavedAmountField');
  problems_amt.innerHTML = "Problems: " + accInfo.problems.length;
  lessons_amt.innerHTML = "Lessons: " + accInfo.lessons.length;
  //lessons
  let filldiv = document.getElementById("creationHolder");
  for(let lesson in accInfo.lessons){
    lesson = parseInt(lesson);
    createCollectionItemForLesson(accInfo.lessons[lesson], "lessonHolder");
    lessAmt++;
  }
  //problems
  for(let problem in accInfo.problems){
    problem = parseInt(problem);
    filldiv.appendChild(createCardForProblem(accInfo.problems[problem].problemID, probAmt));
    displayProblemFromDBStruct(accInfo.problems[problem], problem + "_s", problem + "_g");
    probAmt++;
  }
}

class AccountInfo {
  constructor(json) {
    this.id = json.accountID;
    this.bio = json.bio;
    this.lessons = json.lessons;
    this.problems = json.problems;
    this.timeCreated = json.timeCreated;
  }
}
function getAccountFromURL() {
  let acc = (window.location.href).substr((window.location.href).indexOf('/user_profile_page'));
  if (acc.indexOf('user_profile_page/accounts/') === -1 || acc === 'null' || acc === '' || acc === 'undefined') {
    //location.replace("../Explorer.html");
    alert("Error(user_profile_page.js): Please enter an account id after \"user_profile_page/accounts/\" in the URL or select a problem from another page");
    return null;
  }
  return acc.substring(acc.lastIndexOf('/') + 1, acc.length);
}