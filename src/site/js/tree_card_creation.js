export function createCollectionItemForLesson(lesson, elementId){
    let li1=document.createElement('li');


    let div1=document.createElement('div');
    div1.className="collapsible-header blue-grey darken-1 white-text";

    let i1=document.createElement('i');
    i1.className="material-icons white-text left";
    i1.innerHTML="folder";
    div1.appendChild(i1);
    div1.innerHTML+=lesson.id;

    li1.appendChild(div1);
    let a1=document.createElement('a');
    a1.href="http://localhost:8080/lesson-view/"+lesson.id;
    a1.className="secondary-content";
    div1.appendChild(a1);

    let i2=document.createElement('i');
    i2.className="material-icons";
    i2.innerHTML="send";
    a1.appendChild(i2);
    
    let div2=document.createElement('div');
    div2.className="collapsible-body";

    let span2=document.createElement('div');
    span2.innerHTML="Created: "+new Date(lesson.timeCreated);
    let span3=document.createElement('div');
    span3.innerHTML=lesson.description;
    div2.appendChild(span2);
    div2.appendChild(span3);
    li1.appendChild(div2);
    document.getElementById(elementId).appendChild(li1);
}
      
export function createCardForProblem(problem_id, cardID){
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
