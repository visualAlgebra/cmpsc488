import {get_problems_from_db} from "./database_management";
import {createCardForProblem} from "./tree_card_creation";
import {displayProblemFromDBStruct, convertProblemInfoToImage} from "./display_feature";
import {initNav} from "./navbar_creation";

window.onload = ()=>{
  initNav();
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
    convertProblemInfoToImage(query[creation],creation+"_s", creation+"_g");
//     let temp1 = document.getElementById(creation + "_s");
//     let temp2 = document.getElementById(creation + "_g");
//     temp1.innerHTML = "placeholder for minified problem";
//     temp2.innerHTML = "placeholder for minified problem";
    probAmt++;
  }
}