var http = new XMLHttpRequest();
http.onreadystatechange = function () {
	if ( http.readyState == 4 && http.status == 200) {
		console.log("GOT HERE");
		console.log(http.response);
	}
}

http.open("GET", "http://localhost:8080/problems/TEST_PROBLEM_1");
http.send();
