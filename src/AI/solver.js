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
  if (a == b)
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
  var head = Node(hesuristicEval(a, b), null, null, a, 0);
  var nodeArray = [];
  var expanded = [];
  nodeArray.push(head);
  var currentNodeIndex;
  while (nodeArray.length != 1){
    if(currentNode.currentExpression == b){
      solutions.push(currentNode);
    }
  }

  var optimalIndex = 0;
  var counter = 0;
}

function expand(nodeToExpaand, nodeArray, expanded){
  
}
