import {
  AssociativeExtract,
  AssociativeInsert, AssociativeIntro,
  AssociativeMerge, Cancel, CombineFrac,
  CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
  QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
} from "./algebraic_actions";
import { ExpressionTree, Literal, Variable, Tag, Quadrant } from "./expression_tree";

export class Node {
  constructor(action, expression) {
    this.action = action;
    this.expression = expression;
  }


}

function additionalHeur(numDiff, a, b){
  var litA=0;
  var litB=0;
  var varA=0;
  var varB=0;
  var tagA=0;
  var tagB=0;
  if (a instanceof Tag){
    for(var i = 0; i<a.NW.length; i++){
      if (a.NW[i] instanceof Tag)
        tagA+=1;
      else if (a.NW[i] instanceof Literal)
        litA+=1;
      else
        varA+=1;
    }
    for(var i = 0; i<a.SE.length; i++){
      if (a.SE[i] instanceof Tag)
        tagA+=1;
      else if (a.SE[i] instanceof Literal)
        litA+=1;
      else
        varA+=1;
    }
  }
  else if (a instanceof Variable)
    varA += 1;
  else
    litA += 1;

  if (b instanceof Tag){
    for(var i = 0; i<b.NW.length; i++){
      if (b.NW[i] instanceof Tag)
        tagB+=1;
      else if (b.NW[i] instanceof Literal)
        litB+=1;
      else
        varB+=1;
    }
    for(var i = 0; i<b.SE.length; i++){
      if (b.SE[i] instanceof Tag)
        tagB+=1;
      else if (b.SE[i] instanceof Literal)
        litB+=1;
      else
        varB+=1;
    }
  }
  else if (b instanceof Variable)
    varB += 1;
  else
    litB += 1;
  
  return (numDiff+Math.abs(litA-litB)+Math.abs(varA-varB)+Math.abs(tagA-tagB))
}

function heuristicEval(a, b) {
  if (a == undefined || b == undefined)
    return Math.MAX_SAFE_INTEGER;
  if (a.equals(b))
    return 0;
  var numDiff = 0;
  if (a instanceof Tag) {
    if (b instanceof Tag) {
      var max = Math.min(a.NW.length, b.NW.length);
      numDiff += Math.abs(a.NW.length-b.NW.length);
      for (var i = 0; i < max; i++) {
        numDiff += heuristicEval(a.NW[i], b.NW[i]);
      }
      var max = Math.min(a.SE.length, b.SE.length);
      numDiff += Math.abs(a.SE.length-b.SE.length);
      for (var i = 0; i < max; i++) {
        numDiff += heuristicEval(a.SE[i], b.SE[i]);
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
    else if (b instanceof Variable)
      return 1;
    else
      return b.treeCount;
  }

  if (a instanceof Variable) {
    if (b instanceof Variable) {
      if (b.value == a.value)
        return 0;
      else
        return 1;
    }
    else if (b instanceof Literal){
      return 1;
    }
    else{
      return b.treeCount;
    }
  }

  return additionalHeur(numDiff, a, b);
}

export function solve(current, goal) {
  let nodeArray = [];
  let minHeuristic = Number.MAX_SAFE_INTEGER;
  let minIdx = -1;
  expand(current, nodeArray);
  for (let i = 0; i < nodeArray.length; i++) {
    // console.log(i, nodeArray[i]);
    let heuristic = heuristicEval(nodeArray[i].expression, goal);
    if (heuristic < minHeuristic) {
      minHeuristic = heuristic;
      minIdx = i;
    }
    console.log(heuristic, nodeArray[i]);
  }
  return (nodeArray[minIdx]);
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

export function probGenExpand(start){
  var nodeArray = [];
  expand(start, nodeArray);
  return nodeArray;
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
      expandSplitFrac(child1, child2, location1, location2, root, nodeArray);
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

  if (child1.parent !== null) {
    if (AssociativeExtract.verify(child1, child1.parent.parent)) {
      let rootClone = root.clone();
      let grandChild = getChild(rootClone, location1);
      let grandParent = grandChild.parent.parent;
      let action = new AssociativeExtract(grandChild, getQuad(location1), grandParent.childQuadrant(grandChild.parent));
      action.apply();
      nodeArray.push(new Node(action, rootClone));
    }
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
  let quad2 = getQuad(location2)
  if (CombineFrac.verify(child1, child2)) {
    let rootClone = root.clone();
    let sibling1 = getChild(rootClone, location1);
    let sibling2 = getChild(rootClone, location2);
    let action = new CombineFrac(sibling1, sibling2, quad1, quad2);
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
  if (child1.parent !== null && child1.parent.parent !== null) {
    let quad1 = child1.parent.childQuadrant(child1);
    let quad2 = child1.parent.parent.childQuadrant(child1.parent);
    if (QuadrantFlip.verify(child1, child1.parent, quad1, quad2)) {
      let rootClone = root.clone();
      let tag = getChild(rootClone, location1);
      let action = new QuadrantFlip(tag, quad1);
      action.apply();
      nodeArray.push(new Node(action, rootClone));
    }
  }
  else if(child1.parent !== null && child1.parent.equals(root)){
    let quad1 = child1.parent.childQuadrant(child1);
    let quad2 = null;
    if (QuadrantFlip.verify(child1, child1.parent, quad1, quad2)) {
      let rootClone = root.clone();
      let tag = getChild(rootClone, location1);
      let action = new QuadrantFlip(tag, quad1);
      action.apply();
      nodeArray.push(new Node(action, rootClone));
    }
  }

}

function expandSplitFrac(child1, child2, location1, location2, root, nodeArray) {

  if (SplitFrac.verify(child1, child2)) {
    let rootClone = root.clone();
    let tag = getChild(rootClone, location2);
    let action = new SplitFrac(tag); 
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

