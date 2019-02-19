var problem_to_load=getProblemFromURL();

window.onload = () => {
    if(problem_to_load!==null){
        displayProblemFromDB(problem_to_load,'canvas-container','goal-container');
    }
};

window.onpopstate = (e) =>{
    if(e.state){
        problem_to_load=e.state;
        displayProblemFromDB(e.state);
    }
};

function getProblemFromURL(){
    let prob=(window.location.href).substr((window.location.href).indexOf('/manipulator'));
    if(prob.indexOf('manipulator/problems/')===-1||prob==='null'||prob===''||prob==='undefined'){
        //location.replace("../Explorer.html");
        alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
        return null;
    }
    return prob.substring(prob.lastIndexOf('/'),prob.length);
}