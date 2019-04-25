//create files needed
const fs = require("fs");
var filesProcessed = 0;
const totalFilesToProcess = 1;

const fileRTPath = "src/db/dbfiles/";
const fileRT0Path = "problems/rT0.json";
const fileRT0 = '{"startExpression": [93, 0, 0, 0, 2, 46, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 8, -85, 11, -84, -112, -35, -58, 5, -74, 23, 10, 13, 90, 62, -106, 17, -93, -35, -41, -67, 117, -22, -93, 22, -79, -103, 52, 71, 120, -52, 68, 127, -3, -91, 16, 0], "goalExpression": [93, 0, 0, 0, 2, 27, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 17, 100, 103, 78, -124, 111, -53, 100, -108, 69, -59, 33, 20, -58, 87, -74, 74, -11, 114, -10, 50, -1, -8, -76, 84, 0]}';
const fileRT1Path = "lessons/rT1.json";
const fileRT1 = '{"problems": ["TEST_PROBLEM_1", "TEST_PROBLEM_2", "TEST_PROBLEM_3"]}';
const fileRT2Path = "accounts/rT2.json";
const fileRT2 = '{"accountID": "TEST_ACCOUNT"}'

// function incrementFilesProcessed() {
// 	filesProcessed++;
// 	console.log(filesProcessed);
// 	if(filesProcessed === totalFilesToProcess) {
// 		executeTesting();
// 	}
// }




function executeTesting() {
	fs.writeFileSync(fileRTPath + fileRT0Path,fileRT0);
	fs.writeFileSync(fileRTPath + fileRT1Path,fileRT1);
	fs.writeFileSync(fileRTPath + fileRT2Path,fileRT2);
	// =====================================================================================================
	// ================================== GET tests ========================================================
	// =====================================================================================================
	var http3 = new XMLHttpRequest();
	http3.onreadystatechange = function () {
		if ( http3.readyState == 4 && http3.status == 200) {
			if (http3.response === fileRT0) {
				console.log("Test 1: -- Success --");
			} else {
				console.log("Test 1: -- Failed --");
				console.log("Response: ");
				console.log(http3.response);
			}
		}
	}
	http3.open("GET", "http://localhost:8080/" + fileRT0Path, true);
	http3.setRequestHeader("Content-type", "application/json");
	http3.send();


	var http4 = new XMLHttpRequest();
	http4.onreadystatechange = function () {
		if ( http4.readyState == 4 && http4.status == 200) {
			if (http4.response === fileRT1) {
				console.log("Test 2: -- Success --");
			} else {
				console.log("Test 2: -- Failed --");
				console.log("Response: ");
				console.log(http4.response);
			}
		}
	}
	http4.open("GET", "http://localhost:8080/" + fileRT1Path, true);
	http4.setRequestHeader("Content-type", "application/json");
	http4.send();


	var http5 = new XMLHttpRequest();
	http5.onreadystatechange = function () {
		if (http5.response === fileRT2) {
			console.log("Test 3: -- Success --");
		} else {
			console.log("Test 3: -- Failed --");
			console.log("Response: ");
			console.log(http5.response);
		}
	}
	http5.open("GET", "http://localhost:8080/" + fileRT2Path, true);
	http5.setRequestHeader("Content-type", "application/json");
	http5.setRequestHeader('account', 'TEST_ACCOUNT');
	http5.send();
}

module.exports = executeTesting();


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