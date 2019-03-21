import {get_problems_from_db} from "./database_management";
import {createCardForProblem} from "./tree_card_creation";
import {displayProblemFromDBStruct, convertProblemInfoToImage} from "./display_feature";
import {explorer_vue} from "./explorer_vue";

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
    convertProblemInfoToImage(query[creation],creation+"_s", creation+"_g");
    probAmt++;
  }
}