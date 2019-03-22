import {globals} from './gui';
import {displayTreeFromDBStruct} from './display_feature';
import {addHistoryEntry, clearHist, histAction, renderHist, setGoalTree} from "./history_nav";
import {Deserialize} from "./expression_tree";
import {manipulatorWindow} from "./manipulator_window";
import {manipulator_Vue} from "./manipulator_vue";

export function historyAction(bool){
  let t=histAction(bool);
  if(t!==null){
    globals.workingExpressionTree=Deserialize(t);
    displayTreeFromDBStruct(t, 'canvasContainer');
  }
}

export function restart(){
  displayTreeFromDBStruct(document.getElementById("restartButton").dataset.str, 'canvasContainer', res=>{
    alert("Restarted");
    clearHist();
    addHistoryEntry(document.getElementById("canvasContainer").dataset.str);
  });
}

export function drawCanvas(){
  renderHist("histCanvas", document.getElementById("canvasContainer").dataset.str);
  renderHist("histCanvas", document.getElementById("canvasContainer").dataset.str);
}

function touchHistCanvas(x, y){
  console.log(x+", "+y);
}

export function onDisplay(res, containerId){
  if(containerId==="canvasContainer"){
    globals.workingExpressionTree=res;
    manipulatorWindow.workingExpressionTree=res;
    addHistoryEntry(res);
    document.getElementById("restartButton").setAttribute("data-str", res.toString());
  }else if(containerId==="goalContainer"){
    let temp=document.getElementById("goalContainer").dataset.str;
    setGoalTree(temp);
  }
}
