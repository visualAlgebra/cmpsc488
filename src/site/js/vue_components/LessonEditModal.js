import {get_all_lessons_from_db, get_all_problems_from_db, post_lesson_from_site} from "../database_management";
import {LessonInfo} from "../expression_tree";

export default {
  name: "LessonEditModal", props:["lesson", "userStruct"], template: `
    <div id="lessonEditModal" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4 class="black-text">Create lesson:
          <div class="input-field col s6">
            <input v-model="nameField" placeholder="Lesson name" type="text" class="validate">
          </div>
        </h4>
        <h5 class="black-text">Add description:
          <div class="input-field col s6">
            <input v-model="descriptionField" placeholder="Describe your problem" type="text" class="validate">
          </div>
        </h5>
        <h4 class="black-text">Add lessons and problems by searching:</h4>
        <h6 class="black-text">Current:</h6>
        <div class="collection">
          <a v-for="creation in creations" class="collection-item black-text" v-on:click="removeCreation(creation)">
          {{creation}}<i class="material-icons right">remove_circle</i>
          </a>
        </div>
        <div class="switch">
          <label>Lesson search
          <input v-on:click="state=!state" type="checkbox">
          <span class="lever"></span>Problem search
          </label>
        </div>
        <h4 v-show="!state" class="black-text">
          <div class="input-field col s6">
            <input id="lessText" placeholder="Lesson name" type="text" class="validate" v-on:keyup="setLessonInput($event)">
          </div>
        </h4>
        <h4 v-show="state" class="black-text">
          <div class="input-field col s6">
            <input id="probText" placeholder="Problem name" type="text" class="validate" v-on:keyup="setProblemInput($event)">
          </div>
        </h4>
        <div v-show="!state" class="collection">
          <a v-for="lesson in filterListLessons" class="collection-item black-text" v-on:click="inclusionLesson(lesson)">
            {{lesson}}<i class="material-icons right">add_circle</i>
          </a>
        </div>
        <div v-show="state" class="collection">
          <a v-for="problem in filterListProblems" class="collection-item black-text" v-on:click="inclusionProblem(problem)">
            {{problem}}<i class="material-icons right">add_circle</i>
          </a>
        </div>
      </div>
      <div class="modal-footer">
        <a class="waves-effect waves-green btn" v-on:click="createLesson">
          <i class="material-icons right">+</i>
          Create lesson
        </a>
      </div>
    </div>
  `, data(){
    return{
      creations:[], listProblems:[], listLessons:[], state:false, lessonInput:"", problemInput:"", nameField:"", descriptionField:"",
    }
  }, methods:{
    fillProblems(res){
      this.listProblems=res.results.filter(x=>x.indexOf('\\')!==-1);
    }, fillLessons(res){
      this.listLessons=res.results.filter(x=>x.indexOf('\\')!==-1);
    }, inclusionLesson(lesson) {
      if(this.creations.includes("lessons/"+lesson)){
        this.creations=this.creations.filter(x=>x!=="lessons/"+lesson);
      }else{
        this.creations.push("lessons/"+lesson);
      }
      // this.$forceUpdate();
    }, inclusionProblem(problem){
      if(this.creations.includes("problems/"+problem)){
        this.creations=this.creations.filter(x=>x!=="problems/"+problem);
      }else{
        this.creations.push("problems/"+problem);
      }
      // this.$forceUpdate();
    }, setLessonInput(){
      this.lessonInput=event.target.value;
    }, setProblemInput(){
      this.problemInput=event.target.value;
    }, removeCreation(creation){
      this.creations=this.creations.filter(x=>x!==creation);
    }, createLesson(){
      let lesson=new LessonInfo();
      if(this.creations!==undefined&&this.creations.length<1){
        alert("Please add at least one problem or lesson");
        return;
      }
      lesson.creations=this.creations;
      if(this.descriptionField.length>1000){
        alert("Please shorten the description to below 1000 characters");
        return;
      }
      lesson.description=this.descriptionField;
      if(this.nameField.length<5){
        alert("Please have a lesson name longer than 5 characters");
        return;
      }
      lesson.lessonID=this.nameField;
      post_lesson_from_site(lesson, this.userStruct, this.donePosting);
    }, donePosting(res){
      if(res==="lesson wtih that name already exists"){
        alert("Please choose another name, it already exists");
      }
      if(res===false){
        alert("Lesson failed to commit");
      }else{
        this.creations=[];
        this.nameField="";
        this.descriptionField="";
        window.location.href="http://localhost:8080/lesson-view/"+res;
      }
    }, getInfo(){

    }
  }, computed:{
    filterListProblems: function(){
      return this.listProblems.filter(x => x.includes(this.problemInput)&&!this.creations.includes("problems/"+x));
    }, filterListLessons: function(){
      return this.listLessons.filter(x => x.includes(this.lessonInput)&&!this.creations.includes("lessons/"+x));
    }
  }, mounted() {
    M.AutoInit();
    get_all_problems_from_db(this.fillProblems);
    get_all_lessons_from_db(this.fillLessons);
  },
};
