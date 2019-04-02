import {globals} from './gui';
import {displayProblemFromDB} from './display_feature';
import {renderHist} from "./history_nav";
import {manipulatorVue} from "./manipulator_vue";

var problem_to_load = getProblemFromURL();
window.onload = () => {
  if (problem_to_load !== null) {
    displayProblemFromDB(problem_to_load, 'canvasContainer', null, (res, res2) => {
      onDisplay(res, res2);
    });
  }
};
window.onpopstate = (e) => {
  if (e.state) {
    problem_to_load = e.state;
    displayProblemFromDB(e.state);
  }
};

function onDisplay(res, containerId) {
  if (containerId === "canvasContainer") {
    globals.workingExpressionTree = res;
  } else if (containerId === "goalContainer") {
    let temp = document.getElementById("goalContainer").dataset.str;
  }
}

function getProblemFromURL() {
  let prob = (window.location.href).substr((window.location.href).indexOf('/manipulator/problems/'));
  if (prob.indexOf('manipulator/problems/') === -1 || prob === 'null' || prob === '' || prob === 'undefined') {
    //window.location.replace("../manipulator/problems/Getting%20Started");
    return null;
  }
  return prob.substr(22);
}

