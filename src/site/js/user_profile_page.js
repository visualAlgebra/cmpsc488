document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

//user_profile_page/accounts/account_id
//{"accountID":"TEST_USER_0","timeCreated":"120000T101010",
//"creations":["/problems/TEST_PROBLEM_0", "/lessons/TEST_LESSON_0"]}
//
var account_to_load = getAccountFromURL();

window.onload = ()=>{
  if (account_to_load !== null) {
    get_account_from_db(account_to_load, res=>{
      fillPage(res);
    }
    );
  }
}
;

function fillPage(accInfo) {
  let id_field = document.getElementById('userAccountIdField');
  id_field.innerHTML = accInfo.id;
  let creation_date_field = document.getElementById('creationDateField');
  creation_date_field.innerHTML = "Creation date: " + (accInfo.creationDate);
  //date hardcoded in and cant be parsed by Date.parse()
  let problems_amt = document.getElementById('problemsSavedAmountField');
  let lessons_amt = document.getElementById('lessonsSavedAmountField');
  let problemCount = 0;
  let lessonCount = 0;
  for (let creation in accInfo.creations) {
    if (accInfo.creations[creation].toString().indexOf('problems') !== -1) {
      problemCount++;
    } else {
      lessonCount++;
    }
  }
  problems_amt.innerHTML = "Problems: " + problemCount;
  lessons_amt.innerHTML = "Lessons: " + lessonCount;
  fillCreations("creationHolder", accInfo);
}

class AccountInfo {
  constructor(account_id, time_created, creationArr) {
    this.id = account_id;
    this.creationDate = time_created;
    this.creations = creationArr;
  }
}

function getAccountFromURL() {
  let acc = (window.location.href).substr((window.location.href).indexOf('/user_profile_page'));
  if (acc.indexOf('user_profile_page/accounts/') === -1 || acc === 'null' || acc === '' || acc === 'undefined') {
    //location.replace("../Explorer.html");
    alert("Error(user_profile_page.js): Please enter an account id after \"user_profile_page/accounts/\" in the URL or select a problem from another page");
    return null;
  }
  return acc.substring(acc.lastIndexOf('/') + 1, acc.length);
}
var probAmt = 0;
var lessAmt = 0;
function fillCreations(elementId, accInfo) {
  let filldiv = document.getElementById(elementId);
  for (let creation in accInfo.creations) {
    creation = parseInt(creation);
    if (accInfo.creations[creation].toString().includes("problems")) {
      if (probAmt >= 10) {
        continue;
      }
      let str = accInfo.creations[creation].substring(accInfo.creations[creation].lastIndexOf('/') + 1, accInfo.creations[creation].length);
      filldiv.appendChild(createCardForProblem(str, probAmt));
      displayProblemFromDB(str, creation + "_s", creation + "_g");
      probAmt++;
    } else if (accInfo.creations[creation].toString().includes("lessons")) {
      if (lessAmt >= 5) {
        continue;
      }
      let str = accInfo.creations[creation].substring(accInfo.creations[creation].lastIndexOf('/') + 1, accInfo.creations[creation].length);
      get_lesson_from_db(str, res=>createCardForLesson(res, creation, elementId));
      lessAmt++;
    }
  }
}
