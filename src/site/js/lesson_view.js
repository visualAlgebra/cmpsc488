import {get_lesson_from_db} from "./database_management";
import {createCardForProblem, createCollectionItemForLesson} from "./tree_card_creation";
import {LessonInfo, ProblemInfo} from "./expression_tree";
import * as M from "materialize-css";
import {initNav} from "./navbar_creation";

var lesson_to_load=getLessonFromURL();

window.onload = ()=>{
  initNav();
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
      //displayProblemFromDBStruct(prob, creation + "_s", creation + "_g");
      let temp1=document.getElementById(creation+"_s");
      let temp2=document.getElementById(creation + "_g");
      temp1.innerHTML="placeholder for minified problem";
      temp2.innerHTML="placeholder for minified problem";
      //TODO Display only minified problem (above)
    } else {
      let k=lesson.creations[creation];
      let les=new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description)
      createCollectionItemForLesson(les,"lessonContainer");
    }
  }
}

function getLessonFromURL() {
  let lesson = (window.location.href).substr((window.location.href).indexOf('/lesson-view'));
  if (lesson.indexOf('lesson-view/') === -1 || lesson === 'null' || lesson === '' || lesson === 'undefined') {
    //location.replace("../Explorer.html");
    alert("Error(lesson-view.js): Please enter a lesson after \"lesson-view/\" in the URL or select a problem from another page");
    return null;
  }
  return lesson.substring(lesson.lastIndexOf('/')+1, lesson.length);
}