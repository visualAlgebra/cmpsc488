import {ClickTargetKind, MouseState} from "../gui";

export default {
  name: "InsertButton",

  props: {
    clickTargetKind: String,
  },

  template: `
<button
  v-on="listeners"
  class="btn waves-effect waves-light"
>
  <i class="material-icons left">add</i>
  <slot></slot>
</button>
  `,

  data: () => ({
    listeners: {
      mousedown(e) {
        e.stopPropagation();
        if (this.mouse.state === MouseState.Idle) {
          this.mouse.state = MouseState.Dragging;
          this.mouse.eventSource = {
            kind: ClickTargetKind.InsertionButton,
            tree: this.tree,
          };
        }
      },

      mouseup(e) {
        e.stopPropagation();
        this.mouse.reset();
      },
    },
  }),

}