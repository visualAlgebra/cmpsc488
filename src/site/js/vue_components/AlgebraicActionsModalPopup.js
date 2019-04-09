import * as M from "materialize-css";
import HistoryNavigationHistoryLine from "./HistoryNavigationHistoryLine";
import {addHistoryEntry, getHistoryController, setGoalTree} from "../history_nav";

export default {
  name: "AlgebraicActionsModalPopup", template: `
    <div id="algebraicModal" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4 class="black-text">Algebraic Actions</h4>
        <ul class="collapsible black-text">
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">filter_drama</i>Commutative Swap</div>
            <div class="collapsible-body black-text">
              <span>You may swap the positions of two nodes in the same tag quadrant. Click and drag one element to another that has the same parent.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">place</i>Associative Merge</div>
            <div class="collapsible-body black-text">
              <span>If an inner tag has the same orientation as its enclosing tag, the elements in the inner tag can be extracted
               and put into the outer tag i.e. an NS tag in an NS tag or an EW tag in an EW tag. Click and drag the tag button to another tag button.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">whatshot</i>Associative Introduction</div>
            <div class="collapsible-body black-text">
              <span>Elements of an expression tree may be enclose with another tag of the same orientation. Click any element to enclose it.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Associative Extract</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Associative Insert</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Distribute</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Factor</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Split Fraction</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Combine Fraction</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Tag Flip</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Canceling</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Identity Balance</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Literal Merge</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Zero Merge</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Identity Merge</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Literal Conversion</div>
            <div class="collapsible-body black-text">
              <span></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,data(){
    return {
    }
  }, mounted() {
    M.AutoInit();
  }, components:{
  },
};
