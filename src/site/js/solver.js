import {
  AssociativeExtract,
  AssociativeInsert, AssociativeIntro,
  AssociativeMerge, Cancel, CombineFrac,
  CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
  QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
} from "./algebraic_actions";
import { ExpressionTree, Literal, Variable, Tag, Quadrant } from "./expression_tree";

class Node {
  constructor(action, expression) {
    this.action = action;
    this.expression = expression;
  }


}

function heuristicEval(a, b) {
  if (a.equals(b))
    return 0;
  if (a instanceof Tag) {
    if (b instanceof Tag) {
      for (var i = 0; i < a.length; i++) {

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
  dumbExpand(expTree, nodeArray);
}

function pushAllChildren(root, childArray, location, locationArr) {
  //pushing child and location into respective arrays 
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

  for (let current of location) {
    (current & 1 === 1) ? expTree = expTree.SE[current>>1] : expTree = expTree.NW[current>>1]
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
      expandFactor(child1, child2, location1, location2, root, nodeArray);
      expandIdentityMerge(child1, child2, location1, location2, root, nodeArray);
      expandLiteralMerge(child1, child2, location1, location2, root, nodeArray);
      expandQuadrantFlip(child1, child2, location1, location2, root, nodeArray);
      expnadSplitFrac(child1, child2, location1, location2, root, nodeArray);
      expandZeroMerge(child1, child2, location1, location2, root, nodeArray);
      
    }
  }
}

function expandAssociativeIntro(child, location, root, nodeArray) {
  
  if (AssociativeIntro.verify(child)) {
    let rootClone = root.clone();
    let expTree = getChild(rootClone, location);
    let action = new AssociativeIntro(expTree);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
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
    nodeArray.push(new Node(action, rootClone));
  }

}

function expandAssociativeExtract(child1, child2, location1, location2, root, nodeArray) {

  if (AssociativeExtract.verify(child1, child2)) {
    let rootClone = root.clone();
    let grandChild = getChild(rootClone, location1);
    let action = new AssociativeExtract(grandChild, getQuad(location1));
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }

}

function expandAssociativeInsert(child1, child2, location1, location2, root, nodeArray) {

  if (AssociativeInsert.verify(child1, child2)) {
    let rootClone = root.clone();
    let sibling = getChild(rootClone, location1);
    let insertionTag = getChild(rootClone, location2);
    let action = new AssociativeInsert(sibling, insertionTag);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }

}

function expandCommutativeSwap(child1, child2, location1, location2, root, nodeArray) {
 
  let quad1 = getQuad(location1);
  let quad2 = getQuad(location2);
  if (CommutativeSwap.verify(child1, child2, quad1, quad2)) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);    ;
    let action = new CommutativeSwap(sibling1, sibling2, quad1);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }

}

function expandCancel(child1, child2, location1, location2, root, nodeArray) { 

  if (Cancel.verify(child1, child2, getQuad(location1), getQuad(location2))) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);
    let action = new Cancel(sibling1, sibling2);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }

}

function expandCombineFrac(child1, child2, location1, location2, root, nodeArray) {

  let quad1 = getQuad(location1);
  if (CombineFrac.verify(child1, child2)) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);
    let action = new CombineFrac(sibling1, sibling2, quad1);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
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
    nodeArray.push(new Node(action, rootClone));
  }

}

function expandFactor(child1, child2, location1, location2, root, nodeArray) {
  
  if (Factor.verify(child1, child2)) {
    let rootClone = root.clone();
    let valueToFactor = getChild(rootClone, location1);
    let tagToFactor = getChild(rootClone, location2);
    let action = new Factor(valueToFactor, tagToFactor);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
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
    nodeArray.push(new Node(action, rootClone));
  }
}

function expandLiteralConversion(child, location, root, nodeArray) {
  
  if (LiteralConversion.verify(child)) {
    let rootClone = root.clone();
    let lit = getChild(rootClone, location);
    let action = new LiteralConversion(lit, getQuad(location));
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }
}

function expandLiteralMerge(child1, child2, location1, location2, root, nodeArray) {
  
  let quad1 = getQuad(location1);
  let quad2 = getQuad(location2);
  if (LiteralMerge.verify(child1, child2, quad1, quad2)) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);
    let action = new LiteralMerge(sibling1, sibling2, quad1, quad2);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }
}

function expandQuadrantFlip(child1, child2, location1, location2, root, nodeArray) {
  
  let quad1 = getQuad(location1);
  let quad2 = getQuad(location2); 
  if (QuadrantFlip.verify(child1, child2, quad1, quad2)) {
    let rootClone = root.clone();
    let tag = getChild(rootClone, location1);
    let action = new QuadrantFlip(tag, quad1);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }

}

function expnadSplitFrac(child1, child2, location1, location2, root, nodeArray) {

  if (SplitFrac.verify(child1, child2)) {
    let rootClone = root.clone();
    let tag = getChild(rootClone, location1);
    let action = new QuadrantFlip(tag); 
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }
  
}

function expandZeroMerge(child1, child2, location1, location2, root, nodeArray) {

  if (ZeroMerge.verify(child1, child2, getQuad(location1), getQuad(location2))) {
    let rootClone = root.clone()
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);
    let action = new ZeroMerge(sibling1, sibling2);
    action.apply();
    nodeArray.push(new Node(action, rootClone));
  }

}

