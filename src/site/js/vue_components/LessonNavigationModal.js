export default {
  name: "LessonNavigationModal", props:["lesson", "problemID", "setNextProblemURL"], template: `
  <div id="lessonModal" class="modal modal-fixed-footer" v-if="lesson">
      <div class="modal-content">
        <h4 class="black-text">Lesson: {{lesson.lessonID}}</h4>
        <ul class="collapsible black-text">
          <li>
            <div class="collapsible-header black-text">Problems</div>
            <div class="collapsible-body">
              <div class="collection"><a :href="url+problem" :class="getCurrentProblem(problem)" v-for="problem in dataProblems">{{problem}}</a></div>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Lessons</div>
            <div class="collapsible-body">
              <div class="collection"><a :href="lessonUrl+lesson" :class="getCurrentLesson(lesson)" v-for="lesson in dataLessons">{{lesson}}</a></div>
            </div>
          </li>
        </ul>
      </ul>
    </div>
  </div>  
  `,data(){
    return {
      dataProblems:[], dataLessons:[], displayProblems:false, displayLessons:false, url:'http://localhost:8080/manipulator/problems', lessonUrl:'http://localhost:8080/lesson-view/', lessonName:null,  foundNextProb:false
    }
  },
  methods: {
    problems(){
      this.displayLessons=false;
      this.displayProblems=true;
    }, lessons(){
      this.displayProblems=false;
      this.displayLessons=true;
    }, getCurrentProblem(problem){
      return{
        "collection-item" :true,
        "black-text" :true,
        "blue":this.problemID.replace("/","\\")===problem,
      }
    }, getCurrentLesson(lesson){
      return{
        "collection-item" :true,
        "black-text" :true,
        "blue":this.lesson.replace("/","\\")===lesson,
      }
    }
  }, mounted() {
    M.AutoInit();
    if(this.lesson!==null) {
      for (let creation in this.lesson.creations) {
        let k = this.lesson.creations[creation];
        if(k.indexOf("lessons/")===-1){
          this.dataProblems.push(k.replace("problems/",""));
        }else{
          this.dataLessons.push(k.replace("lessons/",""));
        }
      }
    }
  },
};
