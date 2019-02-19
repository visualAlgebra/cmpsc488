//Setting Literals and Variables for unit testing
const v1 = new Variable(1);
const v2 = new Variable(2);
const v3 = new Variable(3);
const v4 = new Variable(4);
const v5 = new Variable(5);
const l1 = new Literal(1);
const l2 = new Literal(2);
const l3 = new Literal(3);

function assertAA (applied, expected, err) {
  let retval = applied.equals(expected);
  if(!retval) {
    console.log(err);
  }
  return retval;
}

function allPassed (action) {
  console.log("All " + action + " tests have passed");
}

function negative(x) {
  x = new Tag(Orientation.EW, [],[x]);
  return x;
}

function CSTest1 () {
  let a = new Tag(Orientation.NS);
  let a0 = new Literal(1);
  let a1 = new Literal(2);
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
  let a0 = new Literal(1);
  let a1 = new Variable(1);
  let a2 = new Tag(Orientation.EW, [new Literal(2), new Variable(2)]);
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
  let a0 = new Literal(1);
  let a1 = new Variable(1);
  let a2 = new Tag(Orientation.EW, [new Variable(2), new Variable(3)]);
  let a3 = new Tag(Orientation.NS, [new Literal(2), new Literal(3)]);
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
  let s0 = new Literal(1);
  let s1 = new Literal(2);
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
  let s0 = new Literal(1);
  let s1 = new Literal(2);
  let s2 = new Variable(1);
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
  let s0 = new Literal(1);
  let s1 = new Literal(2);
  let s2 = new Variable(1);
  let s3 = new Tag(Orientation.EW, [new Variable(6), new Literal(2), new Literal(1)]);
  s.addSouthEast(s0);
  s.addSouthEast(s1);
  s.addSouthEast(s2);
  s.addSouthEast(s3);
  let p = new Tag(Orientation.NS);
  p.addNorthWest(s);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  let expected = new Tag(Orientation.NS, [], [s0, s1, s2, s3]);

  return assertAA(p, expected, "AssociativeMerge Test 3 failed");
}

function AITest1() {
  var p = new Tag(Orientation.NS);
  let p0 = new Literal(1);
  let p1 = new Literal(2);
  p.addNorthWest(p0);
  p.addNorthWest(p1);

  let intro = new AssociativeIntro(p);
  intro.apply();

  let expected = new Tag(Orientation.NS, [new Tag(Orientation.NS, [p0, p1])]);

  return assertAA(p, expected, "AssociativeIntro Test 1 failed");
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

  let intro = new AssociativeIntro(s, p, p.NW);
  let m = intro.apply();

  let inner = new Tag(Orientation.NS, [p1, p2, p3]);
  let expected = new Tag(Orientation.NS, [p0, inner]);

  return assertAA(m, expected, "AssociativeIntro Test 2 failed");
  */

  let p = new Tag(Orientation.NS);
  let p0 = new Variable(1);
  let p1 = new Literal(2);
  p.addSouthEast(p0);
  p.addSouthEast(p1);

  let intro = new AssociativeIntro(p);
  intro.apply();

  let expected = new Tag(Orientation.NS, [new Tag(Orientation.NS, [], [p0, p1])]);

  return assertAA(p, expected, "AssociativeIntro Test 2 failed");
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

  const expectedParent = new Tag(Orientation.EW, [new Variable(3)], [new Variable(1), s]);

  return assertAA(p, expectedParent, "AssociativeExtract test 2 failed");
}

function AInsTest1() {
  const x = new Variable(1);
  const inner =   new Tag(Orientation.NS,
      [new Variable(2)],
      [new Variable(3)]
  );

  const before = new Tag(Orientation.NS,
    [x, inner],
    []
  );

  const expected = new Tag(Orientation.NS,
    [
      new Tag(Orientation.NS,
        [new Variable(1), new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  const action = new AssociativeInsert(x, inner);
  action.apply()

  return assertAA(before, expected, "AssociativeInsert Test 1 failed");
}

function AInsTest2() {

  const x = new Variable(1);

  const inner = new Tag(Orientation.EW,
    [
      new Variable(2),
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  const before = new Tag(Orientation.EW, [new Variable(3)], [inner, x]);

  //[x v2 l1>< l2 l3]
  const innerExpected = new Tag(Orientation.EW,
    [
      new Variable(1),
      new Variable(2),
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  //[v3><s]
  const expected = new Tag(Orientation.EW, [new Variable(3)], [innerExpected]);

  const action = new AssociativeInsert(x, Quadrant.SE);
  action.apply();

  return assertAA(before, expected, "AssociativeInsert test 2 failed");
}

function AInsTest3() {

  const t1 = new Tag(Orientation.NS, l1, l2);
  const t2 = new Tag(Orientation.NS, l3);
  const before = new Tag(Orientation.NS, [v1, v2, t1, t2], [l1]);

  const expected = new Tag(Orientation.NS,
    [
      new Variable(1),
      new Variable(2),
      new Tag(Orientation.NS, [
        new Tag(Orientation.NS, [new Literal(1), new Literal(2)]),
        new Literal(1)])
      ]);

  const action = new AssociativeIntro(t1, t2);
  action.apply();

  return assertAA(before, expected, "AssociativeInsert test 3 failed");
}

function DTest1() {

  const inner = new Tag(Orientation.EW);
  let i1 = new Variable(1);
  let i2 = new Variable(2);
  inner.addNorthWest(i1);
  inner.addNorthWest(i2);

  const factor = new Literal(1);
  const before = new Tag(Orientation.NS, [factor, inner]);

  const expected = new Tag(Orientation.EW,
   [
     new Tag( Orientation.NS, [factor, i1]),
     new Tag( Orientation.NS, [factor, i2])
   ]);

   // const action = new Distribute();
   // action.apply();

   return assertAA(before, expected, "Distribute test 1 failed");
}

function DTest2() {

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

  // const action = new Distribute();
  // action.apply();

  return assertAA(before, expected, "Distribute test 2 failed");
}

function FTest1() {

  const factor = new Literal(4);

  const before = new Tag(Orientation.EW,
    [
      new Tag(Orientation.NS, [factor, v1]),
      new Tag(Orientation.NS, [factor, v2])
    ]);

  const t1 = new Tag(Orientation.EW, [v1, v2]);
  const expected = new Tag(Orientation.NS, [factor, t1]);

  const action = new Factor(factor, before);
  action.apply();
  console.log(before, expected);
  return assertAA(before, expected, "Factor test 1 failed\n");
}

function FTest2() {

  const factor = new Variable(4);
  factor = negative(factor);

  //[v3, l1 >< l2]
  const x = new Tag(Orientation.NS, [v3, l1], [l2])

  const before = new Tag(Orientation.EW, [
    new Tag(Orientation.NS, [factor, v1]),
    new Tag(Orientation.NS, [factor, v2]),
    new Tag(Orientation.NS, [factor, x]),
    new Tag(Orientation.NS, [factor, l3])
  ]);

  //[v1, v2, x, l3 >< ]
  const inner = new Tag(Orientation.EW, [v1, v2, x, l3]);

  const expected = new Tag(Orientation.NS, [factor, inner]);

  // const action = new Factor();
  // action.apply();

  return assertAA(before, expected, "Factor test 2 failed");
}

function FTest3() {

  const factor = new Literal(4);

  const before = new Tag(Orientation.EW,
    [
      new Tag(Orientation.NS, [factor, v1]),
      new Tag(Orientation.NS, [factor])
    ]);

  const t1 = new Tag(Orientation.EW, [v1, l1]);
  const expected = new Tag(Orientation.NS, [factor, t1]);

  const action = new Factor(factor, before);
  action.apply();

  return assertAA(before, expected, "Factor test 3 failed");
}

function SFTest1() {

  const before = new Tag(Orientation.NS, [new Tag(Orientation.EW, [v1, l1])], [v2]);

  const e1 = new Tag(Orientation.NS, [v1], [v2]);
  const e2 = new Tag(Orientation.NS, [l1], [v2]);
  const expected = new Tag(Orientation.EW, [e1, e2]);

  const action = new SplitFrac(before);
  action.apply();

  return assertAA(before, expected, "SplitFrac test 1 failed");
}

function SFTest2() {

  let t1 = new Tag(Orientation.NS, [v1, v2]);
  const before = new Tag(Orientation.NS, [new Tag(Orientation.EW, [t1], [v3])], [l1]);

  const e1 = new Tag(Orientation.NS, [t1], [l1]);
  const e2 = new Tag(Orientation.NS, [v3], [l1]);
  const expected = new Tag(Orientation.EW, [e1], [e2]);

  const action = new SplitFrac(before);
  action.apply();

  return assertAA(before, expected, "SplitFrac test 2 failed");
}

function SFTest3() {

  const t1 = new Tag(Orientation.NS, [v1, v2]);
  const before = new Tag(Orientation.NS,
    [new Tag(Orientation.EW, [t1,l1,l2], [v3,l3])],
    [v4, v5]
  );

  const e1 = new Tag(Orientation.NS, [t1], [v4, v5]);
  const e2 = new Tag(Orientation.NS, [l1], [v4, v5]);
  const e3 = new Tag(Orientation.NS, [l2], [v4, v5]);
  const e4 = new Tag(Orientation.NS, [v3], [v4, v5]);
  const e5 = new Tag(Orientation.NS, [l3], [v4, v5]);
  const expected = new Tag(Orientation.EW, [e1, e2, e3], [e4, e5]);

  const action = new SplitFrac(before);
  action.apply();



  return assertAA(before, expected, "SplitFrac test 3 failed");
}

function CFTest1() {

  let q = [v1, v2];
  const t1 = new Tag(Orientation.NS, [l1], q);
  const t2 = new Tag(Orientation.NS, [v3], q);
  const t3 = new Tag(Orientation.NS, [l2], q);
  const before = new Tag(Orientation.EW, [t1, t2, t3]);

  const dividend = new Tag(Orientation.EW, [l1, v3, l2]);
  const expected = new Tag(Orientation.NS, [dividend], q);

  const action = new CombineFrac(before);
  action.apply();


  return assertAA(before, expected, "CombineFrac test 1 failed");
}

function CFTest2() {

  let q = [v1, v2];
  const t1 = new Tag(Orientation.NS, [l1], q);
  const t2 = new Tag(Orientation.NS, [v3], q);
  const t3 = new Tag(Orientation.NS, [l2], q);
  const before = new Tag(Orientation.EW, [], [t1, t2, t3]);

  const dividend = new Tag(Orientation.EW, [],[l1, v3, l2]);
  const expected = new Tag(Orientation.NS, [dividend], q);

  const action = new CombineFrac(before);
  action.apply();

  return assertAA(before, expected, "CombineFrac test 2 failed");
}

function CFTest3() {

  let q = new Tag(Orientation.EW, [l1, v2])
  const ti = new Tag(Orientation.EW, [v4, v5]);

  const t1 = new Tag(Orientation.NS, [v1], [q]);
  const t2 = new Tag(Orientation.NS, [ti], [q]);
  const t3 = new Tag(Orientation.NS, [l2], [q]);
  const t4 = new Tag(Orientation.NS, [v3], [q]);
  const before = new Tag(Orientation.EW, [t1, t2], [t3, t4]);

  const dividend = new Tag(Orientation.EW, [v1, ti], [l2, v3]);
  const expected = new Tag(Orientation.NS, [dividend], [q]);

  const action = new CombineFrac(before);
  action.apply();

  return assertAA(before, expected, "CombineFrac test 3 failed");
}

function QFTest1() {

  const inner = new Tag(Orientation.NS, [v1, v2], [v3]);
  const before = new Tag(Orientation.NS, [inner]);

  const expected = new Tag(Orientation.NS,
    [],
    [new Tag(Orientation.NS, [v3], [v1, v2])]
  );

  const action = new QuadrantFlip(inner, Quadrant.NW);
  action.apply();

  return assertAA(before, expected, "QuadrantFlip test 1 failed");
}

function QFTest2() {

  const inner = new Tag(Orientation.EW, [v1, v2, l1], [l2, v3]);
  const before = new Tag(Orientation.EW, [inner]);

  const expected = new Tag(Orientation.EW,
    [],
    [new Tag(Orientation.EW, [l2, v3], [v1, v2, l1])]
  );

  const action = new QuadrantFlip(inner, Quadrant.NW);
  action.apply();

  return assertAA(before, expected, "QuadrantFlip test 2 failed");
}

function QFTest3() {

  const inner = new Tag(Orientation.EW, [l2, v3], [v1, v2, l1]);
  const before = new Tag(Orientation.EW,
    [],
    [inner]
  );

  const expected = new Tag(Orientation.EW,
    [new Tag(Orientation.EW, [v1, v2, l1], [l2, v3])]
  );

  const action = new QuadrantFlip(inner, Quadrant.SE);
  action.apply();

  return assertAA(before, expected, "QuadrantFlip test 3 failed");
}

function CTest1() {

  const v2a = new Variable(2);
  const v2b = new Variable(2);
  const before = new Tag(Orientation.NS,
    [v1, v2a, v3],
    [v2b]
  );

  const expected = new Tag(Orientation.NS,
    [v1, v3],
    []
  );

  const action = new Cancel(v2a, v2b);
  action.apply();

  return assertAA(before, expected, "Cancel test 1 failed");
}

function CTest2() {

  const t1 = new Tag(Orientation.NS, [v1, v2], [l1]);
  const t2 = new Tag(Orientation.NS, [new Variable(1), new Variable(2)], [new Literal(1)]);
  const before = new Tag(Orientation.EW,
    [v4, t1, l2, l3],
    [t2]
  );

  const expected = new Tag(Orientation.EW,
    [v4, l2, l3],
    []
  );

  const action = new Cancel(t1, t2);
  action.apply();

  return assertAA(before, expected, "Cancel test 2 failed");
}

function testAll() {

  try {
    if(CSTest1()&&CSTest2()&&CSTest3()){
      allPassed("CommutativeSwap");
    }
    if(AMTest1()&&AMTest2()&&AMTest3()) {
      allPassed("AssociativeMerge");
    }
    if(AITest1()&&AITest2()) {
      allPassed("AssociativeIntro");
    }
    if(AInsTest1()&&AInsTest2()&&AInsTest3()) {
      allPassed("AssociativeInsert");
    }
    if(AETest1()&&AETest2()) {
      allPassed("AssociativeExtract");
    }
    if(DTest1()&&DTest2()) {
      allPassed("Distribute");
    }
    if(FTest1()&&FTest2()&&FTest3()) {
      allPassed("Factor");
    }
    if(SFTest1()&&SFTest2()&&SFTest3()) {
      allPassed("SplitFrac");
    }
    if(CFTest1()&&CFTest2()&&CFTest3()) {
      allPassed("CombineFrac");
    }
    if(QFTest1()&&QFTest2()&&QFTest3()) {
      allPassed("QuadrantFlip");
    }
    if(CTest1()&&CTest2()) {
      allPassed("Cancel");
    }
  } catch(error) {
    // console.log("Algebraic Action Reference errors has occurred");
    console.log(error);
  }
}

testAll();
