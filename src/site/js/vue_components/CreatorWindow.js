import * as M from "materialize-css";
import ManipulatorWindow from "./ManipulatorWindow";
import InsertionButtons from "./InsertionButtons";

export default {
  name: "CreatorWindow",
  props: [
      "useCreatedTree",
      "mouse",
  ],
  template: `
<div
  id="creator-window-modal"
  class="modal grey darken-2 modal-fixed-footer big-modal"
>
  <div class="modal-content">
    <InsertionButtons
      :mouse="mouse"
    ></InsertionButtons>
    <ManipulatorWindow
      v-if="showManipulator"
      :tree="tree"
      :mouse="mouse"
      :height="'200px'"
    ></ManipulatorWindow>
  </div>
  <div class="modal-footer">
    <button
      @click="closeModal"
      :class="closeButtonClasses"
    >
      Use as Start Expression
    </button>
  </div>
</div>
  `,

  data: () => ({
    instance: null,
    tree: null,
    showManipulator: false,
  }),

  computed: {
    closeButtonClasses() {
      const disabled = this.tree === null;
      return {
        "waves-effect": true,
        "waves-green": true,
        "btn-flat": true,
        disabled,
      };
    },
  },

  mounted() {
    const modal = document.getElementById('creator-window-modal');
    const options = { dismissable: false };
    M.Modal.init(modal, options);
    this.instance = M.Modal.getInstance(modal);
    setTimeout(() => { this.openModal(); }, 0);
  },

  methods: {
    openModal() {
      this.instance.open();
      this.showManipulator = true;
    },
    closeModal() {
      this.instance.close();
      this.useCreatedTree(this.tree);
    },
  },

  components: {
    ManipulatorWindow,
    InsertionButtons,
  },
};