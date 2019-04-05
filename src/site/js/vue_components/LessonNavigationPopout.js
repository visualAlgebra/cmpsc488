import ProblemsHolder from "./ProblemsHolder";
import * as M from "materialize-css";
import LessonsHolder from "./LessonsHolder";
import {LessonInfo, ProblemInfo} from "../expression_tree";

export default {
  name: "LessonNavigationPopout", props:["lesson"], template: `
  <div v-if="lesson">
    <ul id="lessonNav" class="sidenav">
      <li>
        <a class="subheader">Lesson: {{lesson.lessonID}}</a>
      </li>
      <li>
        <div>
          <a class="tab waves-effect waves-light btn col" v-on:click="problems()">
            <i class="material-icons left">details</i>
            Problems
          </a>
           <a class="tab waves-effect waves-light btn col" v-on:click="lessons()">
            <i class="material-icons left">folder</i>
            Lessons
          </a>
        </div>
        <ProblemsHolder v-if="dataProblems.length!==0&&displayProblems" v-bind:problems="dataProblems"></ProblemsHolder>
        <LessonsHolder v-if="dataLessons.length!==0&&displayLessons" v-bind:lessons="dataLessons"></LessonsHolder>
      </li>
    </ul>
  </div>  
  `,data(){
    return {
      dataProblems:[], dataLessons:[], displayProblems:false, displayLessons:false,
    }
  },
  methods: {
    problems(){
      this.displayLessons=false;
      this.displayProblems=true;
    }, lessons(){
      this.displayProblems=false;
      this.displayLessons=true;
    }
  }, mounted() {
    M.AutoInit();
    console.log("called");
    if(this.lesson!==null) {
      console.log("called");
      for (let creation in this.lesson.creations) {
        let k = this.lesson.creations[creation];
        if (this.lesson.creations[creation].lessonID === undefined) {
          let prob = new ProblemInfo(k.problemID, k.startExpression, k.goalExpression, k.description, k.timeCreated);
          this.dataProblems.push(prob);
        } else {
          let les = new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description);
          this.dataLessons.push(les);
        }
      }
    }
  }, components: {
    ProblemsHolder, LessonsHolder,
  }
};
