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
// Takes in two siblings and a quadrant(the list where the siblings are located).
// If the siblings and quadrant are valid, then the siblings will be swapped.
class CommutativeSwap {

  constructor (sibling1, sibling2, quadrant) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrant = quadrant;
  }

  //verifys if the arguments are valid by checking
  //if the Siblings are in the same quadrant, then return true
  verify () {
    return quadrant.includes(sibling2)
        && quadrant.includes(sibling1);
  }

  //
  apply (exprTree) {

    //Finds the index of the two siblings
    idx1 = quadrant.findIndex(x => x === sibling1);
    idx2 = quadrant.findIndex(x => x === sibling2);

    //create a new array for the return tree
    newQuadrant = [];

    //constructs the the array,
    //if i matches one of the indices of the siblings,
    //then the other sibling will be added
    for (var i = 0; i < quadrant.length; i++) {
      if (i === idx1) {
        newQuadrant[i] = sibling2;
      }
      if (i === idx2) {
        newQuadrant[i] = sibling1;
      }
      newQuadrant[i] = quadrant[i];
    }

    //if quadrant was NW, then replace NW, else replace SE
    if (quadrant.equals(sibling1.parent.NW)) {
      return new Tag(sibling1.parent.orientation, newQuadrant, sibling1.parent.SE);
    } else {
      return new Tag(sibling1.parent.orientation, sibling1.parent.NW, newQuadrant);
    }
  }
}

// (1 + 2) + 1 => 1 + 2 + 1
//Takes two tags of the same orientation and one is in the other.
//The inner tag is collapsed into the outer tag
class AssociativeMerge {
  constructor(sibling, parent, quadrant) {
    this.sibling = sibling;
    this.parent = parent;
    this.quadrant = quadrant;
  }

  //verifys if the arguments are valid by checking
  //if the sibling is included in the parent
  //then return true
  verify() {
    return parent.NW.includes(sibling)
        || (parent.SE.includes(sibling) && parent.orientation === "eastwest");
  }


  apply(exprTree) {
    //Find the index of sibling
    idx = quadrant.findIndex(x => x === sibling);

    //make a new array for new tree
    newQuadrant = [];

    //add expressions into new quadrant
    for(let child of quadrant) {
      if(child.equals(sibling)) {
        for(let siblingChild of sibling) {
          newQuadrant.push(siblingChild);
        }
      }
      newQuadrant.push(child);
    }

    if(quadrant.equals(parent.NW)) {
      return new Tag(parent.orientation, newQuadrant, sibling.parent.SE);
    } else {
      return new Tag(parent.orientation, sibling.parent.NW, newQuadrant);
    }
  }
}

//Takes an array of siblings in the same tag and surrounds those
//siblings with a tag of the same orientation
class AssociativeIntro {

  constructor(siblings, parent, quadrant) {
    this.siblings = siblings;
    this.parent = parent;
    this.quadrant = quadrant;
  }

  //Valid if siblings is in parent in the correct order
  verify() {

  }

  apply(exprTree) {

    //make the inner tag
    if (quadrant.equals(parent.NW)){
      var newTag = new Tag(parent.orientation, siblings);
    } else {
      var newTag = new Tag(parent.orientation, [], siblings);
    }

    //find the index of the first sibling
    idx = quadrant.findIndex(x => x.equals(sibling[0]));

    newQuadrant = [];
    for (var i = 0; i < quadrant.length - siblings.length; i++) {
      if(i === idx) {
        newQuadrant[i] = newTag;
      }
      newQuadrant[i] = quadrant[i];
    }

    if(quadrant.equals(parent.NW)) {
      return new Tag(parent.orientation, newQuadrant, sibling.parent.SE);
    } else {
      return new Tag(parent.orientation, sibling.parent.NW, newQuadrant);
    }
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

  }
}
