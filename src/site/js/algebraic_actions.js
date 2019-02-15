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

  constructor (sibling1, sibling2, quadrantLabel) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrantLabel = quadrantLabel;
  }

  //verifys if the arguments are valid by checking
  //if the Siblings are in the same quadrant, then return true
  verify () {
    const quadrant = this.sibling1.parent[this.quadrantLabel];
    return this.sibling1.parent === this.sibling2.parent
        && quadrant.some(x => Object.is(x, sibling2))
        && quadrant.some(x => Object.is(x, sibling1));
  }

  //
  apply () {

    const quadrant = this.sibling1.parent[this.quadrantLabel];

    //Finds the index of the two siblings
    var idx1 = quadrant.findIndex(x => Object.is(x, this.sibling1));
    var idx2 = quadrant.findIndex(x => Object.is(x, this.sibling2));

    //create a new array for the return tree
    var newQuadrant = [];

    //constructs the the array,
    //if i matches one of the indices of the siblings,
    //then the other sibling will be added
    for (var i = 0; i < quadrant.length; i++) {
      if (i === idx1) {
        newQuadrant[i] = this.sibling2;
      } else if (i === idx2) {
        newQuadrant[i] = this.sibling1;
      } else {
        newQuadrant[i] = quadrant[i];
      }
    }

    //if quadrant was NW, then replace NW, else replace SE
    if (this.quadrantLabel === Quadrant.NW) {
      this.sibling1.parent.NW = newQuadrant;
    } else {
      this.sibling1.parent.SE = newQuadrant;
    }
  }
}

// (1 + 2) + 1 => 1 + 2 + 1

// (1 - 2) + 1 => (1 + 1 - 2)

// APPLY ASSOCIATIVE MERGE
// [ [1><2] 1 ><]
//                        Apply AssociativeMerge.
// [ 1 1 >< 2 ]

// APPLY ASSOCIATIVE INTRO
// [1 2 >< 1]
//                       Apply AssociativeIntro.
// [ [1 2 >< 1] ><]

// APPLY ASSOCIATIVE INTRO
// 1
//                       Apply AssociativeIntro.
// [ 1 ><]

// APPLY ASSOCIATIVE INTRO
// [1 2 >< 1]
//                       Apply AssociativeIntro.
// [ [1><] 2 >< 1]

// UNDO ASSOCIATIVE MERGE
// [ 1 1 >< 2 ]
//                        Enclose entire tag in tag of same orientation.
// [ [1 1><2] ><]
//                        Apply new kind of AssociativeIntro.
// [ [ 1 [1><2] ><] ><]
//                        Merge outer two tags.
// [ 1 [1><2] ><]
//                        Apply a commutative swap.
// [ [1><2] 1 ><]

// CRAZY ASSOCIATIVE INTRO
// [1 2 >< 3]  <=Merge=  [1 [2><3] ><]
//
// [1 [2><] >< 3]
// 
// [1 [2><] >< [3><]]
// 
// [1 [2><3] ><]


//Takes two tags of the same orientation and one is in the other.
//The inner tag is collapsed into the outer tag
class AssociativeMerge {
  constructor(sibling, parent, quadrantLabel) {
    this.sibling = sibling;
    this.parent = parent;
    this.quadrantLabel = quadrantLabel;
  }

  //verifys if the arguments are valid by checking
  //if the sibling is included in the parent
  //then return true
  verify() {
    return this.parent.NW.includes(this.sibling)
        || (this.parent.SE.includes(this.sibling) && this.parent.orientation === Orientation.EW);
  }


  apply() {

    const quadrant = this.parent[this.quadrantLabel];

    //make a new array for new tree
    var newQuadrantNW = [];
    var newQuadrantSE = [];

    // If the sibling is in the NW quadrant...
    if (this.quadrantLabel === Quadrant.NW) {

      //add expressions into new quadrant
      for(let child of quadrant) {

        if(Object.is(child, this.sibling)) {

          for(let siblingChildNW of child.NW) {
            newQuadrantNW.push(siblingChildNW);
          }
          
          for(let siblingChildSE of child.SE) {
            newQuadrantSE.push(siblingChildSE);
          }

        } else {
          newQuadrantNW.push(child);
        }
      }

      // Add everything from the parent's SE quadrant into the new SE quadrant.
      for(let child of this.parent.SE) {
        newQuadrantSE.push(child);
      }

    } else { // SE quadrant

      // Add everything from the parent's NW quadrant into the new NW quadrant.
      for(let child of this.parent.NW) {
        newQuadrantNW.push(child);
      }


      //add expressions into new quadrant
      for(let child of quadrant) {

        if(Object.is(child, this.sibling)) {

          for(let siblingChildNW of child.NW) {
            newQuadrantSE.push(siblingChildNW);
          }
          
          for(let siblingChildSE of child.SE) {
            newQuadrantNW.push(siblingChildSE);
          }

        } else {
          newQuadrantSE.push(child);
        }
      }
    }

    this.parent.NW = newQuadrantNW;
    this.parent.SE = newQuadrantSE;
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
    var idx = quadrant.findIndex(x => x === siblings[0]);
    for (let child of siblings) {
      if (!child.equals(quadrant[idx])) {
        return false;
      }
      idx++;
    }
    return true;
  }

  apply() {

    //make the inner tag
    if (this.quadrant.equals(this.parent.NW)){
      var newTag = new Tag(this.parent.orientation, this.siblings);
    } else {
      var newTag = new Tag(this.parent.orientation, [], this.siblings);
    }

    //find the index of the first sibling
    var idx = this.quadrant.findIndex(x => x.equals(sibling[0]));

    var newQuadrant = [];
    for (var i = 0; i < this.quadrant.length - siblings.length; i++) {
      if(i === idx) {
        newQuadrant[i] = newTag;
      }
      newQuadrant[i] = quadrant[i];
    }

    if(this.quadrant.equals(this.parent.NW)) {
      return new Tag(this.parent.orientation, newQuadrant, this.parent.SE);
    } else {
      return new Tag(this.parent.orientation, this.parent.NW, newQuadrant);
    }
  }
}

class AssociativeExtract {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(grandchild, quadrantLabel) {
    this.grandchild = grandchild;
    this.quadrantLabel = quadrantLabel;
  }

  verify() {
    return this.grandchild.parent !== null
        && this.grandchild.parent.parent !== null;
  }

  apply() {
    const parent = this.grandchild.parent;
    const grandparent = parent.parent;

    if (this.quadrantLabel === Quadrant.NW) {
      parent.removeNorthWest(this.grandchild);
      grandparent.prependNorthWest(this.grandchild);
    } else {
      parent.removeSouthEast(this.grandchild);
      grandparent.prependSouthEast(this.grandchild);
    }
  }
}

// [ x [ y >< z ] ><]
// =>
// [ [ x y >< z ] ><]
class AssociativeInsert {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(sibling, insertionTag) {
    this.sibling = sibling;
    this.insertionTag = insertionTag;
  }

  verify() {
    return this.grandchild.parent !== null
        && this.grandchild.parent.parent !== null;
  }

  apply() {
    const parent = this.sibling.parent;

    parent.removeNorthWest(this.sibling);
    this.insertionTag.prependNorthWest(this.sibling);
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

  apply() {

  }
}

class Factor {
  constructor(sibling1, sibling2, valueToFactor) {
    this.sibling1 = sibling1;
    this.siblinh2 = sibling2;
    this.valueToFactor = valueToFactor;
  }

  verify() {
    // return this.sibling1 and this.sibling2 are actually siblings;
    return this.sibling1.parent.parent == this.sibling2.parent.parent
           && this.sibling1.parent.parent.orientation == "eastwest"
           && this.sibling1.parent.orientation == "northsouth"
           && this.sibling2.parent.orientation == "northsouth"
           && ((this.sibling1.parent.NW.indexOf(this.valueToFactor)!=-1 &&  this.sibling2.parent.NW.indexOf(this.valueToFactor)!=-1)
           || (this.sibling1.parent.SE.indexOf(this.valueToFactor)!=-1 &&  this.sibling2.parent.SE.indexOf(this.valueToFactor)!=-1));
  }

  apply() {

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

  apply() {
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

  apply() {
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

  apply() {
  }
}

class IdentityBalance {
  constructor(sibling) {
    this.sibling = sibling;
  }

  verify() {
    // return this.sibling1 and this.sibling2 are actually siblings;
  }

  apply() {

  }
}
