import * as M from "materialize-css";
import SingleLessonDisplay from "./SingleLessonDisplay";

export default {
  name: "LessonHolder", props: ["lessons"], template: `
  <div>
    <ul class="collection with-header">
      <li class="collection-header blue-grey darken-1 white-text">
        <h4 id="lessonsSavedAmountField">Lessons: {{lessons.length}}</h4>
      </li>
      <SingleLessonDisplay v-if="lessons.length>0" v-bind:lessons="lessons"></SingleLessonDisplay>
    </ul>
  </div>  
  `, mounted(){
    M.AutoInit();
  }, components: {
    SingleLessonDisplay,
  }
};