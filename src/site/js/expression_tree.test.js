// Hide method from for-in loops
// const expressiontree=require('js/expression_tree.js');

Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) return false

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}
Object.defineProperty(Array.prototype, 'equals', { enumerable: false })
var test_id_val = 0
function assert (left, right, value) {
  test_id_val++
  // console.log("Testing set: "+(test_id_val));
  // console.log(left.toString());
  // console.log(right.toString());
  if (typeof left === 'string') {
    // console.log(left===right?"OK":"ERROR");
    return (left === right) === value
    // if((left===right)!==value) throw "Bad assertion!";
  } else {
    // console.log(left.equals(right)?"OK":"ERROR");
    return left.equals(right) === value
    // if (left.equals(right) !== value) throw "Bad assertion!";
  }
}
function testall () {
  // x4 + 0 - 2 - x1
  let e1 = new Tag(
    Orientation.EW,
    [new Variable(4), new Literal(0)],
    [new Literal(2), new Variable(1)]
  )

  // (2 * x1) + x2
  let e2 = new Tag(
    Orientation.EW,
    [
      new Tag(
        Orientation.NS,
        [new Literal(2), new Literal(8), new Variable(1), new Variable(3)],
        [new Literal(4)]
      ),
      new Variable(2)
    ],
    []
  )

  let e3 = new Tag(Orientation.EW, [new Literal(2), new Variable(3)])

  let e4 = new Tag(
    Orientation.EW,
    [
      new Tag(
        Orientation.EW,
        [
          new Tag(
            Orientation.EW,
            [
              new Tag(
                Orientation.EW,
                [
                  new Tag(
                    Orientation.EW,
                    [
                      new Tag(
                        Orientation.EW,
                        [new Variable(7)],
                        [new Variable(6)]
                      )
                    ],
                    [new Variable(5)]
                  )
                ],
                [new Variable(4)]
              )
            ],
            [new Variable(3)]
          )
        ],
        [new Variable(2)]
      )
    ],
    [new Variable(1)]
  )

  let h1 = new Tag(Orientation.EW)
  h1.addNorthWest(new Variable(4))
  h1.addNorthWest(new Literal(0))
  h1.addSouthEast(new Literal(2))
  h1.addSouthEast(new Variable(1))

  let h2 = new Tag(Orientation.EW)
  let v = new Tag(Orientation.NS)
  h2.addNorthWest(v)
  v.addNorthWest(new Literal(2))
  v.addNorthWest(new Literal(8))
  v.addNorthWest(new Variable(1))
  v.addNorthWest(new Variable(3))
  v.addSouthEast(new Literal(4))
  h2.addNorthWest(new Variable(2))

  let h3 = new Tag(Orientation.EW)
  h3.addNorthWest(new Literal(2))
  h3.addNorthWest(new Variable(3))

  let h4 = new Tag(Orientation.EW)
  let h41 = new Tag(Orientation.EW)
  h4.addNorthWest(h41)
  let h411 = new Tag(Orientation.EW)
  h41.addNorthWest(h411)
  let h4111 = new Tag(Orientation.EW)
  h411.addNorthWest(h4111)
  let h41111 = new Tag(Orientation.EW)
  h4111.addNorthWest(h41111)
  let h411111 = new Tag(Orientation.EW)
  h41111.addNorthWest(h411111)
  h411111.addNorthWest(new Variable(7))
  h411111.addSouthEast(new Variable(6))
  h41111.addSouthEast(new Variable(5))
  h4111.addSouthEast(new Variable(4))
  h411.addSouthEast(new Variable(3))
  h41.addSouthEast(new Variable(2))
  h4.addSouthEast(new Variable(1))

  // 1
  assert(e1, h1, true) ? null : console.log('case: ' + test_id_val + ' failed')
  // 2
  assert(e2, h2, true) ? null : console.log('case: ' + test_id_val + ' failed')
  // 3
  assert(e3, h3, true) ? null : console.log('case: ' + test_id_val + ' failed')
  // 4
  assert(e4, h4, true) ? null : console.log('case: ' + test_id_val + ' failed')
  // 5
  assert(e1.toString(), h1.toString(), true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 6
  assert(e2.toString(), h2.toString(), true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 7
  assert(e3.toString(), h3.toString(), true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 8
  assert(e4.toString(), h4.toString(), true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 9
  assert(Deserialize(e1.toString()), h1, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 10
  assert(Deserialize(h1.toString()), e1, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 11
  assert(Deserialize(e2.toString()), h2, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 12
  assert(Deserialize(h2.toString()), e2, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 13
  assert(Deserialize(e3.toString()), h3, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 14
  assert(Deserialize(h3.toString()), e3, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 15
  assert(Deserialize(e4.toString()), h4, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')
  // 16
  assert(Deserialize(h4.toString()), e4, true)
    ? null
    : console.log('case: ' + test_id_val + ' failed')

  let ans1 = [
    93,
    0,
    0,
    0,
    2,
    27,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    90,
    17,
    100,
    103,
    78,
    -124,
    111,
    -53,
    100,
    -108,
    69,
    -59,
    33,
    20,
    -58,
    87,
    -74,
    74,
    -11,
    114,
    -10,
    50,
    -1,
    -8,
    -76,
    84,
    0
  ]
  compress_string_js(e1.toString(), res => {
    // 17
    assert(ans1, res, true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })
  decompress_string_js(ans1, res => {
    // 18
    assert(res, e1.toString(), true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })

  let ans2 = [
    93,
    0,
    0,
    0,
    2,
    46,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    90,
    8,
    -85,
    11,
    -84,
    -112,
    -35,
    -58,
    5,
    -74,
    23,
    10,
    13,
    90,
    62,
    -106,
    17,
    -93,
    -35,
    -41,
    -67,
    117,
    -22,
    -93,
    22,
    -79,
    -103,
    52,
    71,
    120,
    -52,
    68,
    127,
    -3,
    -91,
    16,
    0
  ]
  compress_string_js(e2.toString(), res => {
    // 19
    assert(ans2, res, true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })
  decompress_string_js(ans2, res => {
    // 20
    assert(res, e2.toString(), true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })

  let ans3 = [
    93,
    0,
    0,
    0,
    2,
    19,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    89,
    -26,
    -14,
    42,
    9,
    -39,
    -93,
    23,
    9,
    -14,
    -54,
    -19,
    -91,
    82,
    -125,
    -1,
    -1,
    -70,
    -104,
    0,
    0
  ]
  compress_string_js(e3.toString(), res => {
    // 21
    assert(ans3, res, true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })
  decompress_string_js(ans3, res => {
    // 22
    assert(res, e3.toString(), true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })

  let ans4 = [
    93,
    0,
    0,
    0,
    2,
    94,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    46,
    31,
    72,
    -94,
    17,
    120,
    107,
    6,
    -127,
    -100,
    -75,
    55,
    75,
    55,
    -104,
    121,
    -17,
    38,
    -110,
    -66,
    89,
    -31,
    -71,
    -33,
    88,
    95,
    -1,
    -10,
    120,
    -128,
    0
  ]
  compress_string_js(e4.toString(), res => {
    // 23
    assert(ans4, res, true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })
  decompress_string_js(ans4, res => {
    // 24
    assert(res, e4.toString(), true)
      ? null
      : console.log('case: ' + test_id_val + ' failed')
  })
  console.log('Finished tests')
}
testall()
