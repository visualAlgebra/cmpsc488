import {get_account_from_db} from "./database_management";
import {initNav} from "./navbar_creation";
import {createCardForProblem, createCollectionItemForLesson} from "./tree_card_creation";
import {LessonInfo, ProblemInfo} from "./expression_tree";

//user_profile_page/accounts/account_id
//{"accountID":"TEST_USER_0","timeCreated":"120000T101010",
//"creations":["/problems/TEST_PROBLEM_0", "/lessons/TEST_LESSON_0"]}
//
export var account_to_load = getAccountFromURL();

window.onload = ()=>{
  initNav();
  if (account_to_load !== null) {
    get_account_from_db(account_to_load, res=>covertToInfo(res));
  }
}
;

var probAmt = 0;
var lessAmt = 0;
export function covertToInfo(res){
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
export function fillPage(accInfo) {
  let id_field = document.getElementById('userAccountIdField');
  id_field.innerHTML = accInfo.id;
  let bio_field = document.getElementById('bioField');
  bio_field.innerHTML="Bio: " + accInfo.bio;
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
    //displayProblemFromDBStruct(accInfo.problems[problem], problem + "_s", problem + "_g");
      let temp1=document.getElementById(problem+"_s");
      let temp2=document.getElementById(problem + "_g");
      temp1.innerHTML="placeholder for minified problem";
      temp2.innerHTML="placeholder for minified problem";
    //TODO Display only minified problem (above)
    probAmt++;
  }
}

export function getAccountFromURL() {
  let acc = (window.location.href).substr((window.location.href).indexOf('/profile'));
  if (acc.indexOf('profile/accounts/') === -1 || acc === 'null' || acc === '' || acc === 'undefined') {
    //location.replace("../Explorer.html");
    alert("Error(profile.js): Please enter an account id after \"profile/accounts/\" in the URL or select a problem from another page");
    return null;
  }
  return acc.substring(acc.lastIndexOf('/') + 1, acc.length);
}