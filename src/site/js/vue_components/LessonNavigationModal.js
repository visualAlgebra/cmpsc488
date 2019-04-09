import * as M from "materialize-css";
import {LessonInfo, ProblemInfo} from "../expression_tree";

export default {
  name: "LessonNavigationModal", props:["lesson"], template: `
  <div id="lessonModal" class="modal modal-fixed-footer" v-if="lesson">
      <div class="modal-content">
        <h4 class="black-text">Lesson: {{lesson.lessonID}}</h4>
        <ul class="collapsible black-text">
          <li>
            <div class="collapsible-header black-text">Problems</div>
            <div class="collapsible-body">
              <ul class="collapsible black-text">
                <li v-for="prob in dataProblems">
                  <div class="collapsible-header black-text">Problem: {{prob.problemID}}
                    <a :href="url+prob.problemID+lesson" class="secondary-content right">
                      <i class="material-icons">send</i>
                    </a>
                  </div>
                  <div class="collapsible-body black-text"><span>win? (there is a bug here): {{prob.description}}</span></div>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Lessons</div>
            <div class="collapsible-body">
              <ul class="collapsible black-text">
                <li v-for="lesson in dataLessons">
                  <div class="collapsible-header black-text">Lesson: {{lesson.lessonID}}
                    <a :href="lessonUrl+lesson.problemID" class="secondary-content right">
                      <i class="material-icons">send</i>
                    </a>
                  </div>
                  <div class="collapsible-body black-text"><span>{{lesson.description}}</span></div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </ul>
    </div>
  </div>  
  `,data(){
    return {
      dataProblems:[], dataLessons:[], displayProblems:false, displayLessons:false, url:'http://localhost:8080/manipulator/problems/', lessonUrl:'http://localhost:8080/lesson-view/', user:null, lessonName:null,
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
    this.user=this.lesson
    if(this.lesson!==null) {
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
  },
};
