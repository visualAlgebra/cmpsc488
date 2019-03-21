import * as M from "materialize-css";

export default {
  name: "LessonHolder", props: ["lessons"], template: `
  <div>
    <ul id="lessonHolder" class="collapsible">
      <li v-for="(lesson, index) in lessons">
        <div class="collapsible-header blue-grey darken-1 white-text">
          <i class="material-icons white-text left">folder</i>
          {{lesson.lessonID}}
          <a href="http://localhost:8080/lesson-view/UPDATED_TEST_LESSON_1" class="secondary-content">
            <i class="material-icons">send</i>
          </a>
        </div>
        <div class="collapsible-body">
          <div>Created By: {{lesson.creatorAccId}}
            <a :href="getURL(lesson.creatorAccId)" class="secondary-content">
              <i class="material-icons">send</i>
            </a>
          </div>
          <div>Created: {{new Date(lesson.timeCreated)}}</div>
          <div>{{lesson.description}}</div>
        </div>
      </li>
    </ul>
  </div>  
  `, methods: {
    getURL(creatorAccId){
      return "http://localhost:8080/profile/accounts/"+creatorAccId;
    }
  }, mounted(){
    M.AutoInit();
  }
};