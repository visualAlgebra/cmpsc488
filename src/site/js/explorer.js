import {get_problems_from_db} from "./database_management";
import {createCardForProblem} from "./tree_card_creation";
import {displayProblemFromDBStruct} from "./display_feature";
import {initNav} from "./navbar_creation";

window.onload = ()=>{
    initNav();
    getInitialProblemsToDisplay();
}
;
var problemCount=4;
function getInitialProblemsToDisplay() {
    get_problems_from_db(problemCount, res=>fillProblems(res));
}
function fillProblems(query) {
    let filldiv = document.getElementById("creationHolder");
    let probAmt = 0;
    for (let q in query) {
        if (probAmt >= problemCount) {
            break;
        }
        q = parseInt(q);
        filldiv.appendChild(createCardForProblem(query[q].problemID, probAmt));
        displayProblemFromDBStruct(query[q], q + "_s", q + "_g");
        probAmt++;
    }
}