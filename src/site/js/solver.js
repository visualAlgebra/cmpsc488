import { AssociativeExtract, AssociativeInsert, CommutativeSwap } from "./algebraic_actions";

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
// a: the start expression
// b: the end expression
function solve(a, b) {
  if (a.equals(b))
    return null;
  var head = Node(hesuristicEval(a, b), null, null, a, 0);
  var nodeArray = [];
  var expanded = [];
  nodeArray.push(head);
  var currentNodeIndex;
  var currentNode = head;
  var optimalNode = null;
  //while (nodeArray.length != 0){
  if (currentNode.currentExpression.equals(b)) {
    optimalNode = currentNode;
    break;
  }
  else {
    if (expanded.filter(x => (x.currentExpression.equals(currentNode.currentExpression))).length == 0)
      expand(currentNode, nodeArray/*, expanded*/);
    nodeArray.splice(currentNodeIndex, 1);
  }
  if (nodeArray.length != 0) {
    var lowestHeurAndSteps = nodeArray[0].numberOfMoves + nodeArray[0].heuristic;
    currentNode = nodeArray[0];
    currentNodeIndex = 0;
    for (var i = 0; i < nodeArray.length; i++) {
      if ((nodeArray[i].heuristic + nodeArray[i].numberOfMoves) < lowestHeurAndSteps) {
        lowestHeurAndSteps = nodeArray[i].heuristic + nodeArray[i].numberOfMoves;
        currentNode = nodeArray[i];
        currentNodeIndex = i;
      }
    }
  }
  //}

  /*if (optimalNode == null)
    return null;
    
  while (!currentNode.previousNode.currentExpression.equals(a)){
    currentNode = currentNode.previousNode;
  }
  */
  optimalNode = nodeArray[0];

  for (var i = 0; i < nodeArray.length; i++) {
    if (nodeArray[i].heuristic < optimalNode.heuristic)
      optimalNode = nodeArray[i];
  }
  return optimalNode.previousAction; //currentNode.previousAction;
}

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

function expand(nodeToExpand, nodeArray/*, expanded*/) {
  expandAssociative(nodeToExpand, nodeArray, expanded);
}

function expandAssociativeIntro(nodeToExpand, nodeArray) {
  var action;
  if (AssociativeIntro.verify(nodeToExpand.currentExpression)) {
    var currrentClone = nodeToExpand.currentExpression.clone();
    action = new AssociativeIntro(currrentClone);
    action.apply();
    //addToNodeArray(currrentClone, nodeArray, expanded);
    nodeArray.push(currrentClone);
  }
}

function expandAssociativeMerge(nodeToExpand, nodeArray) {
  
  if (nodeToExpand.currentExpression instanceof Tag) {
    //AssociativeMerge verifying NW
    for (var i = 0; i < nodeToExpand.currentExpression.NW.length; i++) {
      if (AssociativeMerge.verify(nodeToExpand.currentExpression.NW[i], nodeToExpand.currentExpression, Quadrant.NW)) {
        var currrentClone = nodeToExpand.currentExpression.clone();
        action = new AssociativeMerge(currentClone.NW[i], currrentClone, Quadrant.NW);
        action.apply();
        //addToNodeArray(currrentClone, nodeArray, expanded);
        nodeArray.push(currrentClone);
      }
    }
    //AssociativeMerge verifying SE
    for (let child of nodeToExpand.currentExpression.SE) {
      if (AssociativeMerge.verify(child, nodeToExpand.currentExpression, Quadrant.SE)) {
        var currrentClone = nodeToExpand.currentExpression.clone();
        action = new AssociativeMerge(child, currrentClone, Quadrant.SE);
        action.apply();
        //addToNodeArray(currrentClone, nodeArray, expanded);
        nodeArray.push(currrentClone);
      }
    }
  }
}

function expandAssociativeExtract(nodeToExpand, nodeArray) {
  
  if (nodeToExpand.currentExpression instanceof Tag) {
    //AssociativeExtract verifying 
    //Iterating throught the children of node's current expression
    for (let child of nodeToExpand.currentExpression.NW.concat(nodeToExpand.currentExpression.SE)) {
    
      if (child instanceof Tag) {
        //if child is a Tag, then look into it's grandchildren to extract
        for (let grandChild of child.NW) {
          if (AssociativeExtract.verify(grandChild, nodeToExpand.currentExpression)) {
            let currentClone = nodeToExpand.currentExpression.clone();
            action = new AssociativeExtract(grandChild, Quadrant.NW);
            action.apply();
            nodeArray.push(currentClone);
          }
        }
        for (let grandChild of child.SE) {
          if (AssociativeExtract.verify(grandChild, nodeToExpand.currentExpression)) {
            let currentClone = nodeToExpand.currentExpression.clone();
            action = new AssociativeExtract(grandChild, Quadrant.SE);
            action.apply();
            nodeArray.push(currentClone);
          }
        }
      }
    }
  }
}

function expandAssociativeInsert(nodeToExpand, nodeArray, expanded) {
  if (nodeToExpand.currentExpression instanceof Tag) {
    //AssociativeInsert Verifying 
    for (let child of nodeToExpand.currentExpression.NW.concat(nodeToExpand.currentExpression.SE)) {
      for (let tag of nodeToExpand.currentExpression.NW.concat(nodeToExpand.currentExpression.SE)) {
        if (tag instanceof Tag && AssociativeInsert.verify(child, tag, findQuadrant(child), findQuadrant(tag))){        
          let currentClone = nodeToExpand.currentExpression.clone();
          action = new AssociativeInsert(child, tag);
          action.apply();
          nodeArray.push(currentClone);
        }  
      }
    }
  }
}

function expandCommutativeSwap(nodeToExpand, nodeArray) {
  for (let child1 of nodeToExpand.currentExpression.NW.concat(nodeToExpand.currentExpression.SE)) {
    for (let child2 of nodeToExpand.currentExpression.NW.concat(nodeToExpand.currentExpression.SE)) {
      let quad1 = findQuadrant(child1);
      let quad2 = findQuadrant(child2);
      if (CommutativeSwap.verify(child1, child2, quad1, quad2)) {
        let currentClone = nodeToExpand.currentExpression.clone();
        action = new CommutativeSwap(child1, child2, quad1, quad2);
        action.apply();
        nodeArray.push(currentClone);
      }
    }
  }
}



function findQuadrant(x) {
  if (x.parent) {
    return x.parent.NW.some(e => Object.is(e, x)) ? Quadrant.NW : Quadrant.SE;
  } else {
    return null;
  }
}
