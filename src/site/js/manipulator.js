var problem_to_load=getProblemFromURL();

window.onload = () => {
    displayProblemFromDB(problem_to_load);
};
window.onpopstate = (e) =>{
    if(e.state){
        problem_to_load=e.state;
        displayProblemFromDB(e.state);
    }
};


function getProblemFromURL(){
    let prob=(window.location.href).substr((window.location.href).lastIndexOf("/")+1).replace('.html','').replace('.json','');
    if(prob===('null')||prob==='manipulator'||prob===''){
        alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
        return null;
    }
    return prob;
}