Array.prototype.equals = function (array) {
  if (!array) return false
  if (this.length != array.length) return false
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) return false
    } else if (this[i] != array[i]) {
      return false
    }
  }
  return true
}
Object.defineProperty(Array.prototype, 'equals', { enumerable: false })

function _run_massive_test_DANGEROUS(){
  for(let x=0; x<10; x++){
    Deserialize(createRandomExpression(1000000).toString());
  }
}

var test_ids=[0,0,0];

function _assert (left, right, value, test_id) {
  //console.log("Testing set: "+(test_id));
  if (typeof left === 'string') {
    ((left === right) === value) ? null : console.log('expression_tree.test.js: case: ' + test_id + ' failed')
  } else{
    (left.equals(right) === value)? null :console.log('expression_tree.test.js: case: ' + test_id + ' failed')
  }
  
  if(test_id<=8){
    test_ids[0]++;
  }else if(test_id<=16){
    test_ids[1]++;
  }else if(test_id<=18){
    test_ids[2]++;
  }
  if(test_ids[0]===8){
    console.log('Finished problem equality tests');
    test_ids[0]++;
  }else if(test_ids[1]===8){
    console.log('Finished compression/decompression tests');
    test_ids[1]++;
  }else if(test_ids[2]===2){
    console.log('Finished database access tests');
    test_ids[2]++;
  }
}
function _testall () {
  // 1
  _assert(problem_e1(), problem_h1(), true,1) 
  // 2
  _assert(problem_e2(), problem_h2(), true,2) 
  // 3
  _assert(problem_e3(), problem_h3(), true,3) 
  // 4
  _assert(problem_e4(), problem_h4(), true,4)
  // 5
  _assert(problem_e1().toString(), problem_h1().toString(), true,5)  
  // 6
  _assert(problem_e2().toString(), problem_h2().toString(), true,6)
  // 7
  _assert(problem_e3().toString(), problem_h3().toString(), true,7)
  // 8
  _assert(problem_e4().toString(), problem_h4().toString(), true,8)

  // 9
  compress_string_js(problem_e1().toString(), res => {
    _assert(problem_ans1(), res, true,9)
  })
  // 10
  decompress_string_js(problem_ans1(), res => {
    _assert(res, problem_e1().toString(), true,10)
  })
  // 11
  compress_string_js(problem_e2().toString(), res => {
    _assert(problem_ans2(), res, true,11)
  })
  // 12
  decompress_string_js(problem_ans2(), res => {
    _assert(res, problem_e2().toString(), true,12)
  })
  // 13
  compress_string_js(problem_e3().toString(), res => {
    _assert(problem_ans3(), res, true,13)
  })
  // 14
  decompress_string_js(problem_ans3(), res => {
    _assert(res, problem_e3().toString(), true,14)
  })
  // 15
  compress_string_js(problem_e4().toString(), res => {
    _assert(problem_ans4(), res, true,15)
  })
  // 16
  decompress_string_js(problem_ans4(), res => {
    _assert(res, problem_e4().toString(), true,16)
  })
  // 17
  get_problem_from_db("test_expression_tree_1", res => {
      decompress_string_js(res.expression_start,decomp => {
          _assert(Deserialize(decomp).toString(),problem_db1(),true,17);
      });
  });
  // 18
  get_problem_from_db("test_expression_tree_2", res => {
      decompress_string_js(res.expression_start,decomp => {
          _assert(Deserialize(decomp).toString(),problem_db2(),true,18);
      });
  });
}
_testall()
//Deserialize(problem_e1().toString())
//Deserialize(problem_e2().toString())
//Deserialize(problem_e3().toString())
//Deserialize(problem_e4().toString())
//Deserialize(problem_e5().toString())
//Deserialize(problem_e6().toString())
//Deserialize(problem_e7().toString())
//Deserialize(problem_e8().toString())
//Deserialize(problem_e9().toString())
//Deserialize(problem_e10().toString())