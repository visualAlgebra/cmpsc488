import * as M from "materialize-css";
import SingleExpressionDisplay from "./SingleExpressionDisplay";
import {solve} from "../solver";
import {Deserialize} from "../expression_tree";

export default {
  name: "HelperAIModal",props:["dataFunc", "closeHelper"], template: `
    <div id="helperAIModal" class="modal modal-fixed-footer">
      <div class="modal-content" v-if="AINode">
        <h4 class="black-text">Action Applied:</h4>
        <p>{{AINode.action.name}}</p>
        <SingleExpressionDisplay v-bind:tree="AINode.expression"></SingleExpressionDisplay>
      </div>
      <div class="modal-footer" v-if="AINode">
        <a class="modal-close waves-effect waves-green btn-flat" v-on:click="closeHelper(AINode.expression.toString(), AINode.action.name)">Apply</a>
      </div>
    </div>
  `, data(){
    return{
      AINode:null,
    }
  }, mounted() {
    let tempTrees=this.dataFunc();
    this.AINode=solve(Deserialize(tempTrees[0]),Deserialize(tempTrees[1]));
    M.AutoInit();
  }, components: {
    SingleExpressionDisplay,
  }
};
