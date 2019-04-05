import {createRandomExpression} from "../random_expression_creator";
import {actionsArr, randomProblemGenerator, randomStartGenerator} from "../expression_tree";
import AlgebraicActionsModalPopup from "./AlgebraicActionsModalPopup";

export default {
  name: "CreatorNavigationButtons",
  props: [
    "goToNextStage",
    "stage",
    "clearTree",
    "setWorkTree",
  ],
  template: `
  <div>
    <div class="row">
      <a class="tab waves-effect waves-light btn col" v-on:click="save()" v-if="stage==='build'">
          <i class="material-icons left">file_upload</i>
          Save
      </a>
      <a v-bind:href="url" class="tab waves-effect waves-light btn col" v-on:click="load()">
          <i class="material-icons left">file_download</i>
          Load
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="clear()">
          <i class="material-icons left">rotate_left</i>
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
          <i class="material-icons left">bug_report</i>
          Algebraic descriptions
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">sort</i>
          History tree
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="generate()">
          <i class="material-icons left">create</i>
          Generate expression
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="goToNextStage()" v-if="stage==='build'">
          <i class="material-icons left">play_arrow</i>
          Build goal
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
