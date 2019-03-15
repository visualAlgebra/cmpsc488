import $ from "jquery";
import {decompress_string_js, Deserialize} from "./expression_tree";
import {get_problem_from_db} from "./database_management";

// Clears out the current container (given by `container_id`), renders the
// expression tree inside `container_id`.
export function displayExpressionTree(tree, containerId, callback) {
  let container=document.getElementById(containerId);
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.setAttribute('data-str',tree.toString());
  let temp=tree.render()[0];
  container.appendChild(temp);
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

String.prototype.splice = function(index, str) {
  return this.slice(0, index) + str + this.slice(index);
};

export function convertTreeToImage(treeStruct, container_id){
  let container=document.getElementById('pictureAttempt');

  let svg = document.createElement('svg');
  svg.xmlns="http://www.w3.org/2000/svg";
  svg.height="100";
  svg.width="100";
  
  const dom=treeStruct.render().html();
  var doc = new DOMParser().parseFromString(dom, 'text/html');
  var result = new XMLSerializer().serializeToString(doc);

  let mainDiv=document.createElement('div');
  mainDiv.className=treeStruct.orientation.splice(treeStruct.orientation.length/2,"-")+" "+treeStruct.kind;
  mainDiv.innerHTML=result;

  let foreign=document.createElement('foreignObject');
  foreign.width="100%";
  foreign.height="100%";
  foreign.appendChild(mainDiv);

  svg.appendChild(foreign);
  container.appendChild(svg);
}