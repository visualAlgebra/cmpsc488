import {LZMA} from './lzma_worker.js';
import {LiteralGui, TagGui, VariableGui} from "./gui";
// console.log("@@@@@@@@@@");
// const my_lzma = require("lzma");
// console.log(my_lzma);
// console.log("@@@@@@@@@@");

export const Orientation = {
  EW: "eastwest",
  NS: "northsouth"
};

export const Quadrant = {
  NW: "NW",
  SE: "SE"
};
export class LessonInfo{
    constructor(lesson_id, creations, timeCreated, creatorAccId, description){
      this.id=lesson_id;
      this.creations=creations;
      this.timeCreated=timeCreated;
      this.creatorAccId=creatorAccId;
      this.description=description;
    }

  toString(){
    let retval="{_LESSON{"+this.problem_id+"}{";
    for(let form in this.creations){
      retval+=this.creations[form].toString();
    }
    retval+="}{"+this.description+"}";
    retval+="{"+this.creatorAccId+"}";
    retval+="{"+this.timeCreated+"}";
    return retval+"}";
  }
}

export function parseMultiProblem(multi){
    let ret=[];
    for(let x in multi.queryResults){
      x=parseInt(x);
      let k=multi.queryResults[x];
      ret[x]=new ProblemInfo(k.problemID,k.startExpression,k.goalExpression, k.description, k.timeCreated);
    }
    return ret;
}

export class ProblemInfo {
  constructor(problemID,treestart,treegoal, description, timeCreated){
    this.problemID=problemID;
    this.expression_start=treestart;
    this.expression_goal=treegoal
    this.description=description;
    this.timeCreated=timeCreated;
  }

  toString(){
    return "{_PROBLEM{"+this.problemID+"}{"+this.expression_start.toString()+"}{"+this.expression_goal.toString()+"}{"+this.description+"}{"+this.timeCreated+"}}";
  }
}

// Abstract Class
export class ExpressionTree {
  constructor(kind) {
    this.kind = kind;
    this.treeCount = 1;
    this.parent = null;
  }

  toString() {
    return "error";
  }

  clone(){
    return _Deserialize(this.toString());
  }


} // end ExpressionTree class

export class Tag extends ExpressionTree {
  constructor(orientation, nw, se) {
    super("tag");
    this.orientation = orientation;
    this.NW = nw || [];
    this.SE = se || [];

    for (let child of this.NW) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
    for (let child of this.SE) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
  }

  // TreeCount keeps track of the number of Tags, Variables, and Literals
  // (including itself).
  updateParentTreeCount(count) {
    this.treeCount += count;
    if (this.parent != null) {
      this.parent.updateParentTreeCount(count);
    }
  }
  //
  addSouthEast(child) {
    this.SE.push(child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  prependSouthEast(child) {
    this.SE.splice(0, 0, child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  prependNorthWest(child) {
    this.NW.splice(0, 0, child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  addNorthWest(child) {
    this.NW.push(child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  removeSouthEast(child) {
    this.SE = this.SE.filter(x => !Object.is(x, child));
    const delta = child.treeCount;
    child.parent = null;
    this.updateParentTreeCount(-delta);
  }

  removeNorthWest(child) {
    this.NW = this.NW.filter(x => !Object.is(x, child));
    const delta = child.treeCount;
    child.parent = null;
    this.updateParentTreeCount(-delta);
  }

  emptyNorthWest() {
    let delta = 0;
    for (let child of this.NW) {
      delta += child.treeCount;
      child.parent = null;
    }
    this.NW = [];
    this.updateParentTreeCount(-delta);
  }

  emptySouthEast() {
    let delta = 0;
    for (let child of this.SE) {
      delta += child.treeCount;
      child.parent = null;
    }
    this.SE = [];
    this.updateParentTreeCount(-delta);
  }

  findAndReplace(oldVal, newVal, quadrantLabel) {
    const delta = newVal.treeCount - oldVal.treeCount;
    const idx = this[quadrantLabel].findIndex(x => Object.is(x, oldVal));
    newVal.parent = oldVal.parent;
    this[quadrantLabel][idx] = newVal;
    this.updateParentTreeCount(delta);
  }

  equals(that) {
    if (that.kind === "tag") {
      if (
        this.orientation !== that.orientation ||
        this.NW.length !== that.NW.length ||
        this.SE.length !== that.SE.length
      ) {
        return false;
      }

      for (let i = 0; i < this.NW.length; i++) {
        if (!this.NW[i].equals(that.NW[i])) return false;
      }

      for (let i = 0; i < this.SE.length; i++) {
        if (!this.SE[i].equals(that.SE[i])) return false;
      }

      return true;
    } else {
      return false;
    }
  }

  delete(ref) {
    array_delete(this.SE, ref);
    array_delete(this.NW, ref);
  }


  // Creates dom elements for the tag, returns dom node without putting
  // it on the page.
  render() {
    const gui = new TagGui(this);
    return gui.dom;
  }

  toString() {
    var retval =
      "{t" +
      Object.keys(Orientation).find(
        key => Orientation[key] === this.orientation
      ) +
      "{{";
    for (let i = 0; i < this.NW.length; i++) {
      retval = retval + this.NW[i].toString();
    }
    retval = retval + "}{";
    for (let i = 0; i < this.SE.length; i++) {
      retval = retval + this.SE[i].toString();
    }
    return retval + "}}}";
  }
  compress() {
    compress_string_js(this.toString(),res => {
      console.log(JSON.stringify(res));
    });
  }
} // end Tag class

export class Variable extends ExpressionTree {
  constructor(value) {
    super("variable");
    this.value = value;
  }

  equals(that) {
    if (that.kind !== "variable") return false;
    return this.value === that.value;
  }

  // Creates dom elements for the tag, returns dom node without putting
  // it on the page.
  render() {
    const gui = new VariableGui(this);
    return gui.dom;
  }

  toString() {
    return "{v" + this.value + "}";
  }

  compress() {
    compress_string_js(this.toString(),res => {
      console.log(JSON.stringify(res));
    });
  }
} // end Variable class

export class Literal extends ExpressionTree {
  constructor(value) {
    super("literal");
    this.value = value;
  }

  equals(that) {
    if (that.kind !== "literal") return false;
    return this.value === that.value;
  }

  // Creates dom elements for the tag, returns dom node without putting
  // it on the page.
  render() {
    const gui = new LiteralGui(this);
    return gui.dom;
  }

  toString() {
    return "{l" + this.value + "}";
  }

  compress() {
    compress_string_js(this.toString(),res => {
      console.log(JSON.stringify(res));
    });
  }
} // end Literal class

// end of classes, start of functions

export function array_delete(arr, ref) {
  for (let i = 0; i < arr.length; i++) {
    if (Object.is(ref, arr[i])) {
      arr.splice(i, 1);
    }
  }
}

var nodecount=0;
export function Deserialize(text) {
  let now=Date.now();
  let retval=_Deserialize(text);
  let time=(Date.now()-now)/1000;
  if(time>0.5){
    console.log('time: '+time+' secs from: '+nodecount+' nodes.');
  }
  nodecount=0;
  return retval;
}
function _Deserialize(text) {
  nodecount++;
  if (text.substr(0, 2) === "{l") {
    return new Literal(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{v") {
    return new Variable(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{t") {
    let retval = new Tag(Orientation[text.substr(2, 2)]);
    let inNW=true;
    let counter = 0;
    let tempstr = "";
    for (let i = 6; i < text.length-3; i++) {
      tempstr+=text.charAt(i);
      if (text.charAt(i) === "{") {
        counter++;
      } else if (text.charAt(i) === "}") {
        counter--;
        if (counter===-1){
          inNW=false;
          i++;
          tempstr="";
          counter=0;
          continue;
        }
        if (counter === 0) {
          if(tempstr.substr(tempstr.length-2)!=="{}"){
            if(inNW){
              retval.addNorthWest(_Deserialize(tempstr));
            }else{
              retval.addSouthEast(_Deserialize(tempstr));
            }
          }
          tempstr = "";
        }
      }
    }
    return retval;
  }
}
//compress_string_js(expressionTree.toString(),res => {console.log(res)});
export function compress_string_js(text, callback) {
  var arr;
  if (text[0] === "[" && text.slice(-1) === "]") {
    try {
      arr = JSON.parse(text);
    } catch (e) {}
  }
  if (arr) {
    text = arr;
  }
  // LZMA("http://localhost:8080/src/site/node_modules/lzma/src/lzma_worker.min.js").compress(text, 9, callback);
  LZMA.compress(text, 9, callback);
}

export function decompress_string_js(byte_arr, callback) {
  // LZMA("http://localhost:8080/src/site/node_modules/lzma/src/lzma_worker.min.js").decompress(byte_arr, callback);
  LZMA.decompress(byte_arr, callback);
}



/// /////////////////////////////////////////////////////////////////////////////
/// //////////////////        Unused Functions   ////////////////////////////////

//x=createRandomExpression(6).toString(); helper(x.substr(5,x.length-7));
 function helper(text){
    let rettext="";
    let temp=0;
    let zeroamt=0;
    let i=0;
    for(i=0; i<text.length; i++){
      if(text.charAt(i)==="{"){
        if(temp===0){
          rettext+="*";
        }else{
          rettext+=temp;
        }
        temp++;
      }else if(text.charAt(i)==="}"){
        temp--;
        if(temp===0){
          rettext+="*";
        }else{
          rettext+=temp;
        }
        if(temp===0){
          zeroamt++;
        }
      }else{
        rettext=rettext+" ";
      }
    }
    console.log(text);
    console.log(rettext+"  :  Valid? "+(temp===0)+"  :  "+zeroamt);
  }
/// /////////////////////////////////////////////////////////////////////////////
