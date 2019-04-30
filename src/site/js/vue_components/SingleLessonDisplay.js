
export default {
  name: "SingleLessonDisplay", props: ["lesson", "deleteLesson", "userStruct", "accountID"], template: `
  <li>
    <div class="collapsible-header blue-grey darken-1 white-text">
      <i class="material-icons white-text left">folder</i>
      <a :href="getLessonID(lesson.lessonID)">
        {{lessonIDDecoded}}
      </a>
      <a v-if="userStruct&&userStruct.accountID===accountID" class="secondary-content dropdown-trigger" :data-target="targetID">
        <i class="material-icons right">delete_forever</i>
      </a>
      <ul v-if="userStruct&&userStruct.accountID===accountID" :id="targetID" class='dropdown-content'>
        <li><a>Are you sure?</a></li>
        <li><a>No</a></li>
        <li><a v-on:click="deleteLesson(lesson.lessonID)">Yes</a></li>
      </ul>
    </div>
    <div class="collapsible-body">
      <h5>
        Creator: {{lesson.creatorAccId}}
        <a :href="getLessonID(lesson.lessonID)" class="secondary-content btn">
          Go to lesson
          <i class="material-icons right">play_arrow</i>
        </a>
      </h5>
      <div>Creation date: {{new Date(lesson.timeCreated).toDateString()}}</div>
      <p>{{lesson.description}}</p>
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
  },
  computed: {
    lessonIDDecoded() {
      return decodeURI(this.lesson.lessonID);
    },
  },
  mounted(){
    M.AutoInit();
  }
};
