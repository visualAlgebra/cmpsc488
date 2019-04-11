import * as M from "materialize-css";
import SingleExpressionDisplay from "./SingleExpressionDisplay";

export default {
  name: "HelperAIModal", props: ["node"], template: `
    <div id="helperAIModal" class="modal" v-if="node">
      <div class="modal-content">
        <h4 class="black-text">Action Applied:</h4>
        <p>{{node.action.name}}</p>
        <SingleExpressionDispay v-bind:tree="node.expression"></SingleExpressionDispay>
      </div>
      <div class="modal-footer">
        <a class="modal-close waves-effect waves-green btn-flat">Apply</a>
      </div>
    </div>
  `, mounted() {
    M.AutoInit();
  }, components: {
    SingleExpressionDisplay,
  }
};
