class Node{
   constructor(heuristic, previousNode, previousAction, currentExpression, numberOfMoves){
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
          numDiff += b.NW[i].treeCount;
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
function solve(a, b){
  if(a.equals(b))
    return null;
  var head = Node(hesuristicEval(a, b), null, null, a, 0);
  var nodeArray = [];
  var expanded = [];
  nodeArray.push(head);
  var currentNodeIndex;
  var currentNode = head;
  var optimalNode = null;
  while (nodeArray.length != 0){
    if(currentNode.currentExpression.equals(b)){
      optimalNode = currentNode;
      break;
    }
    else{
      if (expanded.filter(x => (x.currentExpression.equals(currentNode.currentExpression))).length != 0)
        expand(currentNode, nodeArray, expanded);
      else
      {
        var dup = expanded.filter(x => (x.currentExpression.equals(currentNode.currentExpression)))[0];
        if ((dup.heuristic + dup.numberOfMoves) > (currentNode.heuristic + currentNode.numberOfMoves)){
          dup = currentNode;
        }

      }
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
  }

  if (optimalNode == null)
    return null;
    
  while (!currentNode.previousNode.currentExpression.equals(a)){
    currentNode = currentNode.previousNode;
  }

  return currentNode.previousAction;
}

function expand(nodeToExpaand, nodeArray, expanded){

}
