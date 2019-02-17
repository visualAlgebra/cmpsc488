var http = new XMLHttpRequest();
http.onreadystatechange = function () {
	if ( http.readyState == 4 && http.status == 201) {
		console.log(http.response);
	}
}

http.open("POST", "http://localhost:8080/lessons/NEW_LESSON", true);
http.setRequestHeader("Content-type", "application/json");
http.setRequestHeader('account', 'TEST_ACCOUNT');
http.send('{"problems": ["TEST_PROBLEM_1", "TEST_PROBLEM_2", "TEST_PROBLEM_3"]}');

var http1 = new XMLHttpRequest();
http1.onreadystatechange = function () {
	if ( http1.readyState == 4 && http1.status == 201) {
		console.log(http1.response);
	}
}

http1.open("POST", "http://localhost:8080/problems/NEW_PROBLEM", true);
http1.setRequestHeader("Content-type", "application/json");
http1.send('{"startExpression": [93, 0, 0, 0, 2, 46, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 8, -85, 11, -84, -112, -35, -58, 5, -74, 23, 10, 13, 90, 62, -106, 17, -93, -35, -41, -67, 117, -22, -93, 22, -79, -103, 52, 71, 120, -52, 68, 127, -3, -91, 16, 0], "goalExpression": [93, 0, 0, 0, 2, 27, 0, 0, 0, 0, 0, 0, 0, 0, 61, -99, 4, -88, 114, 97, 90, 17, 100, 103, 78, -124, 111, -53, 100, -108, 69, -59, 33, 20, -58, 87, -74, 74, -11, 114, -10, 50, -1, -8, -76, 84, 0]}');


var http2 = new XMLHttpRequest();
http2.onreadystatechange = function () {
	if ( http2.readyState == 4 && http.status == 201) {
		console.log(http2.response);
	}
}

http2.open("POST", "http://localhost:8080/accounts/mitzeljw", true);
http2.setRequestHeader("Content-type", "application/json");
http2.setRequestHeader('account', 'mitzeljw');
http2.send('{}');