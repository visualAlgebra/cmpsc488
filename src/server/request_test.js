//create files needed
const fs = require("fs");
const http = require("http");
var testCaseSuccesses = 0;
const totalTestCases = 21;

const fileRTPath = "src/db/dbfiles/";
const fileRT0Path = "problems/rT0";
const fileRT0 = '{"startExpression": [93, 0, 0, 0, 2, 46, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 8, -85, 11, -84, -112, -35, -58, 5, -74, 23, 10, 13, 90, 62, -106, 17, -93, -35, -41, -67, 117, -22, -93, 22, -79, -103, 52, 71, 120, -52, 68, 127, -3, -91, 16, 0], "goalExpression": [93, 0, 0, 0, 2, 27, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 17, 100, 103, 78, -124, 111, -53, 100, -108, 69, -59, 33, 20, -58, 87, -74, 74, -11, 114, -10, 50, -1, -8, -76, 84, 0]}';
const fileRT1Path = "lessons/rT1";
const fileRT1 = '{"problems": ["TEST_PROBLEM_1", "TEST_PROBLEM_2", "TEST_PROBLEM_3"]}';
const fileRT2Path = "accounts/rT2";
const fileRT2 = '{"accountID": "TEST_ACCOUNT"}'
const fileRT3Path = "problems/rT3";
const testUser0 = "TEST_USER_0";
const fileRT4Path = "problems/";
const fileRT5Path = "lessons/rT5";
const fileRT6Path = "accounts/rT6";

const fileRT7Path = "problems/rT7";
const fileRT7 = '{"creatorAccountID": "TEST_USER_1", "startExpression": [93, 0, 0, 0, 2, 46, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 8, -85, 11, -84, -112, -35, -58, 5, -74, 23, 10, 13, 90, 62, -106, 17, -93, -35, -41, -67, 117, -22, -93, 22, -79, -103, 52, 71, 120, -52, 68, 127, -3, -91, 16, 0], "goalExpression": [93, 0, 0, 0, 2, 27, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 17, 100, 103, 78, -124, 111, -53, 100, -108, 69, -59, 33, 20, -58, 87, -74, 74, -11, 114, -10, 50, -1, -8, -76, 84, 0]}';
const fileRT8Path = "problems/rT8";
const fileRT9Path = "problems/rT9";
const fileRT10Path = "problems/rT10";
const fileRT11Path = "problems/rT11";
const fileRT12Path = "problems/rT12";

const fileRT13Path = "lessons/rT13";
const fileRT13 = '{"creatorAccountID": "TEST_USER_1", "problems": ["TEST_PROBLEM_1", "TEST_PROBLEM_2", "TEST_PROBLEM_3"]}';
const fileRT14Path = "lessons/rT14";
const fileRT15Path = "lessons/rT15";


const fileRT16Path = "accounts/TEST_USER_1";
const fileRT16 = '{"accountID": "TEST_USER_1"}';
const fileRT17Path = "accounts/TEST_USER_2";
const fileRT17 = '{"accountID": "TEST_USER_2"}';
const fileRT18Path = "accounts/TEST_USER_3";
const fileRT18 = '{"accountID": "TEST_USER_3"}';
const testUser1 = "TEST_USER_1";
const testUser2 = "TEST_USER_2";
const testUser3 = "TEST_USER_3";
const filePathArray = [fileRT0Path, fileRT1Path, fileRT2Path, fileRT3Path, fileRT4Path, fileRT5Path, fileRT6Path, fileRT7Path, fileRT8Path,
fileRT9Path, fileRT10Path, fileRT11Path, fileRT12Path, fileRT13Path, fileRT14Path, fileRT15Path, fileRT16Path, fileRT17Path, fileRT18Path]


function incrementSuccesses() {
	testCaseSuccesses++;
	if(testCaseSuccesses === totalTestCases) {
		setTimeout(cleanup, 500);
	}
}

function unlink(filePath) {
	fs.unlink(filePath, function (err) {
		if(err) {
		}
	});
}

function cleanup() {
	console.log("Cleanup Started");
	for (let i = 0; i < filePathArray.length; i++) {
		unlink(fileRTPath + filePathArray[i] + ".json");
	}
	unlink(fileRTPath + "problems/TEST_PROBLEM_0.json");
	console.log("Cleanup finished");
}



function getFileTest(fileName, testNumber, compareData) {
	let resFile = "";
	let spaces;
	if (testNumber >= 10) {
		spaces = " ";
	} else {
		spaces = "  ";
	}
	http.get("http://localhost:8080/" + fileName,
        function (res) {
        res.on("data", function(chunk) {
			resFile += chunk.toString();
		});
        res.on("end", function() {
            if(compareData === resFile) {
				console.log("TEST " + testNumber + ":" + spaces  + "-- Success --");
				incrementSuccesses();
            } else {
                console.log("TEST" + testNumber + ": -- Failed --");
				console.log("Response: ");
				console.log(resFile);
            }
        });
    });
}



function postFileTest(fileName, testNumber, compareData, accountID, successStatusCode) {
	let options;
	let spaces;
	if (testNumber >= 10) {
		spaces = " ";
	} else {
		spaces = "  ";
	}	  
	if(accountID === -1) {
		options = {
			hostname: 'localhost',
			port: 8080,
			path: '/' + fileName,
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': Buffer.byteLength(compareData),
			}
		};	
	} else {
		options = {
			hostname: 'localhost',
			port: 8080,
			path: '/' + fileName,
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': Buffer.byteLength(compareData),
			  'Account': accountID
			}
		};
	} 
	let req = http.request(options, function (res) {
		let body = "";
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function () {
			if (res.statusCode === successStatusCode) {
				console.log("TEST " + testNumber + ":" + spaces  + "-- Success --");
				incrementSuccesses();
			} else {
				console.log("TEST " + testNumber + ": -- Failed --");
				console.log("Returned Status Code is: " + res.statusCode);
				console.log("Message is: " + res.statusMessage);
				
			}
		});
	});
	req.on('error', function (e) {
		console.log("TEST " + testNumber + ": -- Failed -- ");
		console.log("Error Message:  " + e);
	});
	req.write(compareData);
	req.end();
}



function deleteFileTest(fileName, testNumber, accountID, successStatusCode) {
	let options;
	let spaces;
	if (testNumber >= 10) {
		spaces = " ";
	} else {
		spaces = "  ";
	}	  
	if(accountID === -1) {
		options = {
			hostname: 'localhost',
			port: 8080,
			path: '/' + fileName,
			method: 'DELETE',
		};	
	} else {
		options = {
			hostname: 'localhost',
			port: 8080,
			path: '/' + fileName,
			method: 'DELETE',
			headers: {
			  'Account': accountID
			}
		};
	} 
	let req = http.request(options, function (res) {
		let body = "";
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function () {
			if (res.statusCode === successStatusCode) {
				console.log("TEST " + testNumber + ":" + spaces  + "-- Success --");
				incrementSuccesses();
			} else {
				console.log("TEST " + testNumber + ": -- Failed --");
				console.log("Returned Status Code is: " + res.statusCode);
				console.log("Message is: " + res.statusMessage);
				
			}
		});
	});
	req.on('error', function (e) {
		console.log("TEST " + testNumber + ": -- Failed -- ");
		console.log("Error Message:  " + e);
	});
	req.end();
}




function executeFirebaseTesting() {
  postFileTest("accounts/TEST_USER_0", 0, JSON.stringify({"bio":"a bio for this account","accountID":"TEST_USER_0"}), "TEST_USER_0", 400);
  postFileTest("problems/TEST_USER_0/TEST_PROBLEM_0", 1, JSON.stringify({ "problemName": "TEST_PROBLEM_0",
  "startExpression": [93,0,0,0,2,-28,0,0,0,0,0,0,0,0,61,-99,4,-88,114,97,90,8,-85,11,71,75,-96,89,-84,-114,-34,11,-70,-102,-115,-125,78,39,99,64,-75,27,-123,-124,9,-43,-34,-39,34,-85,-19,125,39,-109,103,58,54,86,-52,-56,10,32,-121,-3,-38,-16,104,-56,79,-36,88,1,-72,66,-41,17,-1,-119,-42,-1,-19,88,-72,0],
  "goalExpression":[93,0,0,0,2,125,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,90,8,-110,32,113,-87,-75,-61,4,117,-40,123,0,72,-105,88,-31,114,116,95,54,114,-67,59,-65,-107,-49,27,74,-17,-61,80,-60,56,48,124,95,-92,-13,-10,-86,-126,96,29,-88,-51,-1,124,84,78,108,-30,-47,-61,115,-124,28,127,-1,88,111,-128,0],
  }), "TEST_USER_0",400);
  postFileTest("lessons/TEST_USER_0/TEST_LESSON_0", 2, JSON.stringify({"creations": ["problems/TEST_USER_0\\TEST_PROBLEM_0"], "creatorAccountID": "TEST_USER_0"}), "TEST_USER_0", 400);

  setTimeout(function () {
    postFileTest("accounts/TEST_USER_1", 3, JSON.stringify({"bio":"a bio for this account","accountID":"TEST_USER_1"}), "TEST_USER_1", 201);

    setTimeout(function () {
      postFileTest("problems/TEST_USER_1/TEST_PROBLEM_1", 4, JSON.stringify({ "problemName": "TEST_PROBLEM_1",
      "startExpression": [93,0,0,0,2,-28,0,0,0,0,0,0,0,0,61,-99,4,-88,114,97,90,8,-85,11,71,75,-96,89,-84,-114,-34,11,-70,-102,-115,-125,78,39,99,64,-75,27,-123,-124,9,-43,-34,-39,34,-85,-19,125,39,-109,103,58,54,86,-52,-56,10,32,-121,-3,-38,-16,104,-56,79,-36,88,1,-72,66,-41,17,-1,-119,-42,-1,-19,88,-72,0],
      "goalExpression":[93,0,0,0,2,125,0,0,0,0,0,0,0,0,61,-99,5,-48,-24,113,90,8,-110,32,113,-87,-75,-61,4,117,-40,123,0,72,-105,88,-31,114,116,95,54,114,-67,59,-65,-107,-49,27,74,-17,-61,80,-60,56,48,124,95,-92,-13,-10,-86,-126,96,29,-88,-51,-1,124,84,78,108,-30,-47,-61,115,-124,28,127,-1,88,111,-128,0],
      }), "TEST_USER_1",201);

      setTimeout(function() {
        postFileTest("lessons/TEST_USER_1/TEST_LESSON_1", 5, JSON.stringify({"creations": ["problems/TEST_USER_1\\TEST_PROBLEM_1"], "creatorAccountID": "TEST_USER_1"}), "TEST_USER_1", 201);

        setTimeout(function() {
          deleteFileTest("problems/TEST_USER_1/TEST_PROBLEM_1", 6, "TEST_USER_1", 200);

          setTimeout(function() {
            deleteFileTest("lessons/TEST_USER_1/TEST_LESSON_1", 7, "TEST_USER_1", 200);

            setTimeout(function() {
              deleteFileTest("accounts/TEST_USER_1", 8, "TEST_USER_1", 200);
              
              setTimeout(function() {
                console.log("testing complete");
              }, 3000);
            }, 3000);
          }, 3000);
        }, 3000);
      }, 3000);
    }, 3000);
  }, 3000);
  

  
}

function executeTesting() {
  //executeNormalTesting();
  executeFirebaseTesting();
}

function executeNormalTesting() {




	fs.writeFileSync(fileRTPath + fileRT0Path + ".json",fileRT0);
	fs.writeFileSync(fileRTPath + fileRT1Path + ".json",fileRT1);
	fs.writeFileSync(fileRTPath + fileRT2Path + ".json",fileRT2);
	// =====================================================================================================
	// ================================== GET tests ========================================================
	// =====================================================================================================
	getFileTest(fileRT0Path, 0, fileRT0); //get problem
	getFileTest(fileRT1Path, 1, fileRT1); //get lesson
	getFileTest(fileRT2Path, 2, fileRT2); //get account

	// =====================================================================================================
	// ================================== POST tests =======================================================
	// =====================================================================================================

	//post problem test cases
	postFileTest(fileRT3Path, 3, fileRT0, -1, 401); // denied posting problem with name w/out account
	postFileTest(fileRT3Path, 4, fileRT0, testUser0, 201); //post problem w/ name w/ account
	postFileTest(fileRT4Path, 5, fileRT0, -1, 201); //post problem w/out name w/out account
	postFileTest(fileRT4Path, 6, fileRT0, testUser0, 201); //post problem w/out name w/account

	//post lesson test cases
	postFileTest(fileRT5Path, 7, fileRT1, -1, 401); // denied posting lesson w/out account
	postFileTest(fileRT5Path, 8, fileRT1, testUser0, 201); //post lesson w/ account

	//post account test cases
	postFileTest(fileRT6Path, 9, fileRT2, -1, 401);
	postFileTest(fileRT6Path, 10, fileRT2, testUser0, 201);

	// =====================================================================================================
	// ================================== DELETE tests =====================================================
	// =====================================================================================================
	fs.writeFileSync(fileRTPath + fileRT7Path + ".json",fileRT7);
	fs.writeFileSync(fileRTPath + fileRT8Path + ".json",fileRT7);
	fs.writeFileSync(fileRTPath + fileRT9Path + ".json",fileRT7);
	fs.writeFileSync(fileRTPath + fileRT10Path + ".json",fileRT0);
	fs.writeFileSync(fileRTPath + fileRT11Path + ".json",fileRT0);
	fs.writeFileSync(fileRTPath + fileRT12Path + ".json",fileRT0);

	fs.writeFileSync(fileRTPath + fileRT13Path + ".json",fileRT13);
	fs.writeFileSync(fileRTPath + fileRT14Path + ".json",fileRT13);
	fs.writeFileSync(fileRTPath + fileRT15Path + ".json",fileRT13);

	fs.writeFileSync(fileRTPath + fileRT16Path + ".json",fileRT16);
	fs.writeFileSync(fileRTPath + fileRT17Path + ".json",fileRT17);
	fs.writeFileSync(fileRTPath + fileRT18Path + ".json",fileRT18);

	deleteFileTest(fileRT7Path, 11, -1, 401); //denied deleting problem w/creator w/out accountID
	deleteFileTest(fileRT8Path, 12, testUser0, 401); //denied deleting problem w/creator w/ wrong accountID
	deleteFileTest(fileRT9Path, 13, testUser1, 200); //delete problem w/creator w/accountID

	deleteFileTest(fileRT10Path, 14, -1, 401); //denied deleting problem w/out creator w/out accountID
	deleteFileTest(fileRT11Path, 15, testUser0, 401); //denied deleting problem w/out creator w/ wrong accountID
	
	deleteFileTest(fileRT13Path, 16, -1, 401); //denied deleting lesson w/out accountID
	deleteFileTest(fileRT14Path, 17, testUser0, 401); //denied deleting lesson w/ wrong accountID
	deleteFileTest(fileRT15Path, 18, testUser1, 200); //delete lesson w/accountID

	deleteFileTest(fileRT16Path, 19, -1, 401); //denied deleting account w/out accountID
	deleteFileTest(fileRT17Path, 20, testUser0, 401); //denied deleting account w/ wrong accountID
	deleteFileTest(fileRT18Path, 21, testUser3, 200); //delete account w/ account ID
}
module.exports = {executeTesting};
