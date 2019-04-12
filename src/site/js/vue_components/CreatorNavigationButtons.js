import {createRandomExpression} from "../random_expression_creator";
import {actionsArr, randomProblemGenerator, randomStartGenerator} from "../expression_tree";
import AlgebraicActionsModalPopup from "./AlgebraicActionsModalPopup";

export default {
  name: "CreatorNavigationButtons",
  props: [
    "clearStartStage",
    "clearGoalStage",
    "stage",
    "clearTree",
    "setWorkTree",
  ],
  template: `
  <div>
    <div class="row">
      <a v-bind:href="url" class="tab waves-effect waves-light btn col" v-on:click="load()">
          <i class="material-icons left">folder_open</i>
          Load
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="clear()">
          <i class="material-icons left">clear</i>
          Clear
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="undo()">
          <i class="material-icons left">undo</i>
          Undo
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="redo()">
          <i class="material-icons left">redo</i>
          Redo
      </a>
      <a class="tab waves-effect waves-light btn col modal-trigger" data-target="algebraicModal">
          <i class="material-icons left">help</i>
          Reference
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">history</i>
          History
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="generate()">
          <i class="material-icons left">lightbulb_outline</i>
          Generate
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="clearStartStage()" v-if="stage==='build'">
          <i class="material-icons left">navigate_next</i>
          Create Goal
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="clearGoalStage()" v-if="stage==='manip'">
          <i class="material-icons left">navigate_before</i>
          Change Start
      </a>
      <AlgebraicActionsModalPopup></AlgebraicActionsModalPopup>
    </div>
  </div>  
  `,
  data: () => ({
    url:"http://localhost:8080/profile/accounts/"+"TEST_USER_0",
  }),
  methods: {
    save(){

    },load(){

    }, clear(){
      this.clearTree();
    }, undo(){

    }, redo(){

    }, generate(){
      const numNodes = 15;
      const res = randomStartGenerator(numNodes); // Used to be random expression generator, random start removes any empty tags
      this.setWorkTree(res);
    }
  }, components:{
    AlgebraicActionsModalPopup,
  }
};
