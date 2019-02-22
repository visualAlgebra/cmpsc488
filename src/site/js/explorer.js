document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});
window.onload = () => {
    getProblemsToDisplay();
};

function getProblemsToDisplay(){
    let empty=document.getElementsByName("problem_holder");
    let SAMPLE_PROBS=["RAND_723390538","RAND_492206274"];
    for(let x=0; x<empty.length; x+=2){
        displayProblemFromDB(SAMPLE_PROBS[Math.floor(x/2)],empty[x].id, empty[x].id+'g');
    }
}