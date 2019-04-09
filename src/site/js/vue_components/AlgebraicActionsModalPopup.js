import * as M from "materialize-css";

export default {
  name: "AlgebraicActionsModalPopup", template: `
    <div id="algebraicModal" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4 class="black-text">Algebraic Actions</h4>
        <ul class="collapsible black-text">
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">filter_drama</i>Alge1</div>
            <div class="collapsible-body black-text"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias deleniti quae voluptate. Accusamus adipisci consequuntur corporis eligendi, esse laboriosam natus nemo numquam porro qui repellat vitae? Eligendi labore nihil vitae.</span></div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">place</i>Alge2</div>
            <div class="collapsible-body black-text"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad exercitationem ipsum odit possimus recusandae. Amet, architecto aut culpa error eveniet, facilis harum inventore iusto natus neque nesciunt obcaecati quas saepe!</span></div>
          </li>
          <li>
            <div class="collapsible-header black-text"><i class="material-icons">whatshot</i>Alge3</div>
            <div class="collapsible-body black-text"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci error libero mollitia suscipit? Aliquid assumenda cumque eum id ipsum iusto maxime natus nostrum numquam quis, recusandae, totam unde voluptate?</span></div>
          </li>
        </ul>
      </div>
    </div>
  `, mounted() {
    M.AutoInit();
  },
};
