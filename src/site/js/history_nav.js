var histControl=undefined;

export function addHistoryEntry(tree, msg){
  tree=tree.toString();
  if(histControl===null||histControl===undefined){
    histControl=new historyController();
    let temp=histControl.init(tree, msg);
    //console.log(histControl);
    return temp;
  }else{
    return histControl.add(tree, msg);
  }
}

export function clearHist(){
  histControl=undefined;
}

export function setGoalTree(goalTree){
  histControl.setGoal(goalTree);
}

export function histAction(bool){
  let temp=null;
  if(bool){
    temp=histControl.forward();
  }else{
    temp=histControl.backward();
  }
  return temp;
}

export function getHistoryController(){
  return histControl;
}

class historyController{
  constructor(){
    this.loc;
    this.mainLine;
    this.idControl=0;
    this.widthControl=0;
    this.goalTree="";
  }

  init(initialTree, msg){
    this.mainLine=new historyLine(initialTree, this, msg);
    this.updateLoc(this.mainLine);
  }

  add(tree, msg){
    this.loc.addBlock(tree, msg);
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
  constructor(initialTree, rootHandle, msg){
    this.id=histControl.getID();
    this.parent=rootHandle;
    this.line=[new lineBlock(initialTree, this, msg)];
    this.index=0;
  }

  addBlock(tree, msg){
    if(this.index+1===this.line.length){//if at the end of the line
      this.line.push(new lineBlock(tree, this, msg));
      this.index++;
    }else{//if in the middle of line
      let newTree=new historyLine(tree, this.line[this.index], msg);
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
    if(this.index===0){
      if(this.id!==0){
        this.parent.parent.setIndex(this.parent.id);
        histControl.updateLoc(this.parent.parent);
        return this.parent.data//if going backward to previous line
      }else{
        return null;
      }
    }else{
      this.index--;//if in middle of line
      return this.line[this.index].data;
    }
  }

  setIndex(id){
    for(let index in this.line){
      if(this.line[index].id===id){
        this.index=parseInt(index);
        return;
      }
    }
  }

  findID(id){
    for(let index in this.line){
      if(this.line[index].id===id) {
        this.index=parseInt(index);
        histControl.updateLoc(this);
        return this.line[this.index].data;
      }
      for(let r in this.line[index].refs){
        if(this.line[index].refs[r].id===id){
          this.index=parseInt(index);
          histControl.updateLoc(this);
          return this.line[this.index].refs[r].data;
        }
        //return this.line[this.index].refs[r].findID(id);
      }
    }
  }
}

class lineBlock{
  constructor(tree, parent, msg){
    this.id=histControl.getID();
    this.msg=msg;
    this.parent=parent;
    this.data=tree;
    this.refs=[];
    // console.log("added ["+this.id+"]: "+this.data);
  }

  addRef(line){
    this.refs.push(line);
    return this.refs[this.refs.length-1];
  }

  setLoc(){
    return this.parent.findID(this.id);
  }
}
