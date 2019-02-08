// Hide method from for-in loops



Object.defineProperty(Array.prototype, "equals", {enumerable: false});
  var test_id_val=0;
  function assert(left, right, value) {
    console.log("Testing set: "+(++test_id_val));
    //console.log(left.toString());
    //console.log(right.toString());
    if(typeof left==="string"){
      console.log(left===right?"OK":"ERROR");
      if((left===right)!==value) throw "Bad assertion!";
    }else{
      console.log(left.equals(right)?"OK":"ERROR");
      if (left.equals(right) !== value) throw "Bad assertion!";
    }
  }

  // x4 + 0 - 2 - x1
  let e1 = new Tag(Orientation.EW,
    [new Variable(4), new Literal(0)],
    [new Literal(2), new Variable(1)]
  );

  // (2 * x1) + x2
  let e2 = new Tag(Orientation.EW,[
    new Tag(Orientation.NS,[new Literal(2),new Literal(8), new Variable(1), new Variable(3)], [new Literal(4)]),
    new Variable(2)
  ],
  []
);

let e3=new Tag(Orientation.EW,[new Literal(2),new Variable(3)]);

let e4=new Tag(Orientation.EW,[
  new Tag(Orientation.EW,[
    new Tag(Orientation.EW,[
      new Tag(Orientation.EW,[
        new Tag(Orientation.EW,[
          new Tag(Orientation.EW,[
            new Variable(7)],[
              new Variable(6)])
            ],[new Variable(5)
            ])
          ],[
            new Variable(4)
          ])
        ],[
          new Variable(3)
        ])
      ],[
        new Variable(2)
      ])
    ],[
      new Variable(1)
    ]);

    let h1 = new Tag(Orientation.EW);
    h1.addNorthWest(new Variable(4));
    h1.addNorthWest(new Literal(0));
    h1.addSouthEast(new Literal(2));
    h1.addSouthEast(new Variable(1));

    let h2 = new Tag(Orientation.EW);
    let v = new Tag(Orientation.NS);
    h2.addNorthWest(v)
    v.addNorthWest(new Literal(2));
    v.addNorthWest(new Literal(8));
    v.addNorthWest(new Variable(1));
    v.addNorthWest(new Variable(3));
    v.addSouthEast(new Literal(4));
    h2.addNorthWest(new Variable(2));

    let h3=new Tag(Orientation.EW);
    h3.addNorthWest(new Literal(2));
    h3.addNorthWest(new Variable(3));

    let h4 = new Tag(Orientation.EW);
    let h41 = new Tag(Orientation.EW);
    h4.addNorthWest(h41);
    let h411 = new Tag(Orientation.EW);
    h41.addNorthWest(h411);
    let h4111 = new Tag(Orientation.EW);
    h411.addNorthWest(h4111);
    let h41111 = new Tag(Orientation.EW);
    h4111.addNorthWest(h41111);
    let h411111 = new Tag(Orientation.EW);
    h41111.addNorthWest(h411111);
    h411111.addNorthWest(new Variable(7));
    h411111.addSouthEast(new Variable(6));
    h41111.addSouthEast(new Variable(5));
    h4111.addSouthEast(new Variable(4));
    h411.addSouthEast(new Variable(3));
    h41.addSouthEast(new Variable(2));
    h4.addSouthEast(new Variable(1));


    assert(e1,h1, true);

    assert(e2,h2, true);

    assert(e3,h3, true);

    assert(e4,h4, true);

    assert(e1.toString(),h1.toString(),true);

    assert(e2.toString(),h2.toString(),true);

    assert(e3.toString(),h3.toString(),true);

    assert(e4.toString(),h4.toString(),true);

    assert(Deserialize(e1.toString()),h1,true);
    assert(Deserialize(h1.toString()),e1,true);

    assert(Deserialize(e2.toString()),h2,true);
    assert(Deserialize(h2.toString()),e2,true);

    assert(Deserialize(e3.toString()),h3,true);
    assert(Deserialize(h3.toString()),e3,true);

    assert(Deserialize(e4.toString()),h4,true);
    assert(Deserialize(h4.toString()),e4,true);
    
    let ans1=[93, 0, 0, 0, 2, 27, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 17, 100, 103, 78, -124, 111, -53, 100, -108, 69, -59, 33, 20, -58, 87, -74, 74, -11, 114, -10, 50, -1, -8, -76, 84, 0];
    compress_string_js(e1.toString(), res=> { 
        assert(ans1, res, true);
    });
    decompress_string_js(ans1,res=> { 
        assert(res, e1.toString(), true);
    });

    let ans2=[93, 0, 0, 0, 2, 46, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 8, -85, 11, -84, -112, -35, -58, 5, -74, 23, 10, 13, 90, 62, -106, 17, -93, -35, -41, -67, 117, -22, -93, 22, -79, -103, 52, 71, 120, -52, 68, 127, -3, -91, 16, 0];
    compress_string_js(e2.toString(), res=> { 
        assert(ans2, res, true);
    });
    decompress_string_js(ans2,res=> { 
        assert(res, e2.toString(), true);
    });

    let ans3=[93, 0, 0, 0, 2, 19, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 89, -26, -14, 42, 9, -39, -93, 23, 9, -14, -54, -19, -91, 82, -125, -1, -1, -70, -104, 0, 0];
    compress_string_js(e3.toString(), res=> { 
        assert(ans3, res, true);
    });
    decompress_string_js(ans3,res=> { 
        assert(res, e3.toString(), true);
    });

    let ans4=[93, 0, 0, 0, 2, 94, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 46, 31, 72, -94, 17, 120, 107, 6, -127, -100, -75, 55, 75, 55, -104, 121, -17, 38, -110, -66, 89, -31, -71, -33, 88, 95, -1, -10, 120, -128, 0];
    compress_string_js(e4.toString(), res=> { 
        assert(ans4, res, true);
    });
    decompress_string_js(ans4,res=> { 
        assert(res, e4.toString(), true);
    });
