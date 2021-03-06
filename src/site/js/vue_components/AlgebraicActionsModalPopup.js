
export default {
  name: "AlgebraicActionsModalPopup", template: `
    <div id="algebraicModal" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4 class="black-text">Algebraic Actions</h4>
        <ul class="collapsible black-text">
          <li>
            <div class="collapsible-header black-text">Commutative Swap</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6" src="http://localhost:8080/src/site/assets/CommutativeSwap.gif">
              <span class="col s12 m6 l6 xl6" >You may swap the positions of two elements(tag, unknown, or atom) in the same tag quadrant. This action will not work on elements 
                of opposite quadrants, even if they are in the same outer parent.
              </span>
              <span class="col s12 m6 l6 xl6" ><b>To initiate:</b> Select Transfrom mode. Click and drag one element to another that has the same parent.</span>                
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Associative Merge</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6" src="http://localhost:8080/src/site/assets/AssociativeMerge.gif">
              <span class="col s12 m6 l6 xl6">If an inner tag has the same orientation as its outer tag, the outer tag can be collapsed, leaving only the inner tag. There must be
              two tags and the two tags must be the same orientation.</span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Transform mode. Drag the tag button</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Associative Introduction</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/AssociativeIntro.gif">
              <span class="col s12 m6 l6 xl6">Elements of an expression tree may be enclose with another tag of the same orientation. This action works on any element.
              Though there is no limit to this action, try not to abuse.</span>
              <span class="col s12 m6 l6 xl6"><b>To initiate:</b> Select Transform mode. Click the element to enclose.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Associative Extract</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/AssociativeExtract.gif">
              <span class="col s12 m6 l6 xl6">If an inner tag has the saDrag one of the elements to factor into the East-West tag.me orientation as the outer tag, then the elements of 
                the inner tag may be taken out into the outer tag.</span>
              <span class="col s12 m6 l6 xl6"><b>To initiate:</b> Select Tranform mode. Drag the element to extract in the inner tag into the outer tag</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Associative Insert</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/AssociativeInsert.gif">
              <span class="col s12 m6 l6 xl6">If an inner tag has the same orientation as the outer tag, then the elements of the outer tag may be placed into the inner tag.</span>
              <span class="col s12 m6 l6 xl6"><b>To initiate:</b> Select Transform mode. Drag the element to insert from the outer tag into the inner tag.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Distribute</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/Distribute.gif">
              <span class="col s12 m6 l6 xl6">When a North-South tag contains an East-West tag and another element, that element may be distributed through the East-West tag.
              Drag the element to distribute onto the North-South Tag. The resulting tag will  If the North-South tag does not have any other elements besides those two, then 
              the North-South tag will be collapsed.</span>
              <span class="col s12 m6 l6 xl6"><b>To initiate:</b> Select Distribute mode. Drag the element to distribute onto the East-West to distribute onto.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Factor</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/Factor.gif">
              <span class="col s12 m6 l6 xl6">When an East-West tag with North-South tags contain the the same element, that element may be factored out of the East-West tags, 
              creating a North-South tag with the factored element and the remaining elements of the East-West tag. If one of the elements in the 
              is just the element to factor, that element will reduce to the identity atom. To initiate this action, the element
              to factor must be at the top of each North-South tag in the East-West tag. </span>
              <span class="col s12 m6 l6 xl6"><b>To initiate:</b> Select Distribute mode. Drag one of the elements to factor into the East-West tag.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Split Fraction</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/SplitFrac.gif">
              <span class="col s12 m6 l6 xl6">Suppose we have a North-South tag. Let's call it a fraction. If there is a single a single East-West tag is in the north quadrant of the 
              fraction, call it the numerator, and some elements in the south quadrant of the North-South tag, call it the denominator, then the fraction may be 
              split up such that the resulting tag is an East-West tag containing North-South tags. For each element in the summation, the resulting tag will have 
              a North-South tag with that element in the north quadrant and the denominator in the south quadrant. </span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Distribution mode. Drag the tag button of the numerator to the tag button of the fraction.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Combine Fraction</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/CombineFrac.gif">
              <span class="col s12 m6 l6 xl6">Fractions in a East-West tag may be combined into one tag. The numerators of the fractions must have the same denominator. This action
                will also work if used on fractions in the east and west quadrants. 
              </span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Distribution mode. Drag the tag button of one fraction into another.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Quadrant Flip</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/QuadrantFlip.gif">
              <span class="col s12 m6 l6 xl6">If an inner tag has the same orientation as the outer tag, then the inner tag may be flipped to the the opposite quadrant along with it's 
                quadrants being swapped. 
              </span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Tranform mode. Drag the tag button of the desired tag to flip to the opposite quadrant</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Canceling</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/Cancel.gif">
              <span class="col s12 m6 l6 xl6">If two elements in opposite quadrants are equal, then the two elements may be canceled. They must be the same. This will not work
                if you attempt to drag a tag onto an equivalent tag, i.e. if you manipulate one of the tags you can cancel and then drag onto to the other tag,
                this action will not be applied.               
              </span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Transfrom mode. Drag one element to cancel onto the other.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Identity Balance</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/IdentityBalance.gif">
              <span class="col s12 m6 l6 xl6">Any element may be inserted into both quadrants of a tag. This works for both North-South and East-West tags.</span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b>Select Insert mode. Click on the quadrant that you wish to insert the tag in. Then contruct the desired expression to insert.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Atom Merge</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/AtomMerge.gif">
              <span class="col s12 m6 l6 xl6">Two atoms may be combined. The value of the result will depend on the value of the two atoms being combined.</span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Atom Merge mode. Drag one atom onto another.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Atom Absorption</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/AtomAbsorption.gif">
              <span class="col s12 m6 l6 xl6">The zero atom in a North-South tag may absorb any other element with the north quadrant.</span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Atom Merge mode. Drag one atome onto another.</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Atom Destruction</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/AtomDestruction.gif">
              <span class="col s12 m6 l6 xl6">The zero atom may be destroyed from an East-West tag and the one atom may be destroyed in a North-South tag.</span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Atom Merge mode. Drag any element onto the identity</span>
            </div>
          </li>
          <li>
            <div class="collapsible-header black-text">Atom Split</div>
            <div class="collapsible-body black-text row">
              <img class="col s12 m6 l6 xl6"  src="http://localhost:8080/src/site/assets/AtomSplit.gif">
              <span class="col s12 m6 l6 xl6">Atoms may be converted into a pair of two atoms with sum of equivalent value. A zero atom will split into the
                 one and two atoms. A one atom will split into a pair of two atoms. The two atom will split into a pair of one atoms.</span>
              <span class="col s12 m6 l6 xl6"><b>To Initiate:</b> Select Atom Merge mode. Click on any atom.</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `, mounted() {
    M.AutoInit();
  },
};
