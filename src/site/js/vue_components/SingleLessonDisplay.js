import * as M from "materialize-css";

export default {
  name: "SingleLessonDisplay", props: ["lesson", "deleteLesson"], template: `
  <li>
    <div class="collapsible-header blue-grey darken-1 white-text">
      <i class="material-icons white-text left">folder</i>
      {{lesson.lessonID}}
      <a :href="getLessonID(lesson.lessonID)" class="secondary-content">
        <i class="material-icons">send</i>
      </a>
      <a class="secondary-content dropdown-trigger" :data-target="targetID">
        <i class="material-icons">delete_forever</i>
      </a>
      <ul :id="targetID" class='dropdown-content'>
        <li><a>Are you sure?</a></li>
        <li><a>No</a></li>
        <li><a v-on:click="deleteLesson(lesson.lessonID)">Yes</a></li>
      </ul>
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
  `, data(){
    return{
      targetID:"dataL"+this.lesson.lessonID
    }
  }, methods: {
    getURL(creatorAccId){
      return "http://localhost:8080/profile/accounts/"+creatorAccId;
    }, getLessonID(id){
      return "http://localhost:8080/lesson-view/"+id.substr(id.indexOf('/')+1);
    }
    // , deleteLess(){
    //   this.deleteLesson(this.lesson.lessonID);
    // }
  }, mounted(){
    M.AutoInit();
  }
};
