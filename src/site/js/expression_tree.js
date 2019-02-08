const Orientation = {
  EW: 'eastwest',
  NS: 'northsouth'
}
// Abstract Class
class ExpressionTree {
  constructor (kind) {
    this.kind = kind
    this.treeCount = 1
    this.parent = null
  }

  toString () {
    return 'error'
  }
}

class Tag extends ExpressionTree {
  constructor (orientation, nw, se) {
    super('tag')
    this.orientation = orientation
    this.NW = nw || []
    this.SE = se || []

    for (let child of this.NW) {
      child.parent = this
      this.treeCount += child.treeCount
    }
    for (let child of this.SE) {
      child.parent = this
      this.treeCount += child.treeCount
    }
  }

  updateParentTreeCount (count) {
    this.treeCount += count
    if (this.parent != null) {
      this.parent.updateParentTreeCount(1)
    }
  }
  //
  addSouthEast (child) {
    this.SE.push(child)
    child.parent = this
    this.updateParentTreeCount(1)
  }

  addNorthWest (child) {
    this.NW.push(child)
    child.parent = this
    this.updateParentTreeCount(1)
  }

  equals (that) {
    if (that.kind === 'tag') {
      if (
        this.orientation !== that.orientation ||
        this.NW.length !== that.NW.length ||
        this.SE.length !== that.SE.length
      ) {
        return false
      }

      for (let i = 0; i < this.NW.length; i++) {
        if (!this.NW[i].equals(that.NW[i])) return false
      }

      for (let i = 0; i < this.SE.length; i++) {
        if (!this.SE[i].equals(that.SE[i])) return false
      }

      return true
    } else {
      return false
    }
  }

  delete (ref) {
    array_delete(this.SE, ref)
    array_delete(this.NW, ref)
  }

  /**
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render (p) {
    p.push()
    switch (this.orientation) {
      case Orientation.EW:
        this.NW.forEach((child, i) => {
          p.push()
          p.translate(-i * (100 + 10) - 50, 0)
          child.render(p)
          p.pop()
        })
        this.SE.forEach((child, i) => {
          p.push()
          p.translate(i * (100 + 10) + 50, 0)
          child.render(p)
          p.pop()
        })
        break

      case Orientation.NS:
        this.NW.forEach((child, i) => {
          p.push()
          p.translate(0, -i * (100 + 10) - 50)
          child.render(p)
          p.pop()
        })
        this.SE.forEach((child, i) => {
          p.push()
          p.translate(0, i * (100 + 10) + 50)
          child.render(p)
          p.pop()
        })
        break

      default:
        break
    }
    p.pop()
  }

  dimensions () {
    switch (this.orientation) {
      case Orientation.EW: {
        const width =
          this.NW.reduce((acc, child) => acc + child.dimensions().width, 0) +
          this.SE.reduce((acc, child) => acc + child.dimensions().width, 0) +
          10
        const height =
          Math.max(
            this.NW.reduce(
              (acc, child) => Math.max(acc, child.dimensions().height),
              0
            ),
            this.SE.reduce(
              (acc, child) => Math.max(acc, child.dimensions().height),
              0
            )
          ) + 10
        return { width, height }
      }

      case Orientation.NS: {
        const width =
          Math.max(
            this.NW.reduce(
              (acc, child) => Math.max(acc, child.dimensions().width),
              0
            ),
            this.SE.reduce(
              (acc, child) => Math.max(acc, child.dimensions().width),
              0
            )
          ) + 10
        const height =
          this.NW.reduce((acc, child) => acc + child.dimensions().height, 0) +
          this.SE.reduce((acc, child) => acc + child.dimensions().height, 0) +
          10
        return { width, height }
      }

      default:
        break
    }
  }

  toString () {
    var retval =
      '{t' +
      Object.keys(Orientation).find(
        key => Orientation[key] === this.orientation
      ) +
      '{{'
    for (let i = 0; i < this.NW.length; i++) {
      retval = retval + this.NW[i].toString()
    }
    retval = retval + '}{'
    for (let i = 0; i < this.SE.length; i++) {
      retval = retval + this.SE[i].toString()
    }
    return retval + '}}}'
  }
}

function array_delete (arr, ref) {
  for (let i = 0; i < arr.length; i++) {
    if (Object.is(ref, arr[i])) {
      arr.splice(i, 1)
    }
  }
}
class Variable extends ExpressionTree {
  constructor (value) {
    super('variable')
    this.value = value
  }

  equals (that) {
    if (that.kind !== 'variable') return false
    return this.value === that.value
  }

  /**
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render (p) {
    p.noStroke()
    p.fill(200, 0, 200)
    p.ellipse(0, 0, 50, 50)
    p.fill(255)
    p.textSize(30)
    p.text(`x${this.value}`, -15, 15)
  }

  dimensions () {
    return {
      width: 100,
      height: 100
    }
  }

  toString () {
    return '{v' + this.value + '}'
  }
}

class Literal extends ExpressionTree {
  constructor (value) {
    super('literal')
    this.value = value
  }

  equals (that) {
    if (that.kind !== 'literal') return false
    return this.value === that.value
  }

  /**
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render (p) {
    p.noStroke()
    p.fill(0, 200, 100)
    p.rectMode(p.CENTER)
    p.rect(0, 0, 50, 50)
    p.fill(255)
    p.textSize(30)
    p.text(this.value, -15, 15)
  }

  dimensions () {
    return {
      width: 100,
      height: 100
    }
  }

  toString () {
    return '{l' + this.value + '}'
  }
}

function Deserialize (text) {
  // eric
  if (text.substr(0, 2) === '{l') {
    return new Literal(parseInt(text.substr(2, text.length - 3)))
  }
  if (text.substr(0, 2) === '{v') {
    return new Variable(parseInt(text.substr(2, text.length - 3)))
  }
  if (text.substr(0, 2) === '{t') {
    let orient = Orientation[text.substr(2, 2)]
    let retval = new Tag(orient)
    let firstindex = text.indexOf('{{') + 1
    let lastindex = text.length - 2
    // helper(text.substr(firstindex,lastindex-firstindex));
    let midindex = 0
    let counter = 0
    for (let i = firstindex; i < text.length; i++) {
      if (text.charAt(i) === '{') {
        counter++
      } else if (text.charAt(i) === '}') {
        counter--
        if (counter === 0) {
          midindex = i
          break
        }
      }
    }
    let t1 = text.substr(firstindex, midindex - firstindex + 1)
    // helper(t1);
    let tempstr = ''
    if (t1 !== '{}') {
      for (let i = firstindex + 1; i < midindex; i++) {
        tempstr = tempstr + text.charAt(i)
        if (text.charAt(i) === '{') {
          counter++
        } else if (text.charAt(i) === '}') {
          counter--
          if (counter === 0) {
            // helper(tempstr);
            let d = Deserialize(tempstr)
            retval.addNorthWest(d)
            tempstr = ''
          }
        }
      }
    }
    let t2 = text.substr(midindex + 1, lastindex - midindex - 1)
    // helper(t2);
    tempstr = ''
    if (t2 !== '{}') {
      for (let i = midindex + 2; i < lastindex - 1; i++) {
        tempstr = tempstr + text.charAt(i)
        if (text.charAt(i) === '{') {
          counter++
        } else if (text.charAt(i) === '}') {
          counter--
          if (counter === 0) {
            // helper(tempstr);
            let d = Deserialize(tempstr)
            retval.addSouthEast(d)
            tempstr = ''
          }
        }
      }
    }
    return retval
  }
}

function compress_string_js (text, callback) {
  var arr
  /// If the string is a JSON array, use that. This allows us to compress a byte array.
  if (text[0] === '[' && text.slice(-1) === ']') {
    try {
      arr = JSON.parse(text)
    } catch (e) {}
  }
  if (arr) {
    text = arr
  }
  LZMA('src/site/js/lzma_worker.js').compress(text, 9, callback)
}

function decompress_string_js (byte_arr, callback) {
  LZMA('src/site/js/lzma_worker.js').decompress(byte_arr, callback)
}

/// ///////////////////////////////////////////////////////////////////
/// //////////////////        Unused Functions   //////////////////////
function helper (text) {
  let rettext = ''
  let temp = 0
  let zeroamt = 0
  let i = 0
  for (i = 0; i < text.length; i++) {
    if (text.charAt(i) === '{') {
      temp++
      rettext = rettext + temp.toString()
    } else if (text.charAt(i) === '}') {
      rettext = rettext + temp.toString()
      temp--
      if (temp === 0) {
        zeroamt++
      }
    } else {
      rettext = rettext + ' '
    }
  }
  console.log(text)
  console.log(rettext + '  :  ' + (temp === 0) + '  :  ' + zeroamt)
}
/// /////////////////////////////////////////////////////////////////////////////
