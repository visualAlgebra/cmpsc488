let workingExpressionTree = null;
let goalExpressionTree = null;

// Clears out the current container (given by `container_id`), renders the
// expression tree inside `container_id`.
function displayExpressionTree(tree, containerId) {
    const container = $("#" + containerId);
    container.empty();
    const dom = tree.render();
    container.append(dom);
}

//put undefined in place of argument you want to skip and it will be default
function displayProblemFromStruct(problem, container_id_working, container_id_goal){
    if(container_id_working!==null){
        decompress_string_js(problem.expression_start,decomp => {
            workingExpressionTree = Deserialize(decomp);
            displayExpressionTree(workingExpressionTree, container_id_working);
        });
    }
    if(container_id_goal!==null){
        decompress_string_js(problem.expression_goal,decomp => {
            goalExpressionTree = Deserialize(decomp);
            displayExpressionTree(goalExpressionTree, container_id_goal);
        });
    }
}
//put undefined in place of argument you want to skip and it will be default
function displayProblemFromDB(problem_id, container_id_working, container_id_goal){
   get_problem_from_db(problem_id, res => {
        displayProblemFromStruct(res, container_id_working, container_id_goal);
    });
}