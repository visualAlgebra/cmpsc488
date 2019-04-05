import {Mouse, MouseState} from "../../gui";

export default {

  props: {
    // Use this prop like so:
    //   <MyComponent interactive></MyComponent> --> interactive == true
    //   <MyComponent></MyComponent>             --> interactive == false
    interactive: Boolean,
    mouse: Mouse,
  },

  computed: {
    listeners() {
      if (this.interactive) {
        return {
          mousedown: this.mouseDown,
          mousemove: this.mouseMove,
          mouseup: this.mouseUp,
        };
      } else {
        // See https://jsfiddle.net/c0Le92xe/ for example
        return null;
      }
    },
  },

  data() {
    return {
      // Overwrite `guiObj` in component!
      guiObj: {
        kind: null,
        tree: null,
        path: null,
      },
    };
  },

  methods: {
    mouseDown(e) {
      e.stopPropagation();
      if (this.mouse.state === MouseState.Idle) {
        this.mouse.state = MouseState.MaybeDragging;
        this.mouse.eventSource = this.guiObj;
      }
    },

    mouseMove(e) {
      e.stopPropagation();
      if (this.mouse.state === MouseState.MaybeDragging) {
        this.mouse.state = MouseState.Dragging;
      }
    },

    mouseUp(e) {
      e.stopPropagation();
      if (this.mouse.state === MouseState.MaybeDragging
          || this.guiObj.tree.is(this.mouse.eventSource.tree)
      ) {
        this.mouse.clickDetected();
      } else if (this.mouse.state === MouseState.Dragging) {
        this.mouse.state = MouseState.Idle;
        this.mouse.eventDest = this.guiObj;
        this.mouse.dragDetected();
      }
    },
  },
};
