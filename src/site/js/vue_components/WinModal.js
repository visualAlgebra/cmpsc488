export default {
  name: "WinModal",template: `
  <div id="lessonModal" class="modal">
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
        </div>
      </div>
  </div>  
  `
};
