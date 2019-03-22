import {decompress_string_js, Deserialize} from "./expression_tree";
import {get_problem_from_db} from "./database_management";
// Clears out the current container (given by `container_id`), renders the
// expression tree inside `container_id`.
/*
Use this function to pass (upper-most tag of tree, string, callback function)
 */
export function displayExpressionTree(tree, containerId, callback){//TODO READY TO BE DELETED ONCE THE MAIN TREE CAN BE MANIPULATED
  let container=document.getElementById(containerId);
  while(container.firstChild){
    container.removeChild(container.firstChild);
  }
  container.setAttribute('data-str', tree.toString());
  let temp=tree.render()[0];
  container.appendChild(temp);
  if(callback){
    callback(tree, containerId);
  }
}

/*
Use this function to pass (serialized-tree string, string, callback function)
                           =/= null                =/= "null", or "null"
 */
export function displayTreeFromDBStruct(tree, container_id, callback){//TODO READY TO BE DELETED ONCE THE MAIN TREE CAN BE MANIPULATED
  displayExpressionTree(Deserialize(tree), container_id, callback);
}

/*
Use this function to pass (problemstring, working string, goal string, callback function)
                           =/= null           or "null"       or "null"    or "null"
 */
export function displayProblemFromDBStruct(problem, container_id_working, container_id_goal, callback){//TODO READY TO BE DELETED ONCE THE MAIN TREE CAN BE MANIPULATED
  if(container_id_working!==null){
    decompress_string_js(problem.expression_start, decomp=>{
      displayTreeFromDBStruct(decomp, container_id_working, callback)
    });
  }
  if(container_id_goal!==null){
    decompress_string_js(problem.expression_goal, decomp=>{
      displayTreeFromDBStruct(decomp, container_id_goal, callback)
    });
  }
}

export function singleExpressionDecompression(expressionArr, callback){
  decompress_string_js(expressionArr, decomp=>{
    callback(decomp);
  });
}

/*
Use this function to pass (problem_id string, working string, goal string, callback function)
                           =/= null           or "null"       or "null"    or "null"
 */
export function displayProblemFromDB(problem_id, container_id_working, container_id_goal, callback){//TODO READY TO BE DELETED ONCE THE MAIN TREE CAN BE MANIPULATED
  get_problem_from_db(problem_id, res=>{
    displayProblemFromDBStruct(res, container_id_working, container_id_goal, callback);
  });
}

////////////////////////////////////   Singles

export function getProblemFromDBVue(problem_id, callback){
  get_problem_from_db(problem_id, res=>{
    decompress_string_js(res.expression_start, decomp=>{
      callback(decomp, 2);
    });
    callback(res.expression_goal, 3);
    callback(res, 1);
  });
}
