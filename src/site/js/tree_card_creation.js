function createCollectionItemForLesson(lesson, elementId){
    let li1=document.createElement('li');
    li1.className="collection-item blue-grey darken-1";

    let i1=document.createElement('i');
    i1.className="material-icons white-text left";
    i1.innerHTML="folder";
    li1.appendChild(i1);

    let div1=document.createElement('div');
    div1.className="white-text";
    div1.innerHTML=lesson.id;
    
    li1.appendChild(div1);
    let a1=document.createElement('a');
    a1.href="http://localhost:8080/lesson-view/"+lesson.id;
    a1.className="secondary-content";
    div1.appendChild(a1);

    let i2=document.createElement('i');
    i2.className="material-icons";
    i2.innerHTML="send";
    a1.appendChild(i2);
    
    document.getElementById(elementId).appendChild(li1);
}
      
function createCardForProblem(problem_id, cardID){
    let maindiv=document.createElement("div");
    maindiv.className="col s12 m12 l12";//change l12 to l6 for 2 horizontal problems
    let carddiv=document.createElement("div");
    carddiv.className="card blue-grey darken-1";
    maindiv.appendChild(carddiv);
    let contentdiv=document.createElement("div");
    contentdiv.className="card-content white-text";
    carddiv.appendChild(contentdiv);

    let titlespan=document.createElement("span");
    titlespan.className="card-title";
    titlespan.innerHTML="Problem "+problem_id;
    contentdiv.appendChild(titlespan);

    let iconi=document.createElement("i");
    iconi.className="material-icons left";
    iconi.innerHTML="folder_open";
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


//<div class="col s12 m6 l4">
//                <div class="card blue-grey darken-1">
//                    <div class="card-content white-text">
//                        <span class="card-title">
//                            <i class="material-icons left">folder</i>
//                            Lesson 1
//                        </span>
//                        <div class="row">
//                            <div class="col">
//                                <li>Problem 1
//    								<div name="problem_holder" id="l1p1"></div>
//                                </li>
//                            </div>
//                            <div class="col">
//                                <li>Problem 1 Goal
//    								<div name="problem_holder" id="l1p1g"></div>
//                                </li>
//                            </div>
//                        </div>
//                    </div>
//                </div>
//    		</div>
