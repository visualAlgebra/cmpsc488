document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});
window.onload = () => {
    getElementsToFill();
};
function getElementsToFill(){
    let empty=document.getElementsByName("problem_holder");
    getProblemsToDisplay(empty);
}

function getProblemsToDisplay(arrElements){
    let SAMPLE_PROBS=["RAND_723390538","RAND_492206274"];
    for(let x=0; x<arrElements.length; x+=2){
        displayProblemFromDB(SAMPLE_PROBS[Math.floor(x/2)],arrElements[x].id, arrElements[x].id+'g');
    }
}