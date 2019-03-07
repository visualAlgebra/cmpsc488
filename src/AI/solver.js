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
  /*
    Pseudocode:
    While (unexpandedNodeList != goal)
    try different actions
    add resulting node to node list
    node = select next node with best heuristic value
    end while
    findOptimal(validSolutionsList)
   */
  // I do not know what the expressions will look like yet, so a an b are not yet usable
  var nodeArray = [];
  var solutions = [];
  nodeArray.push(head);
  var currentNode;
  // This will be used to add nodes that will be created, when there is an answer found add it to solutions
  // Since A* looks for the best answer, we can not stop once we find an answer, but we can stop when all unexpanded
  // nodes are valid answers
  while (nodeArray.length != solutions.length){
    if(currentNode.currentExpression == b){
      solutions.push(currentNode);
    }
  }

  var optimalIndex = 0;
  var counter = 0;
  // Find the solution with the smallest number of moves used
  while(counter != solutions.size){
    if (solutions[counter].numberOfMoves < solutions[optimalIndex].numberOfMoves){
      optimalIndex = counter;
    }
    counter += 1;
  }
  currentNode = solutions[optimalIndex];
  // Find the node that resulted from the best first action
  while(currentNode.previousNode.currentExpression != a){
    currentNode = currentNode.previousNode;
  }
}
