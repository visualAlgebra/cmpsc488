import * as M from "materialize-css";
import {Mouse, MouseMode} from "../gui";
import InsertButtons from "./InsertButtons";

export default {
  name: "CreatorSpecificActionButtons",

  props: {
    mouse: Mouse,
  },

  template: `
<div>
  <section>
    <form action="#">
      <div class="row">
        <div class="col s12">
          <ul class="tabs blue-grey waves-light">
            <li id="1" class="tab col s3 white-text active">
              <a class="white-text" @click="generalManipulation()">Transform</a>
            </li>
            <li id="2" class="tab col s3">
              <a class="white-text" @click="mergeLiterals()">Merge Atoms</a>
            </li>
            <li id="3" class="tab col s3">
              <a class="white-text" @click="distribution()">Distribute</a>
            </li>
            <li id="4" class="tab col s3">
              <a class="white-text" @click="insert()">Insert</a>
            </li>
          </ul>
        </div>
      </div>
    </form>
  </section>
  <InsertButtons
    v-if="inInsertMode"
    :mouse="mouse"
  ></InsertButtons>
</div>  
  `,

  data: () => ({
    // Needed because mutating `mouse.mode` doesn't trigger a Vue update.
    mouseMode: MouseMode.Manipulation,
  }),

  computed: {
    inInsertMode() {
      return this.mouseMode === MouseMode.Insertion;
    },
  },

  methods: {
    generalManipulation(){
      this.mouse.mode = MouseMode.Manipulation;
      this.mouseMode = MouseMode.Manipulation;
    },
    mergeLiterals(){
      this.mouse.mode = MouseMode.MergingLiterals;
      this.mouseMode = MouseMode.MergingLiterals;
    },
    distribution(){
      this.mouse.mode = MouseMode.Distribution;
      this.mouseMode = MouseMode.Distribution;
    },
    insert(){
      this.mouse.mode = MouseMode.Insertion;
      this.mouseMode = MouseMode.Insertion;
    },
  },

  mounted(){
    M.AutoInit();
    this.mouse.mode = MouseMode.Manipulation;
  },

  components: {
    InsertButtons
  },
};