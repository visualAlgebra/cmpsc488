import {drawCanvas, historyAction, restart} from "../manipulator";
import {globals} from "../gui";

export default {
  name: "ManipulatorNavigationButtons", template: `
  <div>
    <div class="row">
      <a class="tab waves-effect waves-light btn col">
          <i class="material-icons left">compare_arrows</i>
          Hint
      </a>
      <a class="tab waves-effect waves-light btn col">
          <i class="material-icons left">share</i>
          Share
      </a>
      <a class="tab waves-effect waves-light btn col">
          <i class="material-icons left">rotate_left</i>
          Restart
      </a>
      <a class="tab waves-effect waves-light btn col">
          <i class="material-icons left">undo</i>
          Undo
      </a>
      <a class="tab waves-effect waves-light btn col">
          <i class="material-icons left">redo</i>
          Redo
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">subdirectory_arrow_right</i>
          History tree
      </a>
      <a class="tab waves-effect waves-light btn col">
          <i class="material-icons left">bug_report</i>
          DEBUG INSTANCES
      </a>
    </div>
  </div>  
  `, methods: {
    hint(){
      Alert("hi");
    }, share(){
      Alert("tehehehe");
    }, restart(){
      restart();
    }, undo(){
      historyAction(true);
    }, redo(){
      historyAction(true);
    }, historyTree(){
      drawCanvas();
    }, DEBUG_INSTANCES(){
      console.log('_DEBUG_TRIGGERED');
      console.log("Current tree: "+document.getElementById("canvasContainer").dataset.str);
      console.log(globals.workingExpressionTree);
      console.log('_DEBUG_FINISHED');
    }
  }
};