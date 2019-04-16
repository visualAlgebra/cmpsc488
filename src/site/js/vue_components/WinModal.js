export default {
  name: "WinModal", props:["navigateNextProblem"], template: `
  <div id="winModal" class="modal">
      <div class="modal-content center-align">
        <div class="row">
          <h1 class="black-text">Success!</h1>
          <p class="black-text">
            You were able to transform the starting tree into the goal tree. Nice job!
          </p>
        </div>
        <div class="row">
          <a
            class="waves-effect waves-green btn-flat"
            href="http://localhost:8080/explorer.html"
          >
            Return to Explore Page
          </a>
          <div v-if="display">
            <a class="waves-effect waves-green btn-flat" data-target="lessonModal">
              View Lesson
            </a>
          </div>
          <div v-if="display">
            <a class="waves-effect waves-green btn-flat" v-on:click="navigateNextProblem">Go to next problem</a>
          </div>
          </div>
      </div>
  </div>  
  `,data(){
    return{
      display:false,
    }
  }, mounted(){
    if(document.getElementById('lessonModal')){
      this.display=true;
    }
  }
};
