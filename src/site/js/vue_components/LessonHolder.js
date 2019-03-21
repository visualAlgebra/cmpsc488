import * as M from "materialize-css";

export default {
  name: "LessonHolder", props: ["lessonCount"], template: `
  <div>
    <ul class="collection with-header">
      <li class="collection-header blue-grey darken-1 white-text">
        <h4 id="lessonsSavedAmountField">Lessons: {{lessonCount}}</h4>
      </li>
    </ul>
  </div>  
  `,
  data() {
    return {

    };
  },
  mounted(){
    M.AutoInit();
  }
};