window.onload = () => {
    getElementsToFill();
};
//put undefined in place of argument you want to skip and it will be default
function displayProblemFromStruct(problem, container_id_working="canvas-container", container_id_goal="goal-container"){
    if(container_id_working!==null){
        decompress_string_js(problem.expression_start,decomp => {
            let working_canvas = document.getElementById(container_id_working);
            while (working_canvas.lastChild) {
                working_canvas.removeChild(working_canvas.lastChild);
            }
            $(working_canvas).append(Deserialize(decomp).render());
        });
    }
    if(container_id_goal!==null){
        decompress_string_js(problem.expression_start,decomp => {
            let goal_canvas = document.getElementById(container_id_goal);
            while (goal_canvas.lastChild) {
                goal_canvas.removeChild(goal_canvas.lastChild);
            }
            $(goal_canvas).append(Deserialize(decomp).render());
        });
    }
}
//put undefined in place of argument you want to skip and it will be default
function displayProblemFromDB(problem_id, container_id_working="canvas-container", container_id_goal="goal-container"){
    get_problem_from_db(problem_id, res => {
        if(container_id_working!==undefined){
        decompress_string_js(res.expression_start,decomp => {
            let working_canvas = document.getElementById(container_id_working);
            while (working_canvas.lastChild) {
                working_canvas.removeChild(working_canvas.lastChild);
            }
            $(working_canvas).append(Deserialize(decomp).render());
            });
        }
        if(container_id_goal!==undefined){
        decompress_string_js(res.expression_goal,decomp => {
            let goal_canvas = document.getElementById(container_id_goal);
            while (goal_canvas.lastChild) {
                goal_canvas.removeChild(goal_canvas.lastChild);
            }
            $(goal_canvas).append(Deserialize(decomp).render());
        });
        }
    });
}

function getElementsToFill(){
    let empty=document.getElementsByName("problem_holder");
    getProblemsToDisplay(empty);
}

function getProblemsToDisplay(arrElements){
    let SAMPLE_PROBS=["RAND_723390538","RAND_492206274"];
    for(let x=0; x<arrElements.length; x+=2){
        displayProblemFromDB(SAMPLE_PROBS[x],arrElements[x].id, arrElements[x].id.substr(2)+"g1");
    }
}