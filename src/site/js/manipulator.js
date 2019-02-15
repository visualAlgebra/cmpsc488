
var problem_to_load=getProblemFromURL();

window.onload = () => {
    get_problem_from_db(problem_to_load, res => {
        decompress_string_js(res.expression_start,decomp => {
            $("#canvas-container").append(Deserialize(decomp).render());
        });
    });
};

function getProblemFromURL(){
    let prob=(window.location.href).substr((window.location.href).lastIndexOf("/")+1).replace('.html','').replace('.json','');
    if(prob==='manipulator'){
        return null;
    }
    return prob;
}