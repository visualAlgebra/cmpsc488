var http = new XMLHttpRequest();
http.onreadystatechange = function () {
	if ( http.readyState == 4 && http.status == 200) {
		console.log(http.response);
	}
}

http.open("POST", "http://localhost:8080/problems/NEW_PROBLEM", true);
http.setRequestHeader("Content-type", "application/json");
http.send('{"startExpression": "Harry", "goalExpression": "Ford"}');
