document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

var problem_to_load = getProblemFromURL();

window.onload = ()=>{
  if (problem_to_load !== null) {
    displayProblemFromDB(problem_to_load, 'canvasContainer', 'goalContainer');
  }

  // Set up Materialize form select elements
  $('select').formSelect();

  const mouseModeSelect = M.FormSelect.getInstance($("#mouse-mode-selection"));
  mouseModeSelect.el.onchange = function() {
    mouse.mode = this.value;
  }
  ;

  // Set up initial value
  mouse.mode = mouseModeSelect.el.value;
}
;

window.onpopstate = (e)=>{
  if (e.state) {
    problem_to_load = e.state;
    displayProblemFromDB(e.state);
  }
}
;

function getProblemFromURL() {
  let prob = (window.location.href).substr((window.location.href).indexOf('/manipulator'));
  if (prob.indexOf('manipulator/problems/') === -1 || prob === 'null' || prob === '' || prob === 'undefined') {
    //location.replace("../Explorer.html");
    alert("Error(manipulator.js): Please enter a problem after \"manipulator/problems/\" in the URL or select a problem from another page");
    return null;
  }
  return prob.substring(prob.lastIndexOf('/'), prob.length);
}

function addHistoryEntry(tree){
    while(tree.parent!==null){
        tree=tree.parent;
    }
    _addHistoryEntry(tree.toString());
}

var historyArray=[];
function _addHistoryEntry(str){
    for(let entry in historyArray){
        entry=parseInt(entry);
        if(str===historyArray[entry]){
            for(let deletion in historyArray.slice(entry,entry+historyArray.length)){
                historyArray.pop(historyArray[deletion]);
            }
            break;
        }
    }
    historyArray.push(str);
    updateHistory();
}
function updateHistory(){
    const container = $("#historyContainer");
    container.empty();
    for(let entry in historyArray){
        let div=document.createElement("div");
        div.style.padding='2rem';
        div.innerHTML=historyArray[entry];
        container.append(div);
    }
}