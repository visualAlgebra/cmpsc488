function createCardForLesson(lesson_arr, cardID, elementId){
    let maindiv=document.createElement("div");
    maindiv.className="card blue-grey darken-1";
    let contentdiv=document.createElement("div");
    contentdiv.className="card-content white-text";
    maindiv.appendChild(contentdiv);

    let titlespan=document.createElement("span");
    titlespan.className="card-title";
    titlespan.id="Lesson"+cardID;
    titlespan.innerHTML="Lesson "+cardID;
    contentdiv.appendChild(titlespan);
    
    let iconi=document.createElement("i");
    iconi.className="material-icons left";
    iconi.innerHTML="folder";
    titlespan.prepend(iconi);

    for(let creation in lesson_arr.creations){
        if(creation>=5){
            break;
        }
        let rowdiv=document.createElement("div");
        rowdiv.className="row";
        contentdiv.appendChild(rowdiv);

        let adiv=document.createElement("a");
        adiv.href="http://localhost:8080/manipulator/problems/"+lesson_arr.creations[creation];
        adiv.innerHTML="Problem "+creation+" : "+lesson_arr.creations[creation];
        rowdiv.appendChild(adiv);
    }
    document.getElementById(elementId).appendChild(maindiv);
}
function createCardForProblem(problem_id, cardID){
    let maindiv=document.createElement("div");
    maindiv.className="card blue-grey darken-1";
    let contentdiv=document.createElement("div");
    contentdiv.className="card-content white-text";
    maindiv.appendChild(contentdiv);

    let titlespan=document.createElement("span");
    titlespan.className="card-title";
    titlespan.innerHTML="Problem "+cardID;
    contentdiv.appendChild(titlespan);

    let iconi=document.createElement("i");
    iconi.className="material-icons left";
    iconi.innerHTML="folder";
    titlespan.prepend(iconi);

    let rowdiv=document.createElement("div");
    rowdiv.className="row";
    contentdiv.appendChild(rowdiv);

    let col1div=document.createElement("div");
    col1div.className="col";
    rowdiv.appendChild(col1div);

    let li1holder=document.createElement("li");
    li1holder.innerHTML="Start";
    col1div.appendChild(li1holder);

    let startholderdiv=document.createElement("div");
    //startholderdiv.name="problem_holder";
    startholderdiv.id=cardID+"_s";
    li1holder.appendChild(startholderdiv);

    let col2div=document.createElement("div");
    col2div.className="col";
    rowdiv.appendChild(col2div);

    let li2holder=document.createElement("li");
    li2holder.innerHTML="Goal";
    col2div.appendChild(li2holder);

    let goalholderdiv=document.createElement("div");
    //goalholderdiv.name="problem_holder";
    goalholderdiv.id=cardID+"_g";
    li2holder.appendChild(goalholderdiv);

    return maindiv;
}
var probAmt=0;
var lessAmt=0;
function fillCreations(elementId, accInfo){
    let filldiv=document.getElementById(elementId);
    for(let creation in accInfo.creations){
        creation=parseInt(creation);
        if(accInfo.creations[creation].toString().includes("problems")){
            if(probAmt>=10){
                continue;
            }
            let str=accInfo.creations[creation].substring(accInfo.creations[creation].lastIndexOf('/')+1,accInfo.creations[creation].length);
            filldiv.appendChild(createCardForProblem(str,probAmt));
            displayProblemFromDB(str,creation+"_s",creation+"_g");
            probAmt++;
        }else if(accInfo.creations[creation].toString().includes("lessons")){
            if(lessAmt>=5){
                continue;
            }
            let str=accInfo.creations[creation].substring(accInfo.creations[creation].lastIndexOf('/')+1,accInfo.creations[creation].length);
            get_lesson_from_db(str,res=> createCardForLesson(res, creation, elementId));
            lessAmt++;
        }
    }
}