var histControl=undefined;

export function addHistoryEntry(tree){
  tree=tree.toString();
  if(histControl===null||histControl===undefined){
    histControl=new historyController();
    let temp=histControl.init(tree);
    console.log(histControl);
    return temp;
  }else{
    return histControl.add(tree);
  }
}

export function setGoalTree(goalTree){
  histControl.setGoal(goalTree);
}

export function histAction(bool){
  if(bool){
    return histControl.forward();
  }else{
    return histControl.backward();
  }
}

function getHistArray(){
  let histArray=[[0]];
  console.log(histArray);
  let currentLine=histControl.mainLine;
  histControl.widthControl=0;
  _getHistArray(histArray, currentLine);
  return histArray;
}

function _getHistArray(arr, lineToEval){
  for(let xk=0; xk<lineToEval.line.length; xk++){
    arr[histControl.widthControl].push(lineToEval.line[xk]);
  }
  let temp=histControl.widthControl;
  for(let xk=lineToEval.line.length-1; xk>=0; xk--){
    if(lineToEval.line[xk].refs.length!==0){
      for(let yk in lineToEval.line[xk].refs){
        arr.push([xk+arr[temp][0]+1]);
        histControl.widthControl++;
        _getHistArray(arr,lineToEval.line[xk].refs[yk]);
      }
    }
  }
}

export function renderHist(canvas_id, curTree){
  let histArr=getHistArray();
  let canvas=document.getElementById(canvas_id);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width=60+histArr.length*40;
  for(let x=0; x<histArr.length; x++){
    if(canvas.height<60+40*histArr[x].length+histArr[x][0]*40){
      canvas.height=60+40*histArr[x].length+histArr[x][0]*40;
    }
    for(let y=1; y<histArr[x].length; y++){
      ctx.beginPath();
      let xc=60+x*40;
      let yc=60+y*40+histArr[x][0]*40;
      let radius=15;
      if(histArr[x][y].data===curTree){
      	ctx.fillStyle = '#d42a00';
        if(histControl.loc.line[histControl.loc.index].id===histArr[x][y].id){
      	  ctx.fillStyle = '#2ad400';
        }
	    ctx.fillRect((xc-radius)-3, (yc-radius)-3, (radius*2)+6, (radius*2)+6);
      }
      ctx.arc(xc, yc, radius, 0, 2*Math.PI);
      ctx.fillStyle='blue';
      ctx.fill();
    }
  }
}

class historyController{
  constructor(){
    this.loc;
    this.mainLine;
    this.idControl=0;
    this.widthControl=0;
    this.goalTree="";
  }

  init(initialTree){
    this.mainLine=new historyLine(initialTree, this);
    this.updateLoc(this.mainLine);
  }

  add(tree){
    this.loc.addBlock(tree);
    return tree===this.goalTree;
  }

  setGoal(goalTree){
    this.goalTree=goalTree;
  }

  forward(){
    return this.loc.forward();
  }

  backward(){
    return this.loc.backward();
  }

  updateLoc(rootHandle){
    this.loc=rootHandle;
  }

  getID(){
    return this.idControl++;
  }
}
class historyLine{
  constructor(initialTree, rootHandle){
    this.id=histControl.getID();
    this.parent=rootHandle;
    this.line=[new lineBlock(initialTree, this)];
    this.index=0;
  }

  addBlock(tree){
    if(this.index+1===this.line.length){//if at the end of the line
      this.line.push(new lineBlock(tree, this));
      this.index++;
    }else{//if in the middle of line
      let newTree=new historyLine(tree, this.line[this.index]);
      let ref=this.line[this.index].addRef(newTree);
      histControl.updateLoc(ref);
      return ref.line[0].data;
    }
  }

  forward(){
    if(this.index+1>=this.line.length){
      return null;//if going past end of line
    }else{
      return this.line[++this.index].data;//if not at end of line
    }
  }

  backward(){
    if(this.index==0){
      if(this.id!==0){
        return this.parent.parent.findID(this.id)//if going backward to previous line
      }else{
        return null;
      }
    }else{
      this.index--;//if in middle of line
      return this.line[this.index].data;
    }
  }

  findID(id){
    for(let index in this.line){
      for(let r in this.line[index].refs){
        if(this.line[index].refs[r].id===id){
          this.index=parseInt(index);
          histControl.updateLoc(this);
          return this.line[this.index].data;
        }
      }
    }
  }
}
class lineBlock{
  constructor(tree, parent){
    this.id=histControl.getID();
    this.parent=parent;
    this.data=tree;
    this.refs=[];
    //console.log("added ["+this.parent.id+"]: "+this.data);
  }

  addRef(line){
    this.refs.push(line);
    return this.refs[this.refs.length-1];
  }
}