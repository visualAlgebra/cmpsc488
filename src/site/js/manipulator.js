import {globals, mouse} from './gui';
import {displayProblemFromDB, displayTreeFromDBStruct, displayProblemFromDBStruct} from './display_feature';
import {initNav} from "./navbar_creation";
import {addHistoryEntry, histAction, clearHist, renderHist, setGoalTree} from "./history_nav";
import {Deserialize} from "./expression_tree";
import {manipulatorWindow} from "./manipulator_window";
import {createDummyProblem} from "./random_expression_creator";

var problem_to_load=getProblemFromURL();
window.onload=()=>{
  initNav();
  changeMouseMode(0);
  if(problem_to_load!==null){
    displayProblemFromDB(problem_to_load, 'canvasContainer', 'goalContainer', (res, res2)=>{
      onDisplay(res, res2);
  });
  }
  document.getElementById("backwardHistButton").addEventListener("click", function(e){
    let t=histAction(false);
    if(t!==null){
      globals.workingExpressionTree=Deserialize(t);
      displayTreeFromDBStruct(t,'canvasContainer');
    }
  });
  document.getElementById("forwardHistButton").addEventListener("click", function(e){
    let t=histAction(true);
    if(t!==null){
      globals.workingExpressionTree=Deserialize(t);
      displayTreeFromDBStruct(t,'canvasContainer');
    }
  });
  document.getElementById("manipGenMan").addEventListener("click", function(e){
    changeMouseMode(0);
  });
  document.getElementById("manipMerLit").addEventListener("click", function(e){
    changeMouseMode(1);
  });
  document.getElementById("manipDistri").addEventListener("click", function(e){
    changeMouseMode(2);
  });
  document.getElementById("manipInsert").addEventListener("click", function(e){
    insertMenu(true);
  });
  document.getElementById("histCanvasOpener").addEventListener("click", function(e){
    drawCanvas();
  });
  document.getElementById("restartButton").addEventListener("click", function(e){
    restart();
  });
  document.getElementById("_DEBUG_INSTANCES").addEventListener("click", async function (e) {
    console.log('_DEBUG_TRIGGERED');
    console.log("Current tree: " + document.getElementById("canvasContainer").dataset.str);
    console.log(globals.workingExpressionTree);
    console.log('_DEBUG_FINISHED');
  });
  document.getElementById("histCanvas").addEventListener("click", function(e){
    touchHistCanvas(e.x,e.y);
  });
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

function insertMenu(type){
  if(type){
    document.getElementById("manipulatorsSubPanel").style.display="inline";
  }else{
    document.getElementById("manipulatorsSubPanel").style.display="none";
  }
}

function onDisplay(res, containerId){
  if(containerId==="canvasContainer"){
    globals.workingExpressionTree=res;
    manipulatorWindow.workingExpressionTree = res;
    addHistoryEntry(res);
    document.getElementById("restartButton").setAttribute("data-str", res.toString());
  }else if(containerId==="goalContainer"){
    let temp=document.getElementById("goalContainer").dataset.str;
    setGoalTree(temp);
  }
}

function changeMouseMode(num){
  insertMenu(false);
  if(num===0){
    mouse.mode="General Manipulation";
  }else if(num===1){
    mouse.mode="Merging Literals";
  }else if(num===2){
    mouse.mode="Distribution";
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

