import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import LessonsHolder from "./vue_components/LessonsHolder";
import ProblemsHolder from "./vue_components/ProblemsHolder";
import {get_lesson_from_db} from "./database_management";
import LessonViewPageTop from "./vue_components/LessonViewPageTop";
import InvalidPage from "./vue_components/InvalidPage";
import {LessonInfo, ProblemInfo} from "./expression_tree";

export const lesson_view_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <LessonViewPageTop v-if="display"
    v-bind:creatorID="creatorID"
    v-bind:desc="desc"
    v-bind:time="time"
    v-bind:lessonID="lessonID"
    v-bind:problemsCount="problems.length"></LessonViewPageTop>
    <LessonsHolder v-if="display" v-bind:lessons="lessons"></LessonsHolder>
    <div class="divider"></div>
    <ProblemsHolder v-if="display" v-bind:problems="problems"></ProblemsHolder>
  </div>
  `, data(){
    return {
      display: false, lessons: [], problems: [], creatorID: "", desc: "", time: 0, lessonID: "",
    };
  }, methods: {
    getAccountFromURL(){
      let lesson=(window.location.href).substr((window.location.href).indexOf('/lesson-view'));
      if(lesson.indexOf('lesson-view/')=== -1||lesson==='null'||lesson===''||lesson==='undefined'){
        return null;
      }
      this.lessonID=lesson.substring(lesson.indexOf('/lesson-view')+'/lesson-view/'.length, lesson.length);
      return this.lessonID;
    }, distribute(res){
      this.creatorID=res.creatorID;
      this.desc=res.description;
      this.time=res.timeCreated;
      for(let creation in res.creations){
        let k=res.creations[creation];
        if(res.creations[creation].lessonID===undefined){
          let prob=new ProblemInfo(k.problemID, k.startExpression, k.goalExpression, k.description, k.timeCreated);
          this.problems.push(prob);
        }else{
          let les=new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description);
          this.lessons.push(les);
        }
      }
      this.display=true;
    },
  }, mounted(){
    get_lesson_from_db(this.getAccountFromURL(), res=>this.distribute(res));
  }, components: {
    NavigationBar, LessonsHolder, ProblemsHolder, LessonViewPageTop, InvalidPage,
  },
});
