import {mouse, globals} from './gui';
import {displayProblemFromDB} from './display_feature';
import {initNav} from "./navbar_creation";
import {addHistoryEntry, histAction} from "./history_nav";

var problem_to_load = getProblemFromURL();

window.onload = ()=>{
  initNav();
  initManipulatorNavButtons();
  changeMouseMode(0);
  if (problem_to_load !== null) {
    displayProblemFromDB(
        problem_to_load,
        'canvasContainer',
        'goalContainer',
        (res,res2)=>onDisplay(res, res2)
    );
  }
}
;
window.onpopstate = (e)=>{
  if (e.state) {
    problem_to_load = e.state;
    displayProblemFromDB(e.state);
  }
}
;

function updateCanvas(action) {
  //let canvas=document.getElementById("histNavCanvas");
  //if(action===0){//place dot
  //}else if(action===1){//go back one dot
  //}
}
function insertMenu(type) {
  if (type) {
    document.getElementById("manipulatorsSubPanel").style.display = "inline";
  } else {
    document.getElementById("manipulatorsSubPanel").style.display = "none";
  }
function onDisplay(res, containerId) {
  if (containerId === "canvasContainer") {
    globals.workingExpressionTree = res;
    addHistoryEntry(res);
  }
}

function changeMouseMode(num) {
  insertMenu(false);
  if (num === 0) {
    mouse.mode = "General Manipulation";
  } else if (num === 1) {
    mouse.mode = "Merging Literals";
  } else if (num === 2) {
    mouse.mode = "Distribution";
  }
}

function getProblemFromURL() {
  let prob = (window.location.href).substr((window.location.href).indexOf('/manipulator/problems/'));
  if (prob.indexOf('manipulator/problems/') === -1 || prob === 'null' || prob === '' || prob === 'undefined') {
    //window.location.replace("../manipulator/problems/Getting%20Started");
    alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
    return null;
  }
  return prob.substr(22);
}
