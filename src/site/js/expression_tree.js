const Orientation = {
  EW: "eastwest",
  NS: "northsouth"
};

const Quadrant = {
  NW: "NW",
  SE: "SE"
};

String.prototype.splice = function(index, str) {
  return this.slice(0, index) + str + this.slice(index);
};

// Abstract Class
class ExpressionTree {
  constructor(kind) {
    this.kind = kind;
    this.treeCount = 1;
    this.parent = null;
  }

  toString() {
    return "error";
  }
} // end ExpressionTree class

class Tag extends ExpressionTree {
  constructor(orientation, nw, se) {
    super("tag");
    this.orientation = orientation;
    this.NW = nw || [];
    this.SE = se || [];

    for (let child of this.NW) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
    for (let child of this.SE) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
  }

  // TreeCount keeps track of the number of Tags, Variables, and Literals
  // (including itself).
  updateParentTreeCount(count) {
    this.treeCount += count;
    if (this.parent != null) {
      this.parent.updateParentTreeCount(count);
    }
  }
  //
  addSouthEast(child) {
    this.SE.push(child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  prependSouthEast(child) {
    this.SE.splice(0, 0, child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  prependNorthWest(child) {
    this.NW.splice(0, 0, child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  addNorthWest(child) {
    this.NW.push(child);
    child.parent = this;
    const delta = child.treeCount;
    this.updateParentTreeCount(delta);
  }

  removeSouthEast(child) {
    this.SE = this.SE.filter(x => !Object.is(x, child));
    const delta = child.treeCount;
    this.updateParentTreeCount(-delta);
  }

  removeNorthWest(child) {
    this.NW = this.NW.filter(x => !Object.is(x, child));
    const delta = child.treeCount;
    this.updateParentTreeCount(-delta);
  }

  equals(that) {
    if (that.kind === "tag") {
      if (
        this.orientation !== that.orientation ||
        this.NW.length !== that.NW.length ||
        this.SE.length !== that.SE.length
      ) {
        return false;
      }

      for (let i = 0; i < this.NW.length; i++) {
        if (!this.NW[i].equals(that.NW[i])) return false;
      }

      for (let i = 0; i < this.SE.length; i++) {
        if (!this.SE[i].equals(that.SE[i])) return false;
      }

      return true;
    } else {
      return false;
    }
  }

  delete(ref) {
    array_delete(this.SE, ref);
    array_delete(this.NW, ref);
  }

  // Creates dom elements for the tag, returns dom node without putting
  // it on the page.
  render() {
    const div = document.createElement("div");
    div.classList.add(
      this.orientation.splice(this.orientation.length / 2, "-")
    );

    div.classList.add("tag");
    div.setAttribute("data-id", this);

    const nw = document.createElement("div");
    nw.className = "north-west";

    const button = document.createElement("div");
    button.className = "tag-button";

    const se = document.createElement("div");
    se.className = "south-east";

    this.NW.forEach(child => {
      nw.appendChild(child.render());
    });

    this.SE.forEach(child => {
      se.appendChild(child.render());
    });

    div.appendChild(nw);
    div.appendChild(button);
    div.appendChild(se);
    return div;
  }

  toString() {
    var retval =
      "{t" +
      Object.keys(Orientation).find(
        key => Orientation[key] === this.orientation
      ) +
      "{{";
    for (let i = 0; i < this.NW.length; i++) {
      retval = retval + this.NW[i].toString();
    }
    retval = retval + "}{";
    for (let i = 0; i < this.SE.length; i++) {
      retval = retval + this.SE[i].toString();
    }
    return retval + "}}}";
  }
} // end Tag class

class Variable extends ExpressionTree {
  constructor(value) {
    super("variable");
    this.value = value;
  }

  equals(that) {
    if (that.kind !== "variable") return false;
    return this.value === that.value;
  }

  // Creates dom elements for the tag, returns dom node without putting
  // it on the page.
  render() {
    const div = document.createElement("div");
    div.textContent = `x${this.value}`;
    div.className = "variable";
    div.setAttribute("data-id", this);
    return div;
  }

  toString() {
    return "{v" + this.value + "}";
  }
} // end Variable class

class Literal extends ExpressionTree {
  constructor(value) {
    super("literal");
    this.value = value;
  }

  equals(that) {
    if (that.kind !== "literal") return false;
    return this.value === that.value;
  }

  // Creates dom elements for the tag, returns dom node without putting
  // it on the page.
  render() {
    const div = document.createElement("div");
    div.textContent = this.value;
    div.className = "literal";
    div.setAttribute("data-id", this);
    return div;
  }

  toString() {
    return "{l" + this.value + "}";
  }
} // end Literal class

// end of classes, start of functions

function array_delete(arr, ref) {
  for (let i = 0; i < arr.length; i++) {
    if (Object.is(ref, arr[i])) {
      arr.splice(i, 1);
    }
  }
}

function Deserialize(text) {
  // eric
  if (text.substr(0, 2) === "{l") {
    return new Literal(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{v") {
    return new Variable(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{t") {
    let orient = Orientation[text.substr(2, 2)];
    let retval = new Tag(orient);
    let firstindex = text.indexOf("{{") + 1;
    let lastindex = text.length - 2;
    // helper(text.substr(firstindex,lastindex-firstindex));
    let midindex = 0;
    let counter = 0;
    for (let i = firstindex; i < text.length; i++) {
      if (text.charAt(i) === "{") {
        counter++;
      } else if (text.charAt(i) === "}") {
        counter--;
        if (counter === 0) {
          midindex = i;
          break;
        }
      }
    }
    let t1 = text.substr(firstindex, midindex - firstindex + 1);
    // helper(t1);
    let tempstr = "";
    if (t1 !== "{}") {
      for (let i = firstindex + 1; i < midindex; i++) {
        tempstr = tempstr + text.charAt(i);
        if (text.charAt(i) === "{") {
          counter++;
        } else if (text.charAt(i) === "}") {
          counter--;
          if (counter === 0) {
            // helper(tempstr);
            let d = Deserialize(tempstr);
            retval.addNorthWest(d);
            tempstr = "";
          }
        }
      }
    }
    let t2 = text.substr(midindex + 1, lastindex - midindex - 1);
    // helper(t2);
    tempstr = "";
    if (t2 !== "{}") {
      for (let i = midindex + 2; i < lastindex - 1; i++) {
        tempstr = tempstr + text.charAt(i);
        if (text.charAt(i) === "{") {
          counter++;
        } else if (text.charAt(i) === "}") {
          counter--;
          if (counter === 0) {
            // helper(tempstr);
            let d = Deserialize(tempstr);
            retval.addSouthEast(d);
            tempstr = "";
          }
        }
      }
    }
    return retval;
  }
}

function compress_string_js(text, callback) {
  var arr;
  /// If the string is a JSON array, use that. This allows us to compress a byte array.
  if (text[0] === "[" && text.slice(-1) === "]") {
    try {
      arr = JSON.parse(text);
    } catch (e) {}
  }
  if (arr) {
    text = arr;
  }
  LZMA("http://localhost:8080/src/site/js/lzma_worker.js").compress(text, 9, callback);
}

function decompress_string_js(byte_arr, callback) {
  LZMA("http://localhost:8080/src/site/js/lzma_worker.js").decompress(byte_arr, callback);
}

/// ///////////////////////////////////////////////////////////////////
/// //////////////////        Unused Functions   //////////////////////

function helper(text) {
  let rettext = "";
  let temp = 0;
  let zeroamt = 0;
  let i = 0;
  for (i = 0; i < text.length; i++) {
    if (text.charAt(i) === "{") {
      temp++;
      rettext = rettext + temp.toString();
    } else if (text.charAt(i) === "}") {
      rettext = rettext + temp.toString();
      temp--;
      if (temp === 0) {
        zeroamt++;
      }
    } else {
      rettext = rettext + " ";
    }
  }
  console.log(text);
  console.log(rettext + "  :  " + (temp === 0) + "  :  " + zeroamt);
}

/// /////////////////////////////////////////////////////////////////////////////
