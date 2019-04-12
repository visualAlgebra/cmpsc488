import * as M from "materialize-css";
import SingleExpressionDisplay from "./SingleExpressionDisplay";
import {solve} from "../solver";
import {Deserialize} from "../expression_tree";

export default {
  name: "HelperAIModal",props:["dataFunc", "closeHelper"], template: `
    <div id="helperAIModal" class="modal modal-fixed-footer">
      <div class="modal-content" v-if="display">
        <h4 class="black-text">Action Applied: {{AINode.action.name}}</h4>
        <SingleExpressionDisplay v-if="display" v-bind:tree="AINode.expression"></SingleExpressionDisplay>
      </div>
      <div class="modal-footer" v-if="display">
        <a class="modal-close waves-effect waves-green btn-flat" v-on:click="close()">Close</a>
      </div>
    </div>
  `, data(){
    return{
      AINode:null, display:false,
    }
  }, methods:{
    close(){
      this.closeHelper();
    }
  }, mounted() {
    M.AutoInit();
    let tempTrees=this.dataFunc();
    this.AINode=solve(Deserialize(tempTrees[0]),Deserialize(tempTrees[1]));
    this.display=true;
  }, components: {
    SingleExpressionDisplay,
  }
};
