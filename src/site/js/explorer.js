window.onload = ()=>{
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
    for (let q in query.queryResults) {
        if (probAmt >= problemCount) {
            break;
        }
        q = parseInt(q);
        let str="";
        for(let key in query.queryResults[q]){
            str=key;
        }
        filldiv.appendChild(createCardForProblem(str, probAmt));
        displayProblemFromDB(str, q + "_s", q + "_g");
        probAmt++;
    }
}
//<div class="col s12 m6 l4">
//                <div class="card blue-grey darken-1">
//                    <div class="card-content white-text">
//                        <span class="card-title">
//                            <i class="material-icons left">folder</i>
//                            Lesson 1
//                        </span>
//                        <div class="row">
//                            <div class="col">
//                                <li>Problem 1
//    								<div name="problem_holder" id="l1p1"></div>
//                                </li>
//                            </div>
//                            <div class="col">
//                                <li>Problem 1 Goal
//    								<div name="problem_holder" id="l1p1g"></div>
//                                </li>
//                            </div>
//                        </div>
//                    </div>
//                </div>
//    		</div>
