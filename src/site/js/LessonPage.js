document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

var lesson_to_load=getLessonFromURL();

window.onload = ()=>{
  if (lesson_to_load !== null) {
    get_lesson_from_db(lesson_to_load,res=>displayLesson(res));
  }
}

function displayLesson(lesson){//jacob needs to remake the structure for a lesson in db
    let container=document.getElementById("lessonContainer");
    for(let problem in lesson){
        
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