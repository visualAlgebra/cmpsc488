document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

var lesson_to_load=getLessonFromURL();

window.onload = ()=>{
  if (lesson_to_load !== null) {
    get_lesson_from_db(lesson_to_load,res=>fillCreations(res));
  }
}

function fillCreations(lesson) {
  document.getElementById("lessonIdField").innerHTML=lesson.id;
  let filldiv = document.getElementById("problemContainer");
  for (let creation in lesson.creations) {
    creation = parseInt(creation);
    if (lesson.creations[creation].lessonID===undefined) {
      filldiv.appendChild(createCardForProblem(lesson.creations[creation].problemID, creation));
      let k=lesson.creations[creation];
      let prob=new ProblemInfo(k.problemID,k.startExpression,k.goalExpression, k.description, k.timeCreated);
      displayProblemFromDBStruct(prob, creation + "_s", creation + "_g");
    } else {
      let k=lesson.creations[creation];
      let les=new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description)
      createCollectionItemForLesson(les,"lessonContainer");
    }
  }
}

function getLessonFromURL() {
  let lesson = (window.location.href).substr((window.location.href).indexOf('/LessonPage'));
  if (lesson.indexOf('LessonPage/') === -1 || lesson === 'null' || lesson === '' || lesson === 'undefined') {
    //location.replace("../Explorer.html");
    alert("Error(LessonPage.js): Please enter a lesson after \"LessonPage/\" in the URL or select a problem from another page");
    return null;
  }
  return lesson.substring(lesson.lastIndexOf('/')+1, lesson.length);
}