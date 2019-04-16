import SingleExpressionDisplay from "./SingleExpressionDisplay";
import * as M from "materialize-css";

export default {
  name: "GoalExpression",

  props: {
    tree: Array,
  },

  template: `
    <div>
      <a id="goalBtn" class="waves-effect waves-light btn btn-floating modal-trigger" data-target="goalModal">Goal</a>
      <div id="goalModal" class="modal modal-fixed-footer">
        <div class="modal-content">
          <SingleExpressionDisplay :tree="tree"></SingleExpressionDisplay>
        </div>
        <div class="modal-footer">
          <a class="modal-close waves-effect waves-green btn-flat" data-target="goalModal">Close</a>
        </div>
      </div>
    </div>
  `, mounted() {
    M.AutoInit();
  }, components: {
    SingleExpressionDisplay
  }
};
