import HistoryNavigationPopout from "./HistoryNavigationPopout";
import {histAction} from "../history_nav";
import {testAll} from "../solver.test";
import LessonNavigationModal from "./LessonNavigationModal";
import {get_lesson_from_db} from "../database_management";
import AlgebraicActionsModalPopup from "./AlgebraicActionsModalPopup";
import HelperAIModal from "./HelperAIModal";
import TutorialModal from "./TutorialModal";

export default {
  name: "ManipulatorNavigationButtons",
  props: ["dataFunc", "restart", "setWorkTree", "setWorkTreeWithHistory", "lessonID", "problemID", "setNextProblemURL"],
  template: `
  <div>
    <div class="row spaced-out-row">
      <a class="tab waves-effect waves-light btn col modal-trigger" v-on:click="displayHelper=true" data-target="helperAIModal">
          <i class="material-icons left">blur_on</i>
          <span class="truncate">Hint</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="share()">
          <i class="material-icons left">share</i>
          <span class="truncate">Share</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="restartClear()">
          <i class="material-icons left">rotate_left</i>
         <span class="truncate">Restart</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="undo()">
          <i class="material-icons left">undo</i>
          <span class="truncate">Undo</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="redo()">
          <i class="material-icons left">redo</i>
          <span class="truncate">Redo</span>
      </a>
      <a v-if="lessonID" class="tab waves-effect waves-light btn col modal-trigger" data-target="lessonModal">
          <i class="material-icons left">folder</i>
          <span class="truncate">Lesson</span>
      </a>
      <a class="tab waves-effect waves-light btn col modal-trigger" data-target="algebraicModal">
          <i class="material-icons left">info</i>
          <span class="truncate">Reference</span>
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">history</i>
          <span class="truncate">History</span>
      </a>
      <a class="tab waves-effect waves-light btn col modal-trigger" data-target="tutModal">
          <i class="material-icons left">help</i>
          <span class="truncate">Tutorial</span>
      </a>  
    </div>
    <HelperAIModal v-if="displayHelper" v-bind:dataFunc="dataFunc" v-bind:closeHelper="closeHelper"></HelperAIModal>
    <HistoryNavigationPopout v-bind:dataFunc="dataFunc" v-bind:setWorkTree="setWorkTree"></HistoryNavigationPopout>
    <LessonNavigationModal v-if="lessonID&&lesson" v-bind:lesson="lesson"></LessonNavigationModal>
    <AlgebraicActionsModalPopup></AlgebraicActionsModalPopup>
    <TutorialModal></TutorialModal>
  </div>  
  `,
  data() {
    return {
      lesson:null, displayHelper:false,
    };
  }, mounted(){
    if(this.lessonID!==null&&this.lessonID.length!==0){
      get_lesson_from_db(this.lessonID, this.initLessonDropdown);
    }
  },
  methods: {
    share() {
      console.log("tehehehe");
    }, restartClear() {
      this.restart();
    }, undo() {
      this.setWorkTree(histAction(false));
    }, redo() {
      this.setWorkTree(histAction(true));
    }, initLessonDropdown(res){
      this.lesson=res;
    }, closeHelper(tree, actionName){
      this.displayHelper=false;
      if(tree!==null&&actionName!==null){
        this.setWorkTreeWithHistory(tree, actionName);
      }
    }, DEBUG_INSTANCES() {

      //
      // ATTACH FUNCTIONALITY TO window.MY_GLOBAL_FUNCTION, and then call it
      // from the console.
      //

      console.log('_DEBUG_TRIGGERED');
      console.log(this.dataFunc());
      testAll();
      console.log('_DEBUG_FINISHED');
    },
  },
  components: {
    HistoryNavigationPopout, LessonNavigationModal, AlgebraicActionsModalPopup, HelperAIModal, TutorialModal
  },
};
