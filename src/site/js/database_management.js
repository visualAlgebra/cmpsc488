import {LessonInfo, parseMultiProblem, ProblemInfo} from "./expression_tree";

export function get_problem_from_db(problem_id, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      let k=JSON.parse(http.responseText);
      callback(new ProblemInfo(k.problemID,k.startExpression,k.goalExpression, k.description, k.timeCreated));
    }
  }
  http.open("GET", "http://localhost:8080/problems/" + problem_id, true);
  http.send();
}
export function get_all_problems_from_db(callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback(JSON.parse(http.responseText));
    }
  }
  http.open("GET", "http://localhost:8080/problems", true);
  http.send();
}
export function get_all_lessons_from_db(callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback(JSON.parse(http.responseText));
    }
  }
  http.open("GET", "http://localhost:8080/lessons", true);
  http.send();
}
export function get_lesson_from_db(lesson_id, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      let k=JSON.parse(http.responseText);
      callback(new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description));
    }
  }
  http.open("GET", "http://localhost:8080/lessons/" + lesson_id, true);
  http.send();
}
export function post_problem_from_site(problem, userStruct, callback) {
  try {
    let http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/problems/" + problem.problemID, true);
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("oauth_token", userStruct.token);
    let str = '{ "problemName": "' + problem.problemID + '\",'+
      ' "startExpression": [' + problem.expression_start + '],'+
      ' "goalExpression": [' + problem.expression_goal + '],'+
      ' "description": \"' + problem.description + '\"}';
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 201) {
        callback(http.responseText);
      }
      if (http.readyState === 4 && http.status === 400) {
        callback(false);
      }
    };
    http.send(str);
  } catch (e) {}
}
export function post_lesson_from_site(lesson, userStruct, callback) {
  try {
    let http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/lessons/" + lesson.lessonID, true);
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("oauth_token", userStruct.token);
    let str = '{ "lessonID": "' + lesson.lessonID + '\",'+
      ' "description": "' + lesson.description + '\",'+
    ' "creations": ' + JSON.stringify(lesson.creations) + '}';
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 201) {
        callback(http.responseText);
      }
      if (http.readyState === 4 && http.status === 400) {//already in database
        callback(http.responseText);
      }
    };
    http.send(str);
  } catch (e) {}
}
export function delete_problem_from_db(problem_id, userStruct, callback) {
  let http = new XMLHttpRequest();
  http.open("DELETE", "http://localhost:8080/problems/" + problem_id, true);
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader('oauth_token', userStruct.token);
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback();
    }
  };
  http.send();
}
export function delete_lesson_from_db(lesson_id, userStruct, callback) {
  let http = new XMLHttpRequest();
  http.open("DELETE", "http://localhost:8080/lessons/" + lesson_id, true);
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader('oauth_token', userStruct.token);
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback();
    }
  };
  http.send();
}
export function get_account_from_db(account_id, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback(new AccountInfo(JSON.parse(http.responseText)));
    }
  }
  http.open("GET", "http://localhost:8080/accounts/" + account_id, true);
  http.setRequestHeader('account', account_id);
  http.send();
}
export function delete_account_from_db(account_id, userStruct, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback();
    }
  };
  http.open("DELETE", "http://localhost:8080/accounts/" + account_id, true);
  http.setRequestHeader('oauth_token', userStruct.token);
  http.send();
}
export function get_problems_from_db(queryAmt, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback(parseMultiProblem(JSON.parse(http.responseText)));
    }
  }
  http.open("GET", "http://localhost:8080/problems?number=" + queryAmt + "&sort=timeCreated", true);
  // TODO hard coded query for now
  http.setRequestHeader("Content-type", "application/json");
  http.send();
}
export function get_lessons_from_db(queryAmt, callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      callback(JSON.parse(http.responseText));
    }
  }
  http.open("GET", "http://localhost:8080/lessons?number=" + queryAmt + "&sort=timeCreated", true);
  // TODO hard coded query for now
  http.setRequestHeader("Content-type", "application/json");
  http.send();
}
export class AccountInfo {
  constructor(json) {
    this.accountID = json.accountID;
    this.bio = json.bio;
    this.lessons = json.lessons;
    this.problems = json.problems;
    this.timeCreated = json.timeCreated;
  }
}
