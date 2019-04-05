import HistoryNavigationPopout from "./HistoryNavigationPopout";
import { solve } from "../solver";
import {Deserialize, randomProblemGenerator, compress_string_js, ProblemInfo, actionsArr} from "../expression_tree";
import {clearHist, histAction} from "../history_nav";
import {testAll} from "../solver.test";
import { post_problem_from_site, delete_problem_from_db } from "../database_management";
import {displayExpressionTree, displayTreeFromDBStruct} from "../display_feature";
import {CommutativeSwap} from "../algebraic_actions";

export default {
  name: "ManipulatorNavigationButtons", props:["dataFunc", "setTreeFunc", "restart", "setWorkTree"], template: `
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
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">subdirectory_arrow_right</i>
          History tree
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="DEBUG_INSTANCES()">
          <i class="material-icons left">bug_report</i>
          DEBUG INSTANCES
      </a>
      <HistoryNavigationPopout v-bind:dataFunc="dataFunc" v-bind:setWorkTree="setWorkTree"></HistoryNavigationPopout>
    </div>
  </div>  
  `, methods: {
    hint(){
      let problems = this.dataFunc();
      solve(Deserialize(problems[0]), Deserialize(problems[1]));
    }, share(){
      console.log("tehehehe");
    }, restartClear(){
      this.restart();
      console.log("u tried to restart but u cant, so reload plz")
    }, undo(){
      this.setTreeFunc(histAction(false));
    }, redo(){
      this.setTreeFunc(histAction(true));
    }, DEBUG_INSTANCES(){
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
  components:{
    HistoryNavigationPopout,
  },
};
