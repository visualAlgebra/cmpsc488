import {globals, mouse} from './gui';
import {displayProblemFromDB, displayTreeFromDBStruct, displayProblemFromDBStruct} from './display_feature';
import {addHistoryEntry, histAction, clearHist, renderHist, setGoalTree} from "./history_nav";
import {Deserialize} from "./expression_tree";
import {createDummyProblem} from "./random_expression_creator";
import {manipulatorVue} from "./manipulator_vue";

var problem_to_load=getProblemFromURL();
window.onload=()=>{
  if(problem_to_load!==null){
    displayProblemFromDB(problem_to_load, 'canvasContainer', null, (res, res2)=>{
      onDisplay(res, res2);
    });
  }
};
window.onpopstate=(e)=>{
  if(e.state){
    problem_to_load=e.state;
    displayProblemFromDB(e.state);
  }
};


function restart(){
  displayTreeFromDBStruct(document.getElementById("restartButton").dataset.str, 'canvasContainer', res=>{
    alert("Restarted");
    clearHist();
    addHistoryEntry(document.getElementById("canvasContainer").dataset.str);
  });
}

function drawCanvas(){
  renderHist("histCanvas", document.getElementById("canvasContainer").dataset.str);
  renderHist("histCanvas", document.getElementById("canvasContainer").dataset.str);
}

function touchHistCanvas(x,y){
  console.log(x+", "+y);
}

function onDisplay(res, containerId){
  if(containerId==="canvasContainer"){
    globals.workingExpressionTree=res;
    addHistoryEntry(res);
  }else if(containerId==="goalContainer"){
    let temp=document.getElementById("goalContainer").dataset.str;
    setGoalTree(temp);
  }
}

function getProblemFromURL(){
  let prob=(window.location.href).substr((window.location.href).indexOf('/manipulator/problems/'));
  if(prob.indexOf('manipulator/problems/')=== -1||prob==='null'||prob===''||prob==='undefined'){
    //window.location.replace("../manipulator/problems/Getting%20Started");
    alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
    return null;
  }
  return prob.substr(22);
}

