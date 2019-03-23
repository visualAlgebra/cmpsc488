import {
  AssociativeExtract,
  AssociativeInsert, AssociativeIntro,
  AssociativeMerge, Cancel, CombineFrac,
  CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
  QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
} from "./algebraic_actions";
import { ExpressionTree, Literal, Variable, Tag, Quadrant } from "./expression_tree";

class Node {
  constructor(heuristic, previousNode, previousAction, currentExpression, numberOfMoves) {
    this.heuristic = heuristic;
    this.previousNode = previousNode;
    this.action = previousAction;
    this.currentExpression = currentExpression;
    this.numberOfMoves = numberOfMoves;
  }


}

function heuristicEval(a, b) {
  if (a.equals(b))
    return 0;
  if ((a instanceof Tag)) {
    if (b instanceof Tag) {
      var numDiff = 0;
      var lengthAdjustment = max(a.NW.length - b.NW.length, 0);
      for (var i = 0; i < a.NW.length - lengthAdjustment; i++) {
        if ((b.NW[i] instanceof Tag) && !(a.NW[i] instanceof Tag)) {
          numDiff += 1 + heuristicEval(a.NW[i].NW[0], b.NW[i]);
        }
        else if ((a.NW[i] instanceof Tag) && !(b.NW[i] instanceof Tag)) {
          numDiff += a.NW[i].treeCount;
        }
        else if ((a.NW[i] instanceof Tag) && (b.NW[i] instanceof Tag)) {
          numDiff += heuristicEval(a.NW[i], b.NW[i]);
        }
        else if (a.NW[i].value != b.NW[i].value)
          numDiff += 1;

      }
    }
    else
      return a.treeCount;
  }
  if (a instanceof Literal) {
    if (b instanceof Literal) {
      if (b.value == a.value)
        return 0;
      else
        return 1;
    }
    if (b instanceof Variable)
      return 1;
    return b.treeCount;
  }

  if (a instanceof Variable) {
    if (b instanceof Variable) {
      if (b.value == a.value)
        return 0;
      else
        return 1;
    }
    if (b instanceof Literal)
      return 1;
    return b.treeCount;
  }

  return numDiff;
}

function max(x, y) {
  return (x > y) ? x : y; 
}
// a: the start expression
// b: the end expression
// function solve(a, b) {
//   if (a.equals(b))
//     return null;
//   var head = Node(hesuristicEval(a, b), null, null, a, 0);
//   var nodeArray = [];
//   var expanded = [];
//   nodeArray.push(head);
//   var currentNodeIndex;
//   var currentNode = head;
//   var optimalNode = null;
//   //while (nodeArray.length != 0){
//   if (currentNode.currentExpression.equals(b)) {
//     optimalNode = currentNode;
//     break;
//   }
//   else {
//     if (expanded.filter(x => (x.currentExpression.equals(currentNode.currentExpression))).length == 0)
//       expand(currentNode, nodeArray/*, expanded*/);
//     nodeArray.splice(currentNodeIndex, 1);
//   }
//   if (nodeArray.length != 0) {
//     var lowestHeurAndSteps = nodeArray[0].numberOfMoves + nodeArray[0].heuristic;
//     currentNode = nodeArray[0];
//     currentNodeIndex = 0;
//     for (var i = 0; i < nodeArray.length; i++) {
//       if ((nodeArray[i].heuristic + nodeArray[i].numberOfMoves) < lowestHeurAndSteps) {
//         lowestHeurAndSteps = nodeArray[i].heuristic + nodeArray[i].numberOfMoves;
//         currentNode = nodeArray[i];
//         currentNodeIndex = i;
//       }
//     }
//   }
//   //}

//   /*if (optimalNode == null)
//     return null;

//   while (!currentNode.previousNode.currentExpression.equals(a)){
//     currentNode = currentNode.previousNode;
//   }
//   */
//   optimalNode = nodeArray[0];

//   for (var i = 0; i < nodeArray.length; i++) {
//     if (nodeArray[i].heuristic < optimalNode.heuristic)
//       optimalNode = nodeArray[i];
//   }
//   return optimalNode.previousAction; //currentNode.previousAction;
// }

/*
function addToNodeArray(nodeToAdd, nodeArray, expanded) {
  if (expanded.filter(x => (x.currentExpression.equals(nodeToAdd.currentExpression))).length == 0)
    nodeArray.push(nodeToAdd);
  else {
    var dup = expanded.filter(x => (x.currentExpression.equals(nodeToAdd.currentExpression)))[0];
    if ((dup.heuristic + dup.numberOfMoves) > (nodeToAdd.heuristic + nodeToAdd.numberOfMoves)) {
      dup = nodeToAdd;
    }
  }
}
*/

export function solve(current, goal) {
  let nodeArray = [];
  let maxHeuristic = 0; 
  let maxIdx = -1;
  expand(current, nodeArray);
  for (let i = 0; i < nodeArray.length; i++) {
    console.log(nodeArray[i]);
    let heuristic = heuristicEval(nodeArray[i], goal);
    if (heuristic > maxHeuristic) {
      maxHeuristic = heuristic;
      maxIdx = i;
    }
  }
  console.log(nodeArray[maxIdx], maxHeuristic);
}

function expand(expTree, nodeArray) {
  // expandAssociativeIntro(nodeToExpand, nodeArray);
  // expandAssociativeMerge(nodeToExpand, nodeArray);
  // expandAssociativeExtract(nodeToExpand, nodeArray);
  // expandAssociativeInsert(nodeToExpand, nodeArray);
  // expandCommutativeSwap(nodeToExpand, nodeArray);
  // expandLiteralMerge(nodeToExpand, nodeArray);
  // expandLiteralConversion(nodeToExpand, nodeArray);
  // expandIdentityMerge(nodeToExpand, nodeArray);
  // expandZeroMerge(nodeToExpand, nodeArray);
  // expandCancel(nodeToExpand, nodeArray);
  // expandQuadrantFlip(nodeToExpand, nodeArray);
  // expandCombineFrac(nodeToExpand, nodeArray);
  // expnadSplitFrac(nodeToExpand, nodeArray);
  // expandFactor(nodeToExpand, nodeArray);
  // expandDistribute(nodeToExpand, nodeArray);
  // expandIdentityBalence(nodeToExpand, nodeArray);
  dumbExpand(expTree, nodeArray);
}

function pushAllChildren(root, childArray, location, locationArr) {
  //pushing child and location into respecktive arrays 
  childArray.push(root);
  locationArr.push(location);

  //if child was a tag, then call pushAllChildren on its children
  if (root instanceof Tag) {
    for (let i = 0; i < root.NW.length; i++) {
      let newLoca = new Uint8Array(location.length+1);
      newLoca.set(location);
      newLoca.set([i<<1], location.length);
      pushAllChildren(root.NW[i], childArray, newLoca, locationArr);
    }
    for (let i = 0; i < root.SE.length; i++) {
      let newLoca = new Uint8Array(location.length+1);
      newLoca.set(location);
      newLoca.set([(i<<1) + 1], location.length);
      pushAllChildren(root.SE[i], childArray, newLoca, locationArr);
    }
  }
}

function getChild(expTree, location) {
  // if (location === []) {
  //   return expTree;
  // }
  for (let current of location.slice(1)) {
    expTree = expTree[getQuad(current)][current>>1];
  }
  return expTree;
}

function getQuad(location) {
  // if (location.length < 1) return null;
  return ((location[location.length-1] & 1) === 1) ? Quadrant.NW : Quadrant.SE;
}

function dumbExpand(expTree, nodeArray) {
  //create array with all children and its quadrants
  let childArr = [];
  let locationArr = [];
  pushAllChildren(expTree, childArr, new Uint8Array(), locationArr);
  
  // for(let child of childArr) {
  //   console.log(child);
  // }

  for (let i = 0; i < childArr.length; i++) {
    
    let child1 = childArr[i];
    let location1 = locationArr[i];
    //actions that involve only one child
    expandAssociativeIntro(child1, nodeArray);
    
    //actions that involve two children
    for (let j = 0; j < childArr.length; j++) {
  
      let child2 = childArr[j]; 
      let location2 = locationArr[j];

      expandAssociativeMerge(child1, child2, location1, location2, nodeArray);
      expandAssociativeExtract(child1, child2, location1, location2, nodeArray);
      expandAssociativeInsert(child1, child2, location1, location2, nodeArray);
      // expandCommutativeSwap(child1, child2, location1, location2, nodeArray);
      
    }
  }
}

function expandAssociativeIntro(child1, nodeArray) {
  
  if (AssociativeIntro.verify(child1)) {
    let child = child1.clone();
    let action = new AssociativeIntro(child);
    action.apply();
    //addToNodeArray(currrentClone, nodeArray, expanded);
    nodeArray.push(child);
  }
}

function expandAssociativeMerge(child1, child2, location1, location2, nodeArray) {

  let parQuad = getQuad(location1);
  let cutOff = location2.length; 
  if (AssociativeMerge.verify(child1, child2, parQuad)) {
    let parent = child2.clone();
    let sibling = getChild(parent, location2.slice(cutOff))
    let action = new AssociativeMerge(sibling, parent, parQuad);
    action.apply();
    //addToNodeArray(currrentClone, nodeArray, expanded);
    nodeArray.push(parent);
  }
}

function expandAssociativeExtract(child1, child2, location1, location2, nodeArray) {

  let cutOff = location1.length;
  if (AssociativeExtract.verify(child1, child2)) {
    let grandParent = child2.clone();
    let grandChild = getChild(grandParent, location2.slice(cutOff));
    let action = new AssociativeExtract(grandChild, getQuad(location1));
    action.apply();
    nodeArray.push(grandParent);
  }
}

function expandAssociativeInsert(child1, child2, location1, location2, nodeArray) {
  
  let cutOff = location1.length;
  if (AssociativeInsert.verify(child1, child2)) {
    let insertionTag = child2.clone();
    let sibling = getChild(insertionTag, location2.slice(cutOff));
    let action = new AssociativeInsert(sibling, insertionTag);
    action.apply();
    nodeArray.push(insertionTag);
  }
}

function expandCommutativeSwap(child1, child2, location1, location2, nodeArray) {
  
  let cutOff = location1.length;
  if (CommutativeSwap.verify(child1, child2, getQuad(location1), getQuad(location2))) {
    let parent = child1.parent.clone();
    let sibling1 = getChild(parent, location1.slice(cutOff));
    let sibling2 = getChild(parent, location2.slice(cutOff));    
    let action = new CommutativeSwap(sibling1, sibling2);
    action.apply();
    nodeArray.push(parent);
  }
}

function expandCancel(child1, child2, location1, location2, nodeArray){

  let cutOff = location1.length - 1;
  if (Cancel.verify(child1, child2, getQuad(location1), getQuad(location2))) {

  }
}

function expandCombineFrac(nodeToExpand, nodeArray){

}

function expandDistribute(nodeToExpand, nodeArray){

}

function expandFactor(nodeToExpand, nodeArray){
  
}

function expandIdentityBalence(nodeToExpand, nodeArray){
  
}

function expandIdentityMerge(nodeToExpand, nodeArray){
  
}

function expandLiteralConversion(nodeToExpand, nodeArray){
  
}

function expandLiteralMerge(nodeToExpand, nodeArray){
  
}

function expandQuadrantFlip(nodeToExpand, nodeArray){
  
}

function expnadSplitFrac(nodeToExpand, nodeArray){
  
}

function expandZeroMerge(nodeToExpand, nodeArray){
  
}

