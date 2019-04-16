import {Mouse, MouseMode} from "../../gui";

export default {

  props: {
    // Use this prop like so:
    //   <MyComponent interactive></MyComponent> --> interactive == true
    //   <MyComponent></MyComponent>             --> interactive == false
    interactive: Boolean,
    insertable: Boolean,
    mouse: Mouse,
  },

  computed: {
    listeners() {
      if (this.interactive) {
        return {
          mousedown: e => { e.stopPropagation(); },
          mousemove: e => { e.stopPropagation(); },
          mouseup: e => { e.stopPropagation(); },
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
  },
};
