

// USES OF ALGEBRAIC ACTIONS
// UI
// AI
// History Bar?
//   - Might just save instances of previous 


// USE CASE FOR UI
// User specify that a swap needs to happen between siblings A and B.
// Create a CommutativeSwap instance whose sibling arguments are A and B.
// Serialize and Compress the current expression tree and store it in the history bar.
// Apply that action on the current expression tree in the manipulator window.

// USE CASE FOR AI
// AI has a list of all algebraic actions, choose an element
// choose location on the expression tree
// verify that this action is valid for this location in the tree
// if it is valid, apply the action to the tree
// ...
// If that was a bad choice, undo the algebraic action.


// 1 + 2 => 2 + 1
// 1 * 2 => 2 * 1
class CommutativeSwap {
    constructor(sibling1, sibling2) {
        this.sibling1 = sibling1;
        this.sibling2 = sibling2;
    }

    verify() {
        // return this.sibling1 and this.sibling2 are actually siblings;
    }

    apply(exprTree) {
        exprTree.find();
        return new tree;
    }
}

