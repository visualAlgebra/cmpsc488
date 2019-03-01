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