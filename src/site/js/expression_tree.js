import {LZMA} from './lzma_worker.js';
import {LiteralGui, TagGui, VariableGui} from "./gui";
import {createRandomExpression} from './random_expression_creator.js';
import {AssociativeIntro, AssociativeMerge, CommutativeSwap} from './algebraic_actions.js';

export const Orientation = {
  EW: "eastwest",
  NS: "northsouth"
};

export const Quadrant = {
  NW: "NW",
  SE: "SE"
};
export class LessonInfo {
  constructor(lesson_id, creations, timeCreated, creatorAccId, description) {
    this.lessonID = lesson_id;
    this.creations = creations;
    this.timeCreated = timeCreated;
    this.creatorAccId = creatorAccId;
    this.description = description;
  }

  toString() {
    let retval = "{_LESSON{" + this.lessonID + "}{";
    for (let form in this.creations) {
      retval += this.creations[form].toString();
    }
    retval += "}{" + this.description + "}";
    retval += "{" + this.creatorAccId + "}";
    retval += "{" + this.timeCreated + "}";
    return retval + "}";
  }
}

export function parseMultiProblem(multi) {
  let ret = [];
  for (let x in multi.results) {
    let k = multi.results[x];
    ret[x] = new ProblemInfo(k.problemID, k.startExpression, k.goalExpression, k.description, k.timeCreated);
  }
  return ret;
}

export class ProblemInfo {
  constructor(problemID, treestart, treegoal, description, timeCreated) {
    this.problemID = problemID;
    this.expression_start = treestart;
    this.expression_goal = treegoal
    this.description = description;
    this.timeCreated = timeCreated;
  }

  toString() {
    return "{_PROBLEM{" + this.problemID + "}{" + this.expression_start.toString() + "}{" + this.expression_goal.toString() + "}{" + this.description + "}{" + this.timeCreated + "}}";
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

  clone() {
    return Deserialize(this.toString());
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

  addSouthEast(child) {
    this.SE.push(child);
    child.parent = this;
    this.updateParentTreeCount(child.treeCount);
  }

  prependSouthEast(child) {
    this.SE.splice(0, 0, child);
    child.parent = this;
    this.updateParentTreeCount(child.treeCount);
  }

  prependNorthWest(child) {
    this.NW.splice(0, 0, child);
    child.parent = this;
    this.updateParentTreeCount(child.treeCount);
  }

  addNorthWest(child) {
    this.NW.push(child);
    child.parent = this;
    this.updateParentTreeCount(child.treeCount);
  }

  removeSouthEast(child) {
    this.SE = this.SE.filter(x => !Object.is(x, child));
    child.parent = null;
    this.updateParentTreeCount(-child.treeCount);
  }

  removeNorthWest(child) {
    this.NW = this.NW.filter(x => !Object.is(x, child));
    child.parent = null;
    this.updateParentTreeCount(-child.treeCount);
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

  childQuadrant(child) {
    return this.NW.some(x => Object.is(x, child)) ? Quadrant.NW : Quadrant.SE;
  }

  find(child, quadrantLabel) {
    return this[quadrantLabel].findIndex(x => Object.is(x, child));
  }

  replace(oldVal, newVal, quadrantLabel) {
    newVal.parent = oldVal.parent;
    this[quadrantLabel][this.find(oldVal, quadrantLabel)] = newVal;
    this.updateParentTreeCount(newVal.treeCount - oldVal.treeCount);
  }

  insert(child, index, quadrantLabel) {
    this[quadrantLabel].splice(index, 0, child);
    child.parent = this;
    this.updateParentTreeCount(child.treeCount);
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
    }
    return false;
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
} // end Literal class
export function array_delete(arr, ref) {
  for (let i = 0; i < arr.length; i++) {
    if (Object.is(ref, arr[i])) {
      arr.splice(i, 1);
    }
  }
}

export function Deserialize(text) {
  if (text.substr(0, 2) === "{l") {
    return new Literal(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{v") {
    return new Variable(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{t") {
    let retval = new Tag(Orientation[text.substr(2, 2)]);
    let inNW = true;
    let counter = 0;
    let tempstr = "";
    for (let i = 6; i < text.length - 3; i++) {
      tempstr += text.charAt(i);
      if (text.charAt(i) === "{") {
        counter++;
      } else if (text.charAt(i) === "}") {
        if (--counter === -1) {
          inNW = false;
          i++;
          tempstr = "";
          counter = 0;
          continue;
        }
        if (counter === 0) {
          if (tempstr.substr(tempstr.length - 2) !== "{}") {
            if (inNW) {
              retval.addNorthWest(Deserialize(tempstr));
            } else {
              retval.addSouthEast(Deserialize(tempstr));
            }
          }
          tempstr = "";
        }
      }
    }
    return retval;
  }
}

export class Problem {
  constructor(start, goal) {
    this.start = start;
    this.goal = goal;
  }
}

// validActionsArr: is an array of boolean values corresponding to what actions the user wants available
// numNodes: The number of nodes that the user wants originally
// numActions: the number of actions that the user wants to be applied to get to the goal
export function randomProblemGenerator(numNodes, validActionsArr, numActions) {
  const start = createRandomExpression(numNodes);
  var end = start.clone();
  var actionApplied;
  var action;
  for (var i = 0; i < numActions; i++) {
    actionApplied = false;
    // the while makes sure that at least one action is applied before continuing
    while (!actionApplied) {
      var actionIndx = Integer(Math.floor(Math.random() * validActionsArr.length))
      if (validActionsArr[actionIndx]) {
        // case ordering appears in the same order as the actions appear in algebraic_actions.js
        switch (actionIndx) {
          case 0:
            var quadToApply = Math.floor(Math.random() * 2);
            if (Integer(quadToApply) == 0) {
              var sib1 = Math.floor(Math.random() * end.NW.length);
              var sib2 = Math.floor(Math.random() * end.NW.length);
              if (CommutativeSwap.verify(end.NW[sib1], end.NW[sib2], Quadrant.NW)) {
                action = new CommutativeSwap(end.NW[sib1], end.NW[sib2], Quadrant.NW);
                action.apply();
                actionApplied = true;
              }
            }
            else {
              var sib1 = Math.floor(Math.random() * end.SE.length);
              var sib2 = Math.floor(Math.random() * end.SE.length);
              if (CommutativeSwap.verify(end.SE[sib1], end.SE[sib2], Quadrant.SE)) {
                action = new CommutativeSwap(end.SE[sib1], end.SE[sib2], Quadrant.SE);
                action.apply();
                actionApplied = true;
              }
            }
            break;

          case 1:
            var quadToApply = Math.floor(Math.random() * 2);
            if (Integer(quadToApply) == 0) {
              var sib1 = Math.floor(Math.random() * end.NW.length);
              if (AssociativeMerge.verify(end.NW[sib1], end)) {
                action = new AssociativeMerge(end.NW[sib1], end, Quadrant.NW);
                action.apply();
                actionApplied = true;
              }
            }
            else {
              var sib1 = Math.floor(Math.random() * end.SE.length);
              if (AssociativeMerge.verify(end.SE[sib1], end)) {
                action = new AssociativeMerge(end.SE[sib1], end, Quadrant.SE);
                action.apply();
                actionApplied = true;
              }
            }
            break;

          case 2:
            var quadToApply = Math.floor(Math.random() * 2);
            if (Integer(quadToApply) == 0) {
              var sib1 = Math.floor(Math.random() * end.NW.length);
              if (AssociativeIntro.verify(end.NW[sib1])) {
                action = new AssociativeIntro(end.NW[sib1]);
                action.apply();
                actionApplied = true;
              }
            }
            else {
              var sib1 = Math.floor(Math.random() * end.SE.length);
              if (AssociativeIntro.verify(end.SE[sib1])) {
                action = new AssociativeIntro(end.SE[sib1]);
                action.apply();
                actionApplied = true;
              }
            }
            break;

          case 3:
            var quadToApply = Math.floor(Math.random() * 2);
            if (Integer(quadToApply) == 0) {
              var sib1 = Math.floor(Math.random() * end.NW.length);
              if (end.NW[sib1] instanceof Tag) {
                var quadToApply2 = Math.floor(Math.random() * 2);
                if (Integer(quadToApply2) == 0) {
                  var sib2 = Math.floor(Math.random() * end.NW[sib1].NW.length)
                  if (AssociativeExtract.verify(end.NW[sib1].NW[sib2], end)) {
                    action = new AssociativeExtract(end.NW[sib1].NW[sib2], end);
                    action.apply();
                    actionApplied = true;
                  }
                }
                else {
                  var sib2 = Math.floor(Math.random() * end.NW[sib1].SE.length)
                  if (AssociativeExtract.verify(end.NW[sib1].SE[sib2], end)) {
                    action = new AssociativeExtract(end.NW[sib1].SE[sib2], end);
                    action.apply();
                    actionApplied = true;
                  }
                }
              }
            }
            else {
              var sib1 = Math.floor(Math.random() * end.SE.length);
              if (end.SE[sib1] instanceof Tag) {
                var quadToApply2 = Math.floor(Math.random() * 2);
                if (Integer(quadToApply2) == 0) {
                  var sib2 = Math.floor(Math.random() * end.SE[sib1].NW.length)
                  if (AssociativeExtract.verify(end.SE[sib1].NW[sib2], end)) {
                    action = new AssociativeExtract(end.SE[sib1].NW[sib2], end);
                    action.apply();
                    actionApplied = true;
                  }
                }
                else {
                  var sib2 = Math.floor(Math.random() * end.SE[sib1].SE.length)
                  if (AssociativeExtract.verify(end.SE[sib1].SE[sib2], end)) {
                    action = new AssociativeExtract(end.SE[sib1].SE[sib2], end);
                    action.apply();
                    actionApplied = true;
                  }
                }
              }
            }
            break;

            case 4: // AssociativeInsert

            break;

            case 5: // Distribute

            break;

            case 6: // Factor

            break;

            case 7: // SplitFrac

            break;

            case 8: // CombineFrac

            break;

            case 9: // Quadrant Flip

            break;

            case 10: // Cancel

            break;

            case 11: // Identity Balence

            break;

            case 12: // Literal Merge

            break;

            case 13: // Zero Merge

            break;

            case 14: // Identity Merge

            break;

            case 15: // Literal Conversion

            break;

            default:
            console.log("ERROR: INVALID ACTION INDEX IN GENERATOR")
            break;
        }
      }
    }
  }
  return new Problem(start, end);
}

//compress_string_js(expressionTree.toString(),res => {console.log(res)});
export function compress_string_js(text, callback) {
  var arr;
  if (text[0] === "[" && text.slice(-1) === "]") {
    try {
      arr = JSON.parse(text);
    } catch (e) { }
  }
  if (arr) {
    text = arr;
  }
  LZMA.compress(text, 9, callback);
}

export function decompress_string_js(byte_arr, callback) {
  LZMA.decompress(byte_arr, callback);
}