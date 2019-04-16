import * as M from "materialize-css";

export default {
  name: "AlgebraicActionsModalPopup", template: `
    <div id="algebraicModal" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4 class="black-text">Algebraic Actions</h4>
        <ul class="collapsible black-text">
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">filter_drama</i>Commutative Swap</div>
            <div class="collapsible-body black-text">
              <img src="http://localhost:8080/src/site/assets/com_swap_160.gif"><br>
              <span>You may swap the positions of two elements(tag, unknown, or atom) in the same tag quadrant. This action will not work on elements 
                of different quadrants, even if they are in the same outer parent.
              </span><br>
              <p><b>To initiate:</b>Select Transfrom mode. Click and drag one element to another that has the same parent.</p>                
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">place</i>Associative Merge</div>
            <div class="collapsible-body black-text">
              <span>If an inner tag has the same orientation as its outer tag, the outer tag can be collapsed, leaving only the inner tag. There must be
              two tags and the two tags must be the same orientation.</span><br>
              <p><b>To Initiate:</b> Select Transform mode. Drag the tag button</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">whatshot</i>Associative Introduction</div>
            <div class="collapsible-body black-text">
              <span>Elements of an expression tree may be enclose with another tag of the same orientation. This action works on any element.
              Though there is no limit to this action, try not to abuse.</span><br>
              <p><b>To initiate:</b> Select Transform mode. Click the element to enclose.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Associative Extract</div>
            <div class="collapsible-body black-text">
              <span>If an inner tag has the saDrag one of the elements to factor into the East-West tag.me orientation as the outer tag, then the elements of the inner tag may be taken out into the outer tag.</span>
              <p><b>To initiate:</b> Select Tranform mode. Drag the element to extract in the inner tag into the outer tag</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Associative Insert</div>
            <div class="collapsible-body black-text">
              <span>If an inner tag has the same orientation as the outer tag, then the elements of the outer tag may be placed into the inner tag.</span><br>
              <p><b>To initiate:</b> Select Transform mode. Drag the element to insert from the outer tag into the inner tag.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Distribute</div>
            <div class="collapsible-body black-text">
              <span>When a North-South tag contains an East-West tag and another element, that element may be distributed through the East-West tag.
              Drag the element to distribute onto the North-South Tag. The resulting tag will  If the North-South tag does not have any other elements besides those two, then 
              the North-South tag will be collapsed.</span><br>
              <p><b>To initiate:</b> Select Distribute mode. Drag the element to distribute onto the East-West to distribute onto.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Factor</div>
            <div class="collapsible-body black-text">
              <span>When an East-West tag with North-South tags contain the the same element, that element may be factored out of the East-West tags, 
              creating a North-South tag with the factored element and the remaining elements of the East-West tag. If one of the elements in the 
              is just the element to factor, that element will reduce to the identity atom. To initiate this action, the element
              to factor must be at the top of each North-South tag in the East-West tag. </span><br>
              <p><b>To initiate:</b> Select Distribute mode. Drag one of the elements to factor into the East-West tag.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Split Fraction</div>
            <div class="collapsible-body black-text">
              <span>Suppose we have a North-South tag. Let's call it a fraction. If there is a single a single East-West tag is in the north quadrant of the 
              fraction, call it the numerator, and some elements in the south quadrant of the North-South tag, call it the denominator, then the fraction may be 
              split up such that the resulting tag is an East-West tag containing North-South tags. For each element in the summation, the resulting tag will have 
              a North-South tag with that element in the north quadrant and the denominator in the south quadrant. </span><br>
              <p><b>To Initiate:</b> Select Distribution mode. Drag the tag button of the numerator to the tag button of the fraction.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Combine Fraction</div>
            <div class="collapsible-body black-text">
              <span>Fractions in a East-West tag may be combined into one tag. The numerators of the fractions must have the same denominator. This action
                will also work if used on fractions in the east and west quadrants. 
              </span><br>
              <p><b>To Initiate:</b> Select Distribution mode. Drag the tag button of one fraction into another.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Quadrant Flip</div>
            <div class="collapsible-body black-text">
              <span>If an inner tag has the same orientation as the outer tag, then the inner tag may be flipped to the the opposite quadrant along with it's 
                quadrants being swapped. 
              </span><br>
              <p><b>To Initiate:</b> Select Tranform mode. Drag the tag button of the desired tag to flip to the opposite quadrant</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Canceling</div>
            <div class="collapsible-body black-text">
              <span>If two elements in opposite quadrants are equal, then the two elements may be canceled.</span><br>
              <p><b>To Initiate:</b> Select Transfrom mode. Drag one element to cancel onto the other.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Identity Balance</div>
            <div class="collapsible-body black-text">
              <span>Any element may be inserted into both quadrants of a tag.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Atom Merge</div>
            <div class="collapsible-body black-text">
              <span>Two atoms may be combined</span><br>
              <p><b>To Initiate:</b> Select Atom Merge mode. Drag one atom onto another.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Zero Merge</div>
            <div class="collapsible-body black-text">
              <span>The zero atom in a North-South tag may destroy everything.</span><br>
              <p><b>To Initiate:</b> Select Atom Merge mode. Drag one atome onto another.</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Identity Merge</div>
            <div class="collapsible-body black-text">
              <span>The identity may be removed from a tag</span>
              <p><b>To Initiate:</b> Select Atom Merge mode. Drag any element onto the identity</p>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class=""></i>Atom Conversion</div>
            <div class="collapsible-body black-text">
              <span>Atoms may be converted into their equivalent atoms</span>
              <p><b>To Initiate:</b> Select Atom Merge mode. Click on any atom.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `, mounted() {
    M.AutoInit();
  },
};
