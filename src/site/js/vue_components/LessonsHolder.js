import SingleLessonDisplay from "./SingleLessonDisplay";

export default {
  name: "LessonsHolder", props: ["lessons", "deleteLesson", "userStruct", "accountID"], template: `
  <div>
    <ul class="collection with-header">
      <li class="collection-header blue-grey darken-1 white-text">
        <h4 id="lessonsSavedAmountField">Lessons: {{lessons.length}}</h4>
      </li>
      <ul class="collapsible">
        <SingleLessonDisplay v-for="(lesson, index) in lessons" v-bind:key="index" v-bind:lesson="lesson" v-bind:deleteLesson="deleteLesson" v-bind:userStruct="userStruct" v-bind:accountID="accountID"></SingleLessonDisplay>
      </ul>
    </ul>
  </div>  
  `, mounted(){
    M.AutoInit();
  }, components: {
    SingleLessonDisplay,
  }
};
