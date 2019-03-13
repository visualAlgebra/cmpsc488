import {globals, mouse} from './gui';
import {displayProblemFromDB} from './display_feature';
import {initNav} from "./navbar_creation";
import {addHistoryEntry, histAction} from "./history_nav";

var problem_to_load=getProblemFromURL();
window.onload=()=>{
  initNav();
  changeMouseMode(0);
  if(problem_to_load!==null){
    displayProblemFromDB(problem_to_load, 'canvasContainer', 'goalContainer', (res, res2)=>onDisplay(res, res2));
  }
  document.getElementById("backwardHistButton").addEventListener("click", function(e){
    histAction(0);
  });
  document.getElementById("forwardHistButton").addEventListener("click", function(e){
    histAction(1);
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
    updateCanvas();
  });
  document.getElementById("restartButton").addEventListener("click", function(e){
    restart();
  });
};
window.onpopstate=(e)=>{
  if(e.state){
    problem_to_load=e.state;
    displayProblemFromDB(e.state);
  }
};

function restart(){
  //displayTreeFromDBStruct(document.getElementById("restartButton").dataset.str);
}

function updateCanvas(action){
  //let canvas=document.getElementById("histNavCanvas");
  //if(action===0){//place dot
  //}else if(action===1){//go back one dot
  //}
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
    addHistoryEntry(res);
    //document.getElementById("restartButton")..setAttribute("data-str", res.toString());
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

