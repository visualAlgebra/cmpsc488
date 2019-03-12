var problem_to_load = getProblemFromURL();
var hist;

window.onload = ()=>{
  initManipulatorNavButtons();
  changeMouseMode(0);
  if (problem_to_load !== null) {
    displayProblemFromDB(problem_to_load, 'canvasContainer', 'goalContainer', (res,res2)=>onDisplay(res, res2));
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
    workingExpressionTree = res;
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
  let prob = (window.location.href).substr((window.location.href).indexOf('/manipulator/problems/'));
  if (prob.indexOf('manipulator/problems/') === -1 || prob === 'null' || prob === '' || prob === 'undefined') {
    //window.location.replace("../manipulator/problems/Getting%20Started");
    alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
    return null;
  }
  return prob.substr(22);
}

function addHistoryEntry(tree) {
  while (tree.parent !== null) {
    tree = tree.parent;
  }
  if (hist === null || hist === undefined) {
    hist = new history(tree);
  }
  hist.add(tree.toString());
}

function histAction(num) {
  if (hist === null || hist === undefined) {
    return;
  }
  if (num === 0) {
    hist.undo();
  } else if (num === 1) {
    hist.redo();
  }
}

class history {
  constructor(initTree) {
    this.historyArray = [];
    this.index = 0;
  }

  add(tree) {
    if (this.index < this.historyArray.length) {
      this.historyArray = this.historyArray.splice(0, this.index++);
    } else {
      this.index++;
    }
    this.historyArray.push(tree.toString());
    //console.log("add: "+tree.toString());
  }

  undo() {
    if (this.index - 1 <= 0) {
      return;
    }
    displayTreeFromDBStruct(this.historyArray[(--this.index) - 1], 'canvasContainer', res=>workingExpressionTree = res);
    //console.log("undo: "+this.historyArray[this.index]);
  }

  redo() {
    if (this.index >= this.historyArray.length) {
      return;
    }
    displayTreeFromDBStruct(this.historyArray[this.index++], 'canvasContainer', res=>workingExpressionTree = res);
    //console.log("redo: "+this.historyArray[this.index++]);
  }
}
