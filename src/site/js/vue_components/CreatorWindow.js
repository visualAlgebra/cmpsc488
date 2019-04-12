import * as M from "materialize-css";
import ManipulatorWindow from "./ManipulatorWindow";

export default {
  name: "CreatorWindow",
  props: [
      "useCreatedTree",
      "mouse",
  ],
  template: `
<div id="creator-window-modal" class="modal grey darken-2">
  <div class="modal-content">
    <ManipulatorWindow
      v-if="showManipulator"
      :tree="tree"
      :mouse="mouse"
    ></ManipulatorWindow>
  </div>
  <div class="modal-footer">
    <button
      @click="closeModal"
      :class="buttonClasses"
    >
      Select Expression as Start
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
    buttonClasses() {
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
    M.Modal.init(modal, {});
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
  },
};