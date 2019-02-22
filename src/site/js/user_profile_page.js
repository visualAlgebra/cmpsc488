document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

//user_profile_page/accounts/account_id
//{"accountID":"TEST_USER_0","timeCreated":"120000T101010",
//"creations":["/problems/TEST_PROBLEM_0", "/lessons/TEST_LESSON_0"]}
var account_to_load=getAccountFromURL();

window.onload = () => {
    if(account_to_load!==null){
        get_account_from_db(account_to_load, res =>{
            let id_field=document.getElementById('userAccountIdField');
            id_field.innerHTML=res.id;
            let id_field2=document.getElementById('userAccountIdField2');
            id_field2.innerHTML=res.id;
            let creation_date_field=document.getElementById('creationDateField');
            creation_date_field.innerHTML=res.creationDate;
            let problems_amt=document.getElementById('problemsSavedAmountField');
            let lessons_amt=document.getElementById('lessonsSavedAmountField');
            let problemCount=0;
            let lessonCount=0;
            for(let creation in res.creations){
                if(res.creations[creation].toString().indexOf('problems')!==-1){
                    problemCount++;
                }else{
                    lessonCount++;
                }
            }
            problems_amt.innerHTML="Problems: "+problemCount;
            lessons_amt.innerHTML="Lesson: "+lessonCount;
        });
    }
};

class AccountInfo{
    constructor(account_id, time_created, creationArr){
        this.id=account_id;
        this.creationDate=time_created;
        this.creations=creationArr;
    }
}


function getAccountFromURL(){
    let acc=(window.location.href).substr((window.location.href).indexOf('/user_profile_page'));
    if(acc.indexOf('user_profile_page/accounts/')===-1||acc==='null'||acc===''||acc==='undefined'){
        //location.replace("../Explorer.html");
        alert("Error(user_profile_page.js): Please enter an account id after \"user_profile_page/accounts/\" in the URL or select a problem from another page");
        return null;
    }
    return acc.substring(acc.lastIndexOf('/')+1,acc.length);
}