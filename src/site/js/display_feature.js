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
  convertTreeToImage(tree,'pictureAttempt');//attempt
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

export function convertProblemInfoToImage(info, container_id_working, container_id_goal, callback){
  if(container_id_working!==null){
        decompress_string_js(info.expression_start,decomp => {
            convertTreeToImage(Deserialize(decomp),container_id_working, callback)});
    }
    if(container_id_goal!==null){
        decompress_string_js(info.expression_goal,decomp => {
            convertTreeToImage(Deserialize(decomp),container_id_goal, callback)});
    }
}

export function convertTreeToImage(treeStruct, container_id){
  let container=document.getElementById(container_id);
  let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  // svg.setAttribute("viewbox","0 0 330 300");
  svg.setAttribute("height",container.getAttribute("height"));
  svg.setAttribute("width",container.getAttribute("height"));
  const dom=treeStruct.render().html();
  var doc = new DOMParser().parseFromString(dom, 'text/html');
  var result = new XMLSerializer().serializeToString(doc);

//   const dom = treeStruct.render();

  let mainDiv=document.createElement('div');
  mainDiv.className=treeStruct.orientation.splice(treeStruct.orientation.length/2,"-")+" "+treeStruct.kind;
  mainDiv.innerHTML=result;
//   $(mainDiv).append(dom);

  let boxDiv=document.createElement("div");
  boxDiv.className="myBox";
  boxDiv.appendChild(mainDiv)

  let foreign=document.createElementNS("http://www.w3.org/2000/svg",'foreignObject');
  foreign.setAttribute("height",container.getAttribute("height"));
  foreign.setAttribute("width",container.getAttribute("height"));
  // foreign.setAttribute("transform","scale(1,1)");
  foreign.appendChild(boxDiv);

  svg.appendChild(foreign);

  container.appendChild(svg);
}