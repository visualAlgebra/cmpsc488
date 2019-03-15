import $ from "jquery";
import {decompress_string_js, Deserialize} from "./expression_tree";
import {get_problem_from_db} from "./database_management";

// Clears out the current container (given by `container_id`), renders the
// expression tree inside `container_id`.
export function displayExpressionTree(tree, containerId, callback) {
    const container = $("#" + containerId);
    container.attr("data-str", tree.toString());
    container.empty();
    const dom = tree.render();
    container.append(dom);
    convertTreeToImage(tree);//attempt
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

export function convertTreeToImage(treeStruct, container_id){
  let container=document.getElementById('pictureAttempt');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const tempImg = document.createElement('img');
  tempImg.addEventListener('load', function(e){
    ctx.drawImage(e.target, 0, 0);
    targetImg.src = canvas.toDataURL();
  });
  const dom=treeStruct.render().html();
  var doc = new DOMParser().parseFromString(dom, 'text/html');
  var result = new XMLSerializer().serializeToString(doc);
  tempImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><foreignObject width="100%" height="100%">'+result+'</foreignObject></svg>');
  
  const targetImg = document.createElement('img');
  container.appendChild(targetImg);
}