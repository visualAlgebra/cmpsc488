document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});
window.onload = () => {
    getInitialProblemsToDisplay();
};

function getInitialProblemsToDisplay(){
    //old:
    let empty=document.getElementsByName("problem_holder");
    let SAMPLE_PROBS=["RAND_723390538","RAND_492206274"];
    for(let x=0; x<empty.length; x+=2){
        displayProblemFromDB(SAMPLE_PROBS[Math.floor(x/2)],empty[x].id, empty[x].id+'g');
    }


    //new:
    //get_problems_from_db(4,res=>displayProblems(res));
}
function displayProblems(query){
    
}