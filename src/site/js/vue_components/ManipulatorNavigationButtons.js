import HistoryNavigationPopout from "./HistoryNavigationPopout";
import {solve} from "../solver";
import {Deserialize} from "../expression_tree";
import {histAction} from "../history_nav";
import {testAll} from "../solver.test";
import LessonNavigationModal from "./LessonNavigationModal";
import {get_lesson_from_db} from "../database_management";
import AlgebraicActionsModalPopup from "./AlgebraicActionsModalPopup";
import HelperAIModal from "./HelperAIModal";
import TutorialModal from "./TutorialModal";

export default {
  name: "ManipulatorNavigationButtons",
  props: ["dataFunc", "restart", "setWorkTree", "setWorkTreeWithHistory", "lessonID"],
  template: `
  <div>
    <div class="row">
      <a class="tab waves-effect waves-light btn col modal-trigger" v-on:click="displayHelper=true" data-target="helperAIModal">
          <i class="material-icons left">blur_on</i>
          Hint
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="share()">
          <i class="material-icons left">share</i>
          Share
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="restartClear()">
          <i class="material-icons left">rotate_left</i>
          Restart
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="undo()">
          <i class="material-icons left">undo</i>
          Undo
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="redo()">
          <i class="material-icons left">redo</i>
          Redo
      </a>
      <a v-if="lessonID" class="tab waves-effect waves-light btn col modal-trigger" data-target="lessonModal">
          <i class="material-icons left">folder</i>
          {{lessonID}}
      </a>
      <a class="tab waves-effect waves-light btn col modal-trigger" data-target="algebraicModal">
          <i class="material-icons left">info</i>
          Reference
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">history</i>
          History
      </a>
      <a class="tab waves-effect waves-light btn col modal-trigger" data-target="tutModal">
          <i class="material-icons left">help</i>
          Tutorial
      </a>  
      <HistoryNavigationPopout v-bind:dataFunc="dataFunc" v-bind:setWorkTree="setWorkTree"></HistoryNavigationPopout>
      <LessonNavigationModal v-if="lessonID&&lesson" v-bind:lesson="lesson"></LessonNavigationModal>
      <AlgebraicActionsModalPopup></AlgebraicActionsModalPopup>
      <HelperAIModal v-if="displayHelper" v-bind:dataFunc="dataFunc" v-bind:closeHelper="closeHelper"></HelperAIModal>
      <TutorialModal></TutorialModal>
    </div>
  </div>  
  `,
  data() {
    return {
      lesson:null, displayHelper:false,
    };
  }, mounted(){
    if(this.lessonID!==null){
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
    }, closeHelper(){
      this.displayHelper=false;
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
