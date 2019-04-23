import {Mouse, MouseMode} from "../../gui";

export default {

  props: {
    // Use this prop like so:
    //   <MyComponent interactive></MyComponent> --> interactive == true
    //   <MyComponent></MyComponent>             --> interactive == false
    interactive: Boolean,
    insertable: Boolean,
    mouse: Mouse,
    pulse: {
      default: false,
      type: Boolean,
    },
  },

  computed: {
    listeners() {
      const fns = {};
      if (this.interactive) {
        fns.mousedown = e => {
          e.stopPropagation();
        };
        fns.mousemove = e => {
          e.stopPropagation();
        };
        fns.mouseup = e => {
          e.stopPropagation();
        };
        if (!this.pulse) {
          fns.click = this.mouseClicked;
        }
      }
      return fns;
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
    handleDragStart(_data, event) {
      event.stopPropagation();
      if (this.insertable) {
        this.mouse.mode = MouseMode.Insertion;
      }
    },

    handleDrop(data, event) {
      event.stopPropagation();
      this.mouse.eventSource = data;
      this.mouse.eventDest = this.guiObj;
      this.mouse.dragDetected();
    },

    mouseClicked(event) {
      event.stopPropagation();
      this.mouse.eventSource = this.guiObj;
      this.mouse.clickDetected();
    }
  },
};
