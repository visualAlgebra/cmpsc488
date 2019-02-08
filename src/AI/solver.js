class Node{
   constructor(heuristic, previousNode, previousAction, currentExpression, numberOfMoves){
    this.heuristic = heuristic;
    this.previousNode = previousNode;
    this.action = previousAction;
    this.currentExpression = currentExpression;
    this.numberOfMoves = numberOfMoves;
  }


}

function heuristicEval(a, b){

}
function solve(a, b){
  var head = Node(hesuristicEval(a, b), null, null, a, 0);
  /*
    Pseudocode:
    While (unepandedNodeList != goal)
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
