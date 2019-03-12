window.onload = ()=>{
  getInitialProblemsToDisplay();
}
;
var problemCount = 4;
function getInitialProblemsToDisplay() {
  get_problems_from_db(problemCount, res=>fillProblems(res));
}
function fillProblems(query) {
  let filldiv = document.getElementById("creationHolder");
  let probAmt = 0;
  for (let creation in query) {
    if (probAmt >= problemCount) {
      break;
    }
    creation = parseInt(creation);
    filldiv.appendChild(createCardForProblem(query[creation].problemID, probAmt));
    //displayProblemFromDBStruct(prob, creation + "_s", creation + "_g");
    let temp1 = document.getElementById(creation + "_s");
    let temp2 = document.getElementById(creation + "_g");
    temp1.innerHTML = "placeholder for minified problem";
    temp2.innerHTML = "placeholder for minified problem";
    probAmt++;
  }
}
