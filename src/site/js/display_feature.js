import $ from "jquery";
import {decompress_string_js, Deserialize} from "./expression_tree";
import {get_problem_from_db} from "./database_management";

// Clears out the current container (given by `container_id`), renders the
// expression tree inside `container_id`.
export function displayExpressionTree(tree, containerId, callback) {
    const container = $("#" + containerId);
    container.empty();
    const dom = tree.render();
    container.append(dom);
    if (callback) {
        callback(tree, containerId);
    }
}

export function displayTreeFromDBStruct(tree, container_id, callback){
   displayExpressionTree(Deserialize(tree), container_id, callback);
}

//put undefined in place of argument you want to skip and it will be default
export function displayProblemFromDBStruct(
    problem,
    container_id_working,
    container_id_goal,
    callback
) {
    if(container_id_working!==null){
        decompress_string_js(problem.expression_start,decomp => {
            displayTreeFromDBStruct(decomp,container_id_working, callback)});
    }
    if(container_id_goal!==null){
        decompress_string_js(problem.expression_goal,decomp => {
            displayTreeFromDBStruct(decomp,container_id_goal, callback)});
    }
}
//put undefined in place of argument you want to skip and it will be default
export function displayProblemFromDB(
    problem_id,
    container_id_working,
    container_id_goal,
    callback
) {
   get_problem_from_db(problem_id, res => {
        displayProblemFromDBStruct(res, container_id_working, container_id_goal, callback);
    });
}