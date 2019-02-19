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

//Encloses a tag with another tag of the same orientation
class AssociativeIntro {

  constructor(tag) {
    this.tag = tag;
  }

  //Valid if siblings is in parent in the correct order
  verify() {
    return this.tag instanceof Tag;
  }

  apply() {
    let copy = Object.assign(this.tag);
    this.tag = new Tag(copy.orientation, [copy]);
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
  constructor(parent, value) {
    this.parent = parent;
    this.value = value;
  }

  verify() {
    // return this.sibling1 and this.sibling2 are actually siblings;
  }

  apply() {

  }
}

class Factor {
  constructor(parent, valueToFactor, indxStart, indxEnd, quadrantLabel) {
    this.parent = parent;
    this.valueToFactor = valueToFactor;
    this.indxEnd = indxEnd;
    this.indxStart = indxStart;
    this.quadrantLabel = quadrantLabel;
  }

  verify() {
    if(parent.orientation != "eastwest")
      return false;
    var isGood = true;
    if(this.quadrantLabel == "NW")
    for(var i = indxStart; i<indxEnd+1; i++){
      for(var j = 0; j<parent.NW[i].NW.length; j++){
        isGood = (parent.NW[i].NW[j].value == valueToFactor)
        if (isGood)
          break;

      }
      if(!isGood)
        return false;
    }
    else
      for(var i = indxStart; i<indxEnd+1; i++){
        for(var j = 0; j<parent.SE[i].SE.length; j++){
          isGood = (parent.SE[i].NW[j].value == valueToFactor)
          if (isGood)
            break;

        }
        if(!isGood)
          return false;
      }

    return false;

  }



  apply() {
    var operatorsArr = parent.NW.slice(this.indxStart, this.indxEnd+1);
    var factored;
    for(var i = 0; i<operatorsArr.length; i++){
      for(var j = 0; j<operatorsArr[i].NW.length; j++){
        if(operatorsArr[i].NW[j].value == valueToFactor){
          factored = operatorsArr[i].NW[j];
          operatorsArr[i].NW.splice(j, 1);
        }
      }
    }
    parent.NW.splice(indxStart, indxEnd-indxStart);

    var multTag = new Tag("northsouth");
    var addTag = new Tag("eastwest", operatorsArr);
    multTag.prependNorthWest(addTag);
    multTag.prependNorthWest(factored);
    parent.prependNorthWest(multTag);
    // Todo: Find how a valueToFactor in SE would work

  }
}

class SplitFrac {
  constructor(tag) {
    this.tag = tag;
  }

  verify() {
    let dividend = this.tag.NW[0];
    return this.tag.orientation === Orientation.NS
        && divident.orientation === Orientation.EW
        && (dividend.NW.length+dividend.SE.length > 1)
        && this.tag.SE.length <= 1;
  }

  apply() {

    //create empty array to put split fractions
    let newNW = [];
    let newSE = [];
    let divisor = this.tag.SE;

    //Push the split fractions into their respective quadrants
    for (let child of this.tag.NW[0].NW) {
      newNW.push(new Tag(Orientation.NS, [child], divisor));
    }
    for(let child of this.tag.NW[0].SE) {
      newSE.push(new Tag(Orientation.NS, [child], divisor));
    }

    //update the tag with new orientation and quadrants
    this.tag.orientation = Orientation.EW;
    this.tag.emptyNorthWest();
    for (let child of newNW) {
      this.tag.addNorthWest(child);
    }
    this.tag.emptySouthWest();
    for (let child of newSE) {
      this.tag.addSouthEast(child);
    }
  }
}

class CombineFrac {
  //Where sibligns is the list of
  constructor(tag) {
    this.tag = tag;
  }

  verify() {
    if (tag.orientation !== Orientation.EW) {
      return false;
    }
    let divisor = tag.SE;
    for (let child of siblings) {
      if (child.SE !== divisor) {
        return false;
      }
    }
    return true;
  }

  apply() {

    let newNW = [];
    let newSE = [];
    let divisor = [];
    for (let child of this.tag.NW) {
      newNW = newNW.concat(child.NW);
      divisor = child.SE;
    }
    for (let child of this.tag.SE) {
      newSE = newSE.concat(child.NW);
      divisor = child.SE;
    }

    let dividend = new Tag(Orientation.EW, newNW, newSE);
    this.tag.orientation = Orientation.NS;
    this.tag.emptyNorthWest();
    this.tag.addNorthWest(dividend);
    this.tag.emptySouthWest();
    for (let child of divisor) {
      this.tag.addSouthEast(child);
    }
  }
}

// [x><]
// =>
// [><[><x]]
//x = 1/(1/x)
//x = -(-x)
//TODO: get a better name for this.
class QuadrantFlip {
  constructor(tag, quadrantLabel) {
    this.tag = tag;
    this.quadrantLabel = quadrantLabel;
  }

  verify() {
    return this.tag instanceof Tag
        && this.tag.parent !==null;
  }

  apply() {

    //
    const parent = this.tag.parent;

    //Swapping quadrants
    const temp = this.tag.NW;
    this.tag.NW = this.tag.SE;
    this.tag.SE = temp;

    if (this.quadrantLabel === Quadrant.NW) {
      parent.addSouthEast(this.tag);
      parent.removeNorthWest(this.tag);
    } else {
      parent.addNorthWest(this.tag);
      parent.removeSouthEast(this.tag);
    }

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
