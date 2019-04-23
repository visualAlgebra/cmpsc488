import SingleExpressionDisplay from "./SingleExpressionDisplay";
import {solve} from "../solver";
import {Deserialize} from "../expression_tree";

export default {
  name: "HelperAIModal", props: ["dataFunc", "closeHelper"], template: `
    <div id="helperAIModal" class="modal modal-fixed-footer big-modal">
      <div class="modal-content" v-if="display">
        <h4 v-if="AINode"
        class="black-text center-align">
        Hint: try applying {{AINode.action.name}}</h4>
        <h4 v-else
        class="black-text center-align">
        Goal Already Reached, Good Job!</h4>
        <SingleExpressionDisplay
          v-if="display && instance && instance.isOpen && AINode"
          v-bind:tree="AINode.expression"
          v-bind:height="'500px'"
          v-bind:worldHeight="'900'"
        ></SingleExpressionDisplay>
      </div>
      <div class="modal-footer" v-if="display">
        <a v-if="AINode"
        class="modal-close waves-effect waves-green btn-flat" v-on:click="closeHelper(AINode.expression.toString(), AINode.action.name)">Apply</a>
        <a class="modal-close waves-effect waves-green btn-flat" v-on:click="close()">Close</a>
      </div>
    </div>
  `, data(){
    return {
      AINode: null, display: false, instance: null,
    }
  }, methods: {
    close(){
      this.closeHelper(null, null);
    }
  }, mounted(){
    M.AutoInit();
    const dom=document.getElementById("helperAIModal");
    this.instance=M.Modal.getInstance(dom);
    let tempTrees=this.dataFunc();
    this.AINode=solve(Deserialize(tempTrees[0]), Deserialize(tempTrees[1]));
    this.display=true;
  }, components: {
    SingleExpressionDisplay,
  }
};
