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
          click: this.onclick,
          mousedown: this.startDrag,
          mousemove: this.doDrag,
          mouseup: this.endDrag,
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
      },
    };
  },

  methods: {
    onclick(e) {
      e.stopPropagation();
      if (this.mouse.state !== MouseState.IdleAfterDrag) {
        this.mouse.eventSource = this.guiObj;
        this.mouse.clickDetected();
      }
    },

    startDrag(e) {
      e.stopPropagation();
      if (this.mouse.state === MouseState.Idle) {
        this.mouse.state = MouseState.MaybeDragging;
        this.mouse.eventSource = this.guiObj;
      }
    },

    doDrag(e) {
      e.stopPropagation();
      if (this.mouse.state === MouseState.MaybeDragging) {
        this.mouse.state = MouseState.Dragging;
      }
    },

    endDrag(e) {
      e.stopPropagation();
      if (this.mouse.state === MouseState.Dragging) {
        this.mouse.state = MouseState.IdleAfterDrag;
        this.mouse.eventDest = this.guiObj;
        this.mouse.dragDetected();
      }
    },
  },
};