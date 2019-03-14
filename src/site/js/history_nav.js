import {displayTreeFromDBStruct} from "./display_feature";
import {globals} from './gui';
var hist;

export function addHistoryEntry(tree){
  while(tree.parent!==null){
    tree=tree.parent;
  }
  if(hist===null||hist===undefined){
    hist=new history(tree.toString());
    return;
  }
  hist.add(tree.toString());
}

export function histAction(num){
  if(hist===null||hist===undefined){
    return;
  }
  if(num===0){
    hist.undo();
  }else if(num===1){
    hist.redo();
  }
}

export function clearHist(tree){
  hist=undefined;
  hist=new history(tree.toString());
}

export class history{
  constructor(treetxt){
    this.historyArray=[];
    this.index=0;
    this.add(treetxt);
  }

  add(tree){
    if(this.index<this.historyArray.length){
      this.historyArray=this.historyArray.splice(0, this.index++);
    }else{
      this.index++;
    }
    this.historyArray.push(tree.toString());
    //console.log("add: "+tree.toString());
  }

  undo(){
    if(this.index-1<=0){
      return;
    }
    displayTreeFromDBStruct(this.historyArray[(--this.index)-1], 'canvasContainer', res=>{
      globals.workingExpressionTree=res;
    });
    //console.log("undo: "+this.historyArray[this.index]);
  }

  redo(){
    if(this.index>=this.historyArray.length){
      return;
    }
    displayTreeFromDBStruct(this.historyArray[this.index++], 'canvasContainer', res=>{
      globals.workingExpressionTree=res;
    });
    //console.log("redo: "+this.historyArray[this.index++]);
  }
}