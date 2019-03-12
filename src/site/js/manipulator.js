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
function initManipulatorNavButtons() {
  let manipdivrow = document.createElement("div");
  manipdivrow.className = "row";
  let btnNames = ["Hint", "Share", "Restart", "Undo", "Redo"];
  let iconNames = ["compare_arrows", "share", "rotate_left", "undo", "redo"];

  for (let x = 0; x < btnNames.length; x++) {
    let a = document.createElement("a");
    a.className = "tab waves-effect waves-light btn col";
    if (x === 3) {
      a.onclick = function() {
        histAction(0);
      }
      ;
    } else if (x === 4) {
      a.onclick = function() {
        histAction(1);
      }
      ;
    }
    let i = document.createElement("i");
    i.className = "material-icons left";
    i.innerHTML = iconNames[x];
    a.appendChild(i);
    a.innerHTML += btnNames[x];
    manipdivrow.appendChild(a);
  }
  document.getElementById("navbarLocation").appendChild(manipdivrow);

}

function onDisplay(res, containerId) {
  if (containerId === "canvasContainer") {
    globals.workingExpressionTree = res;
    addHistoryEntry(res);
  }
}

function changeMouseMode(num) {
  if (num === 0) {
    mouse.mode = "General Manipulation";
  } else if (num === 1) {
    mouse.mode = "Merging Literals";
  } else if (num === 2) {
    mouse.mode = "Distribution";
  }
}

function getProblemFromURL() {
  let prob = (window.location.href).substr((window.location.href).indexOf('/manipulator'));
  if (prob.indexOf('manipulator/problems/') === -1 || prob === 'null' || prob === '' || prob === 'undefined') {
    //window.location.replace("../manipulator/problems/Getting%20Started");
    alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
    return null;
  }
  return prob.substring(prob.lastIndexOf('/'), prob.length);
}
