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

class ProblemInfo {
  constructor(id,treestart,treegoal){
    this.problem_id=id;
    this.expression_start=treestart;
    this.expression_goal=treegoal
  }

  toString(){
    return "{_PROBLEM{"+this.problem_id+"}{"+this.expression_start.toString()+"}{"+this.expression_goal.toString()+"}}";
  }
}

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
    return TagGuiModule.render(this);
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
  compress() {
    compress_string_js(this.toString(),res => {
      console.log(JSON.stringify(res));
    });
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
    return VariableGuiModule.render(this);
  }

  toString() {
    return "{v" + this.value + "}";
  }

  compress() {
    compress_string_js(this.toString(),res => {
      console.log(JSON.stringify(res));
    });
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
    return LiteralGuiModule.render(this);
  }

  toString() {
    return "{l" + this.value + "}";
  }
  
  compress() {
    compress_string_js(this.toString(),res => {
      console.log(JSON.stringify(res));
    });
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
var avgslowtime=0.0;
var avgslowtimenum=0;
var avgfasttime=0.0;
var avgfasttimenum=0;
function Deserialize(text) {
  let now=0;
  try{
    avgfasttimenum++;
    now=Date.now();
    let retval=DeserializeFast(text);
    now=Date.now()-now;
    avgfasttime=((avgfasttime*avgfasttimenum)+now)/(avgfasttimenum+1);
    return retval;
  }
  catch(err){
    //console.log(err.toString());
    avgfasttimenum--;
    avgslowtimenum++;
    now=Date.now();
    let retval=DeserializeSlow(text);
    now=Date.now()-now;
    avgslowtime=((avgslowtime*avgslowtimenum)+now)/(avgslowtimenum+1);
    return retval;
  }
}
function DeserializeFast(text){
  throw 'Fast deserialize failed, Using old deserialize.';
}
function DeserializeSlow(text) {
  // eric
  if (text.substr(0, 2) === "{l") {
    return new Literal(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{v") {
    return new Variable(parseInt(text.substr(2, text.length - 3)));
  }
  if (text.substr(0, 2) === "{t") {
    //console.log("text: "+text);
    let orient = Orientation[text.substr(2, 2)];
    let retval = new Tag(orient);
    let firstindex = text.indexOf("{{") + 1;
    let lastindex = text.length - 2;
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
    let e=[firstindex,midindex,lastindex];
    let t1 = text.substr(e[0], e[1] - e[0] + 1);
    let t2 = text.substr(e[1] + 1, e[2] - e[1] - 1);
    //query_add(text,e[0],e[1]+1,e[1]+1,e[2]);
    //console.log("split: "+t1+" , "+t2);
    let tempstr = "";
    if (t1 !== "{}") {
      for (let i = e[0] + 1; i < e[1]; i++) {
        tempstr = tempstr + text.charAt(i);
        if (text.charAt(i) === "{") {
          counter++;
        } else if (text.charAt(i) === "}") {
          counter--;
          if (counter === 0) {
            let d = Deserialize(tempstr);
            retval.addNorthWest(d);
            tempstr = "";
          }
        }
      }
    }
    tempstr = "";
    if (t2 !== "{}") {
      for (let i = e[1] + 2; i < e[2] - 1; i++) {
        tempstr = tempstr + text.charAt(i);
        if (text.charAt(i) === "{") {
          counter++;
        } else if (text.charAt(i) === "}") {
          counter--;
          if (counter === 0) {
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
//compress_string_js(expressionTree.toString(),res => {console.log(res)});
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

/// /////////////////////////////////////////////////////////////////////////////
/// //////////////////        Unused Functions   ////////////////////////////////

function get_times(){
  console.log('fast num: '+avgfasttimenum);
  console.log('fast time: '+avgfasttime);
  console.log('slow num: '+avgslowtimenum);
  console.log('slow time: '+avgslowtime);
}

var jsonquery="{\"examples\":[";
function query_add(text,start1,end1,start2,end2){
  if(start1===undefined||end1===undefined||start2===undefined||end2===undefined){
    console.log('here');
  }
  //http://regex.inginf.units.it/
  jsonquery=jsonquery+"{\"string\":\""
    +text+"\",\"match\":[{\"start\":"
    +start1+",\"end\":"
    +end1+"},{\"start\":"
    +start2+",\"end\":"
    +end2+"}]},";
}
function query_end(){
  jsonquery=jsonquery.substr(0,jsonquery.length-1)+"]}";
}

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

/// /////////////////////////////////////////////////////////////////////////////
/// ////////        Dangerous (only in console) Functions   /////////////////////

function addProblemToDatabase(tree){

}