
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
//put undefined in place of argument you want to skip and it will be default
function displayProblemFromStruct(problem, container_id_working="canvas-container", container_id_goal="goal-container"){
    if(problem_to_load!==null){
        problem_to_load=null;
    }else{
        history.pushState(problem_id, undefined, '/manipulator/problems/'+problem_id);
    }
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
    if(problem_to_load!==null){
        problem_to_load=null;
    }else{
        history.pushState(problem_id, undefined, '/manipulator/problems/'+problem_id);
    }
    get_problem_from_db(problem_id, res => {
        decompress_string_js(res.expression_start,decomp => {
            if(container_id_working!==null){
                let working_canvas = document.getElementById(container_id_working);
                while (working_canvas.lastChild) {
                    working_canvas.removeChild(working_canvas.lastChild);
                }
                $(working_canvas).append(Deserialize(decomp).render());
            }
        });
        decompress_string_js(res.expression_goal,decomp => {
            if(container_id_working!==null){
                let goal_canvas = document.getElementById(container_id_goal);
                while (goal_canvas.lastChild) {
                    goal_canvas.removeChild(goal_canvas.lastChild);
                }
                $(goal_canvas).append(Deserialize(decomp).render());
            }
        });
    });
}

function getProblemFromURL(){
    let prob=(window.location.href).substr((window.location.href).lastIndexOf("/")+1).replace('.html','').replace('.json','');
    if(prob==='manipulator'){
        return null;
    }
    return prob;
}