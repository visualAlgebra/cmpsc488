import {mouse, MouseState} from "../../gui";

export default {

  props: {
    // Use this prop like so:
    //   <MyComponent interactive></MyComponent> --> interactive == true
    //   <MyComponent></MyComponent>             --> interactive == false
    interactive: Boolean,
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
      if (mouse.state !== MouseState.IdleAfterDrag) {
        mouse.eventSource = this.guiObj;
        mouse.clickDetected();
      }
    },

    startDrag(e) {
      e.stopPropagation();
      if (mouse.state === MouseState.Idle) {
        mouse.state = MouseState.MaybeDragging;
        mouse.eventSource = this.guiObj;
      }
    },

    doDrag(e) {
      e.stopPropagation();
      if (mouse.state === MouseState.MaybeDragging) {
        mouse.state = MouseState.Dragging;
      }
    },

    endDrag(e) {
      e.stopPropagation();
      if (mouse.state === MouseState.Dragging) {
        mouse.state = MouseState.IdleAfterDrag;
        mouse.eventDest = this.guiObj;
        mouse.dragDetected();
      }
    },
  },
};