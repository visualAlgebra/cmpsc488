import HistoryNavigationPopout from "./HistoryNavigationPopout";
import {solve} from "../solver";
import {Deserialize} from "../expression_tree";
import {histAction} from "../history_nav";
import {testAll} from "../solver.test";
import LessonNavigationModal from "./LessonNavigationModal";
import {get_lesson_from_db} from "../database_management";
import AlgebraicActionsModalPopup from "./AlgebraicActionsModalPopup";

export default {
  name: "ManipulatorNavigationButtons",
  props: ["dataFunc", "restart", "setWorkTree", "lessonID"],
  template: `
  <div>
    <div class="row">
      <a class="tab waves-effect waves-light btn col" v-on:click="hint()">
          <i class="material-icons left">compare_arrows</i>
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
          <i class="material-icons left">bug_report</i>
          Algebraic descriptions
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">subdirectory_arrow_right</i>
          History tree
      </a>
      <a class="tab waves-effect waves-light btn col modal-trigger" v-on:click="getAINode()" data-target="helperAIModal">
          <i class="material-icons left">help_outline</i>
          AI help
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="DEBUG_INSTANCES()">
          <i class="material-icons left">bug_report</i>
          DEBUG INSTANCES
      </a>
      <HistoryNavigationPopout v-bind:dataFunc="dataFunc" v-bind:setWorkTree="setWorkTree"></HistoryNavigationPopout>
      <LessonNavigationModal v-if="lessonID&&lesson" v-bind:lesson="lesson"></LessonNavigationModal>
      <AlgebraicActionsModalPopup></AlgebraicActionsModalPopup>
      <HelperAIModal v-if="AINode" v-bind:node="AINode"></HelperAIModal>
    </div>
  </div>  
  `,
  data() {
    return {
      lesson:null, AINode:null,
    };
  }, mounted(){
    if(this.lessonID!==null){
      get_lesson_from_db(this.lessonID, this.initLessonDropdown);
    }
  },
  methods: {
    hint() {
      let problems = this.dataFunc();
      solve(Deserialize(problems[0]), Deserialize(problems[1]));
    }, share() {
      console.log("tehehehe");
    }, restartClear() {
      this.restart();
    }, undo() {
      this.setWorkTree(histAction(false));
    }, redo() {
      this.setWorkTree(histAction(true));
    }, initLessonDropdown(res){
      this.lesson=res;
    }, getAINode() {
      let tempTrees=this.dataFunc();
      this.AINode=solve(tempTrees[0],tempTrees[1]);
    }, DEBUG_INSTANCES() {
      console.log('_DEBUG_TRIGGERED');
      console.log(this.dataFunc());
      testAll();

      // Enable the following commented code to test problem generator
      /*
      var test = randomProblemGenerator(10, actionsArr, 15);
      var retval=new ProblemInfo('RAND_PROBLEM_3');
      compress_string_js(test.start.toString(), res=>{
        retval.expression_start=res;
        compress_string_js(test.goal.toString(), res2=>{
          retval.expression_goal=res2;
          retval.description="lul";
          post_problem_from_site(retval);
        });
      });
      */


      console.log('_DEBUG_FINISHED');
    },
  },
  components: {
    HistoryNavigationPopout, LessonNavigationModal, AlgebraicActionsModalPopup,
  },
};
