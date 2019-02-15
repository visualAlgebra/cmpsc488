
var problem_to_load=getProblemFromURL();

window.onload = () => {
    displayProblem(problem_to_load);
};

function displayProblem(problem){
    var canvas = document.getElementById("canvas-container");
    while (canvas.lastChild) {
      canvas.removeChild(canvas.lastChild);
    }
    if(problem.toString().indexOf('_PROBLEM')===1){
        decompress_string_js(problem.expression_start,decomp => {
            $("#canvas-container").append(Deserialize(decomp).render());
        });
    }else{
        get_problem_from_db(problem, res => {
            decompress_string_js(res.expression_start,decomp => {
                $("#canvas-container").append(Deserialize(decomp).render());
            });
        });
    }
}

function getProblemFromURL(){
    let prob=(window.location.href).substr((window.location.href).lastIndexOf("/")+1).replace('.html','').replace('.json','');
    if(prob==='manipulator'){
        return null;
    }
    return prob;
}