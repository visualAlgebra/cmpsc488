document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

var problem_to_load = getProblemFromURL();
var hist;

window.onload = ()=>{
  changeMouseMode(0);
  if (problem_to_load !== null) {
    displayProblemFromDB(problem_to_load, 'canvasContainer', 'goalContainer', (res, res2)=>onDisplay(res, res2));
  } else {
    console.log("let eric know if you see this message appear, if in lab, ty");
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

function onDisplay(res, containerId){
  if(containerId==="canvasContainer"){
    workingExpressionTree=res;
    addHistoryEntry(res);
  }
}

function changeMouseMode(num) {
  if (num === 0) {
    mouse.mode = "General Manipulation";
  } else if (num === 1) {
    mouse.mode = "Merging Literals";
  }
}

function getProblemFromURL() {
  let prob = (window.location.href).substr((window.location.href).indexOf('/manipulator'));
  if (prob.indexOf('manipulator/problems/') === -1 || prob === 'null' || prob === '' || prob === 'undefined') {
    //location.replace("../Explorer.html");
    alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
    return null;
  }
  return prob.substring(prob.lastIndexOf('/'), prob.length);
}

function addHistoryEntry(tree) {
  while (tree.parent !== null) {
    tree = tree.parent;
  }
  if(hist===null||hist===undefined){
    hist=new history(tree);
  }
  hist.add(tree.toString());
}

function histAction(num){
  if(hist===null||hist===undefined){
    return;
  }
  if(num===0){
    hist.undo();
  }else if(num===1){
    hist.redo();
  }
}

class history{
  constructor(initTree){
    this.historyArray=[];
    this.index=0;
  }

  add(tree){
    if(this.index!==this.historyArray.length){
      this.historyArray=this.historyArray.splice(0,this.index);
      this.historyArray.push(tree.toString());
    }else{
      this.historyArray.push(tree.toString());
    }
    console.log("add: "+tree.toString());
    this.index++;
  }

  undo(){
    if(this.index<=1){
      return;
    }
    displayTreeFromStruct(this.historyArray[(--this.index)-1],'canvasContainer', null);
    console.log("undo: "+this.historyArray[this.index]);
  }

  redo(){
    if(this.index>=this.historyArray.length){
      return;
    }
    displayTreeFromStruct(this.historyArray[this.index++],'canvasContainer', null);
    console.log("redo: "+this.historyArray[this.index]);
  }
}