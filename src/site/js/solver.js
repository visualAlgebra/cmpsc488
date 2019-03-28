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
      var lengthAdjustment = Math.max(a.NW.length - b.NW.length, 0);
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

export function solve(current, goal) {
  let nodeArray = [];
  let minHeuristic = Number.MAX_SAFE_INTEGER;
  let minIdx = -1;
  expand(current, nodeArray);
  for (let i = 0; i < nodeArray.length; i++) {
    console.log(i, nodeArray[i]);
    let heuristic = heuristicEval(nodeArray[i], goal);
    if (heuristic < minHeuristic) {
      minHeuristic = heuristic;
      minIdx = i;
    }
  }
  console.log(nodeArray[minIdx], minHeuristic);
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
  // for(let i of location) {
  //   console.log(i)
  // }
  // console.log("\n", location);
  for (let current of location) {
    (current & 1 === 1) ? expTree = expTree.SE[current>>1] : expTree = expTree.NW[current>>1]
    // console.log(current)
    // console.log(expTree)
  }
  return expTree;
}

function getQuad(location) {
  if (location.length < 1) return null;
  return ((location[location.length-1] & 1) === 1) ? Quadrant.SE : Quadrant.NW;
}

function dumbExpand(root, nodeArray) {
  //create array with all children and its quadrants
  let childArr = [];
  let locationArr = [];
  pushAllChildren(root, childArr, new Uint8Array(), locationArr);
  
  // for(let child of childArr) {
  //   console.log(child);
  // }

  // for(let location of locationArr) {
  //   console.log(getChild(root, location));
  // }

  for (let i = 0; i < childArr.length; i++) {
    
    let child1 = childArr[i];
    let location1 = locationArr[i];

    //actions that involve only one child
    expandAssociativeIntro(child1, location1, root, nodeArray);
    expandLiteralConversion(child1, location1, root, nodeArray);
    
    //actions that involve two children
    for (let j = 0; j < childArr.length; j++) {
  
      let child2 = childArr[j]; 
      let location2 = locationArr[j];

      expandAssociativeMerge(child1, child2, location1, location2, root, nodeArray);
      expandAssociativeExtract(child1, child2, location1, location2, root, nodeArray);
      expandAssociativeInsert(child1, child2, location1, location2, root, nodeArray);
      expandCommutativeSwap(child1, child2, location1, location2, root, nodeArray);
      expandCancel(child1, child2, location1, location2, root, nodeArray);
      expandCombineFrac(child1, child2, location1, location2, root, nodeArray);
      expandDistribute(child1, child2, location1, location2, root, nodeArray);
      
    }
  }
}

function expandAssociativeIntro(child, location, root, nodeArray) {
  
  if (AssociativeIntro.verify(child)) {
    let rootClone = root.clone();
    let expTree = getChild(rootClone, location);
    let action = new AssociativeIntro(expTree);
    action.apply();
    //addToNodeArray(currrentClone, nodeArray, expanded);
    nodeArray.push(new Node(rootClone, action));
  }
}

function expandAssociativeMerge(child1, child2, location1, location2, root, nodeArray) {

  let parQuad = getQuad(location1);
  // let cutOff = location2.length; 
  if (AssociativeMerge.verify(child1, child2, parQuad)) {
    let rootClone = root.clone();
    let sibling = getChild(rootClone, location1);
    let parent = getChild(rootClone, location2);
    let action = new AssociativeMerge(sibling, parent, parQuad);
    action.apply();
    //addToNodeArray(currrentClone, nodeArray, expanded);
    nodeArray.push(new Node(rootClone, action));
  }

}

function expandAssociativeExtract(child1, child2, location1, location2, root, nodeArray) {

  // let cutOff = location1.length;
  if (AssociativeExtract.verify(child1, child2)) {
    let rootClone = root.clone();
    let grandChild = getChild(rootClone, location1);
    // let grandParent = getChild(rootClone, location2);
    let action = new AssociativeExtract(grandChild, getQuad(location1));
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }

}

function expandAssociativeInsert(child1, child2, location1, location2, root, nodeArray) {
  
  // let cutOff = location1.length;
  if (AssociativeInsert.verify(child1, child2)) {
    let rootClone = root.clone();
    let sibling = getChild(rootClone, location1);
    let insertionTag = getChild(rootClone, location2);
    let action = new AssociativeInsert(sibling, insertionTag);
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }

}

function expandCommutativeSwap(child1, child2, location1, location2, root, nodeArray) {
  
  /*console.log("\nc1:", child1, "\nc2:", child2);
  console.log("l1:", location1, "\nl2:", location2);
  console.log("c1:", getChild(child1.parent, location1));
  console.log("c2:", getChild(child2.parent, location2));*/
  let quad1 = getQuad(location1);
  let quad2 = getQuad(location2);
  if (CommutativeSwap.verify(child1, child2, quad1, quad2)) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);    ;
    let action = new CommutativeSwap(sibling1, sibling2, quad1);
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }

}

function expandCancel(child1, child2, location1, location2, root, nodeArray) {

  if (Cancel.verify(child1, child2, getQuad(location1), getQuad(location2))) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);
    let action = new Cancel(sibling1, sibling2);
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }

}

function expandCombineFrac(child1, child2, location1, location2, root, nodeArray) {

  if (CombineFrac.verify(child1, child2)) {
    let rootClone = root.clone();
    let tag = getChild(rootClone, location1);
    let action = new CombineFrac(tag);
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }

}

function expandDistribute(child1, child2, location1, location2, root, nodeArray) {
  
  let quad1 = getQuad(location1);
  let quad2 = getQuad(location2);
  if (Distribute.verify(child1, child2, quad1, quad2)) {
    let rootClone = root.clone();
    let value = getChild(rootClone, location1);
    let tagToDistributeOver = getChild(rootClone, location2);
    let action = new Distribute(value, tagToDistributeOver);
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }

}

function expandFactor(child1, child2, location1, location2, root, nodeArray) {
  
  if (Factor.verify(child1, child2)) {
    let rootClone = root.clone();
    let valueToFactor = getChild(rootClone, location1);
    let tagToFactor = getChild(rootClone, location2);
    let action = new Factor(valueToFactor, tagToFactor);
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }

}

//skip for now?
function expandIdentityBalence(nodeToExpand, nodeArray){
  
}

function expandIdentityMerge(child1, child2, location1, location2, root, nodeArray) {
  
  let quad1 = getQuad(location1);
  let quad2 = getQuad(location2);
  if (IdentityMerge.verify(child1, child2, quad1, quad2)) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);
    let action = new IdentityMerge(sibling1, sibling2, quad1, quad2);
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }
}

function expandLiteralConversion(child, location, root, nodeArray){
  
  if (LiteralConversion.verify(child)) {
    let rootClone = root.clone();
    let lit = getChild(rootClone, location);
    let action = new LiteralConversion(lit, getQuad(location));
    action.apply();
    nodeArray.push(new Node(rootClone, action));
  }
}

function expandLiteralMerge(nodeToExpand, nodeArray){
  
}

function expandQuadrantFlip(nodeToExpand, nodeArray){
  
}

function expnadSplitFrac(nodeToExpand, nodeArray){
  
}

function expandZeroMerge(nodeToExpand, nodeArray){
  
}

