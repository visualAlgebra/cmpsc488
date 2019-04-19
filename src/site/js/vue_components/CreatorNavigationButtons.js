import {randomStartGenerator} from "../expression_tree";
import AlgebraicActionsModalPopup from "./AlgebraicActionsModalPopup";

export default {
  name: "CreatorNavigationButtons", props: ["stage", "clearTree", "setWorkTree", "problemIsSavable", "editStartTree", "saveProblem", ], template: `
  <div>
    <div class="row spaced-out-row">
      <a v-bind:href="url" class="tab waves-effect waves-light btn col">
          <i class="material-icons left">folder_open</i>
          <span class="truncate">Load</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="clearTree()">
          <i class="material-icons left">clear</i>
          <span class="truncate">Clear</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="undo()">
          <i class="material-icons left">undo</i>
          <span class="truncate">Undo</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="redo()">
          <i class="material-icons left">redo</i>
          <span class="truncate">Redo</span>
      </a>
      <a class="tab waves-effect waves-light btn col modal-trigger" data-target="algebraicModal">
          <i class="material-icons left">info</i>
          <span class="truncate">Reference</span>
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">history</i>
          <span class="truncate">History</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="generate()">
          <i class="material-icons left">lightbulb_outline</i>
          <span class="truncate">Generate</span>
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="editStartTree()" v-if="stage==='manip'">
          <i class="material-icons left">navigate_before</i>
          <span class="truncate">Edit Start</span>
      </a>
      <a v-bind:class="saveBtnClasses" v-on:click="saveProblem()">
          <i class="material-icons left">save</i>
          <span class="truncate">Save</span>
      </a>
    </div>
    <HistoryNavigationPopout v-bind:dataFunc="dataFunc" v-bind:setWorkTree="setWorkTree"></HistoryNavigationPopout>
    <AlgebraicActionsModalPopup></AlgebraicActionsModalPopup>
  </div>  
  `,
  data: () => ({
    url:"http://localhost:8080/profile.html",
  }), computed: {
    saveBtnClasses() {
      const disabled = !this.problemIsSavable;
      return {
        "tab": true,
        "waves-effect": true,
        "waves-light": true,
        "btn": true,
        "col": true,
        disabled,
      };
    },
  }, methods: {
    undo(){
      console.log("hi3");
    }, redo(){
      console.log("hi4");
    }, generate(){
      const numNodes = 15;
      const res = randomStartGenerator(numNodes); // Used to be random expression generator, random start removes any empty tags
      this.setWorkTree(res);
    }
  }, components:{
    AlgebraicActionsModalPopup,
  }
};
