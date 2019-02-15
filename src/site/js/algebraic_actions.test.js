function assertAA (applied, expected, err) {
  let retval = applied.equals(expected);
  if(!retval) {
    console.log(err);
  }
  return retval;
}

function negative(x) {
  x = new Tag(Orientation.EW, [],[x]);
  return x;
}

function CSTest1 () {
  let a = new Tag(Orientation.NS);
  a0 = new Literal(1);
  a1 = new Literal(2);
  a.addNorthWest(a0);
  a.addNorthWest(a1);

  let swapped = new CommutativeSwap(a0, a1, Quadrant.NW);
  swapped.apply();

  let expected = new Tag(Orientation.NS);
  expected.addNorthWest(a1);
  expected.addNorthWest(a0);

  return assertAA(a, expected, "CommutativeSwap Test 1 failed");
}

function CSTest2() {
  let a = new Tag(Orientation.NS);
  a0 = new Literal(1);
  a1 = new Variable(1);
  a2 = new Tag(Orientation.EW, [new Literal(2), new Variable(2)]);
  a.addNorthWest(a0);
  a.addNorthWest(a1);
  a.addNorthWest(a2);

  let swapped = new CommutativeSwap(a1, a2, Quadrant.NW);
  swapped.apply();

  let expected = new Tag(Orientation.NS);
  expected.addNorthWest(a0);
  expected.addNorthWest(a2);
  expected.addNorthWest(a1);

  return assertAA(a, expected, "CommutativeSwap Test 2 failed");
}


function CSTest3() {
  let a = new Tag(Orientation.EW);
  a0 = new Literal(1);
  a1 = new Variable(1);
  a2 = new Tag(Orientation.EW, [new Variable(2), new Variable(3)]);
  a3 = new Tag(Orientation.NS, [new Literal(2), new Literal(3)]);
  a.addNorthWest(a0);
  a.addSouthEast(a1);
  a.addSouthEast(a2);
  a.addSouthEast(a3);

  let swapped = new CommutativeSwap(a2, a3, Quadrant.SE);
  swapped.apply();

  let expected = new Tag(Orientation.EW);
  expected.addNorthWest(a0);
  expected.addSouthEast(a1);
  expected.addSouthEast(a3);
  expected.addSouthEast(a2);

  return assertAA(a, expected, "CommutativeSwap Test 3 failed");
}

function AMTest1() {
  // [ [1><] ><]
  // =>
  // [1><]
  let s = new Tag(Orientation.NS);
  s0 = new Literal(1);
  s1 = new Literal(2);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  let p = new Tag(Orientation.NS);
  p.addNorthWest(s);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  return assertAA(p, s, "AssociativeMerge Test 1 failed");
}

function AMTest2() {
  //old AM impl
  /*
  // [s0 [ s0 s1 ><] >< s1]
  // =>
  // [s0 s0 s1 >< s1]
  let s = new Tag(Orientation.EW);
  s0 = new Literal(1);
  s1 = new Variable(2);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  let p = new Tag(Orientation.EW);
  p.addNorthWest(s0);
  p.addNorthWest(s);
  p.addSouthEast(s1);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  let expected = new Tag(Orientation.EW);
  expected.addNorthWest(s0);
  expected.addNorthWest(s0);
  expected.addNorthWest(s1);
  expected.addSouthEast(s1);
  */

  let s = new Tag(Orientation.EW);
  s0 = new Literal(1);
  s1 = new Literal(2);
  s2 = new Variable(1);
  s.addSouthEast(s0);
  s.addSouthEast(s1);
  s.addSouthEast(s2);
  let p = new Tag(Orientation.EW);
  p.addNorthWest(s);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  return assertAA(p, s, "AssociativeMerge Test 2 failed");
}

function AMTest3() {
  //old AM impl
  /*
  let s = new Tag(Orientation.EW);
  s0 = new Literal(1);
  s1 = new Variable(2);
  s2 = new Variable(3);
  s3 = new Tag(Orientation.NS, [s0, s1], [s2]);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  s.addSouthEast(s2);
  s.addSouthEast(s3);

  let p = new Tag(Orientation.EW);
  p.addNorthWest(s0);
  p.addNorthWest(s);
  p.addNorthWest(s2);
  p.addNorthWest(s3);
  p.addSouthEast(s1);


  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  let expected = new Tag(Orientation.EW);
  expected.addNorthWest(s0);
  expected.addNorthWest(s0);
  expected.addNorthWest(s1);
  expected.addNorthWest(s2);
  expected.addNorthWest(s3);
  expected.addSouthEast(s2);
  expected.addSouthEast(s3);
  expected.addSouthEast(s1);
  */

  let s = new Tag(Orientation.NS);
  s0 = new Literal(1);
  s1 = new Literal(2);
  s2 = new Variable(1);
  s3 = new Tag(Orientation.EW, [new Variable(6), new Literal(2), new Literal(1)]);
  s.addSouthEast(s0);
  s.addSouthEast(s1);
  s.addSouthEast(s2);
  s.addSouthEast(s3);
  let p = new Tag(Orientation.NS);
  p.addSouthEast(s);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  let expected = new Tag(Orientation.NS, [s0, s1, s2, s3]);

  return assertAA(p, expected, "AssociativeMerge Test 3 failed");
}

function AITest1() {
  let p = new Tag(Orientation.NS);
  p0 = new Literal(1);
  p1 = new Literal(2);
  p.addNorthWest(p0);
  p.addNorthWest(p1);
  let s = [p0, p1];

  let merge = new AssociativeIntro(s, p, p.NW);
  let m = merge.apply();

  let expected = new Tag(Orientation.NS, [p]);

  return assertAA(m, expected, "AssociativeIntro Test 1 failed");
}

function AITest2() {
  //old impl
  /*
  let p = new Tag(Orientation.NS);
  p0 = new Literal(1);
  p1 = new Literal(2);
  p2 = new Variable(3);
  p3 = new Tag(Orientation.EW, [p0], [p2]);
  p.addNorthWest(p0);
  p.addNorthWest(p1);
  p.addNorthWest(p2);
  p.addNorthWest(p3);
  let s = [p1, p2, p3];

  let merge = new AssociativeIntro(s, p, p.NW);
  let m = merge.apply();

  let inner = new Tag(Orientation.NS, [p1, p2, p3]);
  let expected = new Tag(Orientation.NS, [p0, inner]);

  return assertAA(m, expected, "AssociativeIntro Test 2 failed");
  */

  let p = new Tag(Orientation.EW);
  p0 = new Literal(1);
  p1 = new Literal(2);
  p.addSouthEast(p0);
  p.addSouthEast(p1);
  let s = [p0, p1];

  let merge = new AssociativeIntro(s, p, p.SE);
  let m = merge.apply();

  let expected = new Tag(Orientation.EW, [], [p]);

  return assertAA(m, expected, "AssociativeIntro Test 2 failed");
}

function AETest1() {
  const x = new Variable(1);

  const p = new Tag(Orientation.NS,
    [
      new Tag(Orientation.NS,
        [x, new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  const expected = new Tag(Orientation.NS,
    [
      x,
      new Tag(Orientation.NS,
        [new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  const action = new AssociativeExtract(x, Quadrant.NW);
  action.apply()

  return assertAA(p, expected, "AssociativeExtract Test 1 failed");
}

function AETest2() {
  const x = new Variable(1);

  //[v2 x l1>< l2 l3]
  const s = new Tag(Orientation.EW,
    [
      new Variable(2),
      x,
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  //[v3><s]
  const p = new Tag(Orientation.EW, [new Variable(3)], [s]);

  const action = new AssociativeExtract(x, Quadrant.SE);
  action.apply();

  const expectedSibling = new Tag(Orientation.EW,
    [
      new Variable(2),
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  const expectedParent = new Tag(Orientation.EW, [new Variable(3)], [x, s]);

  return assertAA(p, expectedParent, "AssociativeExtract test 2 failed");
}

function AInsTest1() {
  const x = new Variable(1);

  const p = new Tag(Orientation.NS,
    [
      x,
      new Tag(Orientation.NS,
        [new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  const expected = new Tag(Orientation.NS,
    [
      new Tag(Orientation.NS,
        [x, new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  const action = new AssociativeExtract(x, Quadrant.NW);
  action.apply()

  return assertAA(p, expected, "AssociativeInsert Test 1 failed");
}

function AInsTest2() {
  const x = new Variable(1);

  //[v2 x l1>< l2 l3]
  const s = new Tag(Orientation.EW,
    [
      new Variable(2),
      x,
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  //[v3><s]
  const p = new Tag(Orientation.EW, [new Variable(3)], [s]);

  const action = new AssociativeExtract(x, Quadrant.SE);
  action.apply();

  const expectedSibling = new Tag(Orientation.EW,
    [
      new Variable(2),
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  const expectedParent = new Tag(Orientation.EW, [new Variable(3)], [x, s]);

  return assertAA(p, expectedParent, "AssociativeInsert test 2 failed");
}

function DTest1() {

  const inner = new Tag(Orientation.EW);
  i1 = new Variable(1);
  i2 = new Variable(2);
  inner.addNorthWest(i1);
  inner.addNorthWest(i2);

  const factor = new Literal(1);
  const before = new Tag(Orientation.NS, [factor, inner]);

  const expected = new Tag(Orientation.EW,
   [
     new Tag( Orientation.NS, [factor, i1]),
     new Tag( Orientation.NS, [factor, i2])
   ]);

   //Apply

   return assertAA(before, expected, "Distribute test 1 failed");
}

function DTest2() {

  v1 = new Variable(1);
  v2 = new Variable(2);
  v3 = new Variable(3);
  l1 = new Literal(1);
  l2 = new Literal(2);
  l3 = new Literal(3);
  //[v3, l1 >< l2]
  const x = new Tag(Orientation.NS, [v3, l1], [l2])
  //[v1, v2, x, l3 >< ]
  const inner = new Tag(Orientation.EW, [v1, v2, x, l3]);

  factor = new Variable(4);
  factor = negative(factor);
  const before = new Tag(Orientation.NS, [factor, inner]);

  const expected = new Tag(Orientation.EW, [
    new Tag(Orientation.NS, [factor, v1]),
    new Tag(Orientation.NS, [factor, v2]),
    new Tag(Orientation.NS, [factor, x]),
    new Tag(Orientation.NS, [factor, l3])
  ]);

  //apply Distribute

  return assertAA(before, expected, "Distribute test 2 failed");
}

function FTest1() {

  const factor = new Literal(1);
  i1 = new Variable(1);
  i2 = new Variable(2);
  i3 = new Literal(5);

  const before = new Tag(Orientation.EW,
    [
      new Tag(Orientation.NS, [factor, i1]),
      new Tag(Orientation.NS, [factor, i2]),
      i3
    ]);

  const inner = new Tag(Orientation.EW);
  inner.addNorthWest(i1);
  inner.addNorthWest(i2);

  const factored = new Tag(Orientation.NS, [factor, inner]);
  const expected = new Tag(Orientation.EW, [factored, i3]);

   //Apply Factor

   return assertAA(before, expected, "Factor test 1 failed");
}

function FTest2() {

  v1 = new Variable(1);
  v2 = new Variable(2);
  v3 = new Variable(3);
  l1 = new Literal(1);
  l2 = new Literal(2);
  l3 = new Literal(3);
  factor = new Variable(4);
  factor = negative(factor);

  const before = new Tag(Orientation.EW, [
    new Tag(Orientation.NS, [factor, v1]),
    new Tag(Orientation.NS, [factor, v2]),
    new Tag(Orientation.NS, [factor, x]),
    new Tag(Orientation.NS, [factor, l3])
  ]);

  //[v3, l1 >< l2]
  const x = new Tag(Orientation.NS, [v3, l1], [l2])

  //[v1, v2, x, l3 >< ]
  const inner = new Tag(Orientation.EW, [v1, v2, x, l3]);

  const expected = new Tag(Orientation.NS, [factor, inner]);

  //apply Factor

  return assertAA(before, expected, "Factor test 2 failed");
}

function SFTest() {


}

function testAll() {

  try {
    if(CSTest1()&&CSTest2()&&CSTest3()){
      console.log("All CommutativeSwap tests have passed");
    }
    if(AMTest1()&&AMTest2()&&AMTest3()) {
      console.log("All AssociativeMerge tests have passed");
    }
    if(AITest1()&&AITest2()) {
      console.log("All AssociativeIntro tests have passed");
    }
    if(AInsTest1()&&AInsTest2()) {
      console.log("All AssociativeInsert tests have passed");
    }
    if(AETest1()&&AETest2()) {
      console.log("All AssociativeExtract tests have passed");
    }
    if(DTest1()&&DTest2()) {
      console.log("All Distribute tests have passed");
    }
    if(FTest1()&&FTest2()) {
      console.log("All Factor tests have passed");
    }
  } catch(error) {
    console.log("Algebraic Action Reference errors has occurred");
  }
}

testAll();
