

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
    constructor(sibling1, sibling2, quadrant) {
        this.sibling1 = sibling1;
        this.sibling2 = sibling2;
        this.quadrant = quadrant;
    }

    verify() {
        // return sibling1.parent.SE === sibling2.parent.SE
        //     || sibling1.parent.NW === sibling2.parent.NW;
        return quadrant.includes(sibling2)
            && quadrant.includes(sibling1);
    }

    apply(exprTree) {
        idx1 = quadrant.findIndex(x => x === sibling1);
        idx2 = quadrant.findIndex(x => x === sibling2);
        newQuadrant = [];
        for (var i = 0; i < quadrant.length; i++) {
          if (i === idx1) {
            newQuadrant[i] = sibling2;
          }
          if (i === idx2) {
            newQuadrant[i] = sibling1;
          }
          newQuadrant[i] = quadrant[i];
        }

        if (quadrant.equals(sibling1.parent.NW)) {
          return new tree(sibling1.parent.orientation, newQuadrant);
        } else {
          return new tree(sibling1.parent.orientation, sibling1.parent.NW, newQuadrant);
        }
    }
}

// (1 + 2) + 1 => 1 + 2 + 1
class AssociativeMerge {
    constructor(sibling1, sibling2) {
        this.sibling1 = sibling1;
        this.sibling2 = sibling2;
    }

    verify() {
        return sibling1.parent === sibling2.parent;
    }

    apply(exprTree) {
        exprTree.find();
        return new tree;
    }
}

class AssociativeIntro {
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

class Distribute {
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

class Factor {
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

class SplitFrac {
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

class CombineFrac {
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

class Cancel {
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

class IdentityBalance {
    constructor(sibling) {
        this.sibling = sibling;
    }

    verify() {
        // return this.sibling1 and this.sibling2 are actually siblings;
    }

    apply(exprTree) {
        exprTree.find();
        return new tree;
    }
}
