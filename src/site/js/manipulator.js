var problem_to_load=getProblemFromURL();

window.onload = () => {
    displayProblemFromDB(problem_to_load,'canvas-container','goal-container');
};
window.onpopstate = (e) =>{
    if(e.state){
        problem_to_load=e.state;
        displayProblemFromDB(e.state);
    }
};


function getProblemFromURL(){
    let prob=(window.location.href).substr((window.location.href).lastIndexOf("/")+1).replace('.html','').replace('.json','');
    if(prob==='manipulator'){
        alert('ugh');
        //location.replace("Explorer.html");
        return;
    }
    if(prob===('null')||prob===''){
        alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
        return null;
    }
    return prob;
}