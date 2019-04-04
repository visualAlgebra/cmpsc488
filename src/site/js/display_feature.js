import {decompress_string_js} from "./expression_tree";
import {get_problem_from_db} from "./database_management";

export function singleExpressionDecompression(expressionArr, callback){
  decompress_string_js(expressionArr, decomp=>{
    callback(decomp);
  });
}

export function getProblemFromDBVue(problem_id, callback){
  get_problem_from_db(problem_id, res=>{
    decompress_string_js(res.expression_start, decomp=>{
      callback(decomp, 2);
    });
    callback(res.expression_goal, 3);
    callback(res, 1);
  });
}
