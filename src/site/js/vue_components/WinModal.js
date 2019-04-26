export default {
  name: "WinModal", props:["navigateNextProblem", "hasLessonAttached"], template: `
  <div id="winModal" class="modal">
      <div class="modal-content center-align">
        <div class="row">
          <h1 class="black-text">Success!</h1>
          <h5 class="black-text">
            You were able to transform the starting tree into the goal tree. Nice job!
          </h5>
        </div>
        <div class="row">
          <a
            class="waves-effect waves-green btn-flat"
            href="http://localhost:8080/explorer.html"
          >
            Return to Explore Page
          </a>
          <div v-if="hasLessonAttached">
            <a class="waves-effect waves-green btn-flat modal-trigger" data-target="lessonModal">
              View Lesson
            </a>
          </div>
          <div v-if="hasLessonAttached">
            <a class="waves-effect waves-green btn-flat" v-on:click="navigateNextProblem">Go to next problem</a>
          </div>
          </div>
      </div>
  </div>  
  `
};
