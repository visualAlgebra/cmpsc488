function assertAA (applied, expected, err) {
  let retval = applied.equals(expected);
  if(!retval) {
    console.log(err);
  }
  return retval;
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
      new Variable(1),
      new Tag(Orientation.NS,
        [new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  const action = new AssociativeExtract(x, Quadrant.NW);
  action.apply()

  assertAA(p, expected, "AssociativeExtract Test 1 failed");
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

function testAll() {

  try {
    if(CSTest1()&&CSTest2()&&CSTest3()){
      console.log("All CommutativeSwap tests have passed");
    }
    if(AMTest1()&&AMTest2()&&AMTest3()) {
      console.log("All AssociativeMerge tests have passed");
    }
    if(AETest1()&&AETest2()) {
      console.log("All AssociativeExtract tests have passed");
    }
    if(AITest1()&&AITest2()) {
      console.log("All AssociativeIntro tests have passed");
    }
  } catch(error) {
    console.log("Errors have occured")
  }
}

testAll();
