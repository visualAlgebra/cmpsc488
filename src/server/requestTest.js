//create files needed
const fs = require("fs");
const http = require("http");
var filesProcessed = 0;
const totalFilesToProcess = 1;

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

// function incrementFilesProcessed() {
// 	filesProcessed++;
// 	console.log(filesProcessed);
// 	if(filesProcessed === totalFilesToProcess) {
// 		executeTesting();
// 	}
// }
// let file1 = fs.readFileSync(filename, 'utf-8');

function getFileTest(fileName, testNumber, compareData) {
    let resFile = "";
	http.get("http://localhost:8080/" + fileName,
        function (res) {
        res.on("data", function(chunk) {
			resFile += chunk.toString();
		});
        res.on("end", function() {
            if(compareData === resFile) {
                console.log("TEST " + testNumber + ": -- Success --");
            } else {
                console.log("TEST " + testNumber + ": -- Failed --");
				console.log("Response: ");
				console.log(resFile);
            }
        });
    });
}

function postFileTest(fileName, testNumber, compareData, accountID, successStatusCode) {
	let options;	  
	if(accountID === -1) {
		options = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': Buffer.byteLength(compareData),
			}
		};	
	} else {
		options = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': Buffer.byteLength(compareData),
			  'account': accountID
			}
		};
	} 
	let req = http.request("http://localhost:8080/" + fileName, options, (res) => {
		let body = "";
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			body += chunk;
		});
		res.on('end', () => {
			if (res.statusCode === successStatusCode) {
				console.log("TEST " + testNumber + ": -- Success --");
			} else {
				console.log("TEST " + testNumber + ": -- Failed --");
				console.log("Returned Status Code is: " + res.statusCode);
				console.log("Message is: " + res.statusMessage);
				
			}
		});
	});
	  
	req.on('error', (e) => {
		console.log("TEST " + testNumber + ": -- Failed -- ");
		console.log("Error Message:  " + e);
	});
	  
	// write data to request body
	req.write(compareData);
	req.end();
}




function executeTesting() {
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




	
}
module.exports = {executeTesting};


//==========================================================================================================
//POST


// var http = new XMLHttpRequest();
// http.onreadystatechange = function () {
// 	if ( http.readyState == 4 && http.status == 201) {
// 		console.log(http.response);
// 	}
// }
// http.open("POST", "http://localhost:8080/lessons/NEW_LESSON", true);
// http.setRequestHeader("Content-type", "application/json");
// http.setRequestHeader('account', 'TEST_ACCOUNT');
// http.send('{"problems": ["TEST_PROBLEM_1", "TEST_PROBLEM_2", "TEST_PROBLEM_3"]}');


// var http1 = new XMLHttpRequest();
// http1.onreadystatechange = function () {
// 	if ( http1.readyState == 4 && http1.status == 201) {
// 		console.log(http1.response);
// 	}
// }
// http1.open("POST", "http://localhost:8080/problems/NEW_PROBLEM", true);
// http1.setRequestHeader("Content-type", "application/json");
// http1.setRequestHeader('account', 'TEST_ACCOUNT');
// http1.send('{"startExpression": [93, 0, 0, 0, 2, 46, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 8, -85, 11, -84, -112, -35, -58, 5, -74, 23, 10, 13, 90, 62, -106, 17, -93, -35, -41, -67, 117, -22, -93, 22, -79, -103, 52, 71, 120, -52, 68, 127, -3, -91, 16, 0], "goalExpression": [93, 0, 0, 0, 2, 27, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 17, 100, 103, 78, -124, 111, -53, 100, -108, 69, -59, 33, 20, -58, 87, -74, 74, -11, 114, -10, 50, -1, -8, -76, 84, 0]}');


// var http2 = new XMLHttpRequest();
// http2.onreadystatechange = function () {
// 	if ( http2.readyState == 4 && http2.status == 201) {
// 		console.log(http2.response);
// 	}
// }
// http2.open("POST", "http://localhost:8080/accounts/TEST_ACCOUNT", true);
// http2.setRequestHeader("Content-type", "application/json");
// http2.setRequestHeader('account', 'TEST_ACCOUNT');
// http2.send('{}');


// //============================================================================================================
// //GET






// //============================================================================================================
// //DELETE


// var http6 = new XMLHttpRequest();
// http6.onreadystatechange = function () {
// 	if ( http6.readyState == 4 && http6.status == 200) {
// 		console.log(http6.response);
// 	}
// }
// http6.open("DELETE", "http://localhost:8080/lessons/NEW_LESSON", true);
// http6.setRequestHeader("Content-type", "application/json");
// http6.setRequestHeader('account', 'TEST_ACCOUNT');
// http6.send();


// var http7 = new XMLHttpRequest();
// http7.onreadystatechange = function () {
// 	if ( http7.readyState == 4 && http7.status == 200) {
// 		console.log(http7.response);
// 	}
// }
// http7.open("DELETE", "http://localhost:8080/problems/NEW_PROBLEM", true);
// http7.setRequestHeader("Content-type", "application/json");
// http7.setRequestHeader('account', 'TEST_ACCOUNT');
// http7.send();


// var http8 = new XMLHttpRequest();
// http8.onreadystatechange = function () {
// 	if ( http8.readyState == 4 && http8.status == 200) {
// 		console.log(http8.response);
// 	}
// }
// http8.open("DELETE", "http://localhost:8080/accounts/TEST_ACCOUNT", true);
// http8.setRequestHeader("Content-type", "application/json");
// http8.setRequestHeader('account', 'TEST_ACCOUNT');
// http8.send();