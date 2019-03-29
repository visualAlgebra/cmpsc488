export default {
  name: "CreatorNavigationButtons", template: `
  <div>
    <div class="row">
      <a class="tab waves-effect waves-light btn col" v-on:click="save()" v-if="stage==='build'">
          <i class="material-icons left">compare_arrows</i>
          Save
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="load()">
          <i class="material-icons left">share</i>
          Load
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="clear()">
          <i class="material-icons left">rotate_left</i>
          Clear
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="undo()">
          <i class="material-icons left">undo</i>
          Undo
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="redo()">
          <i class="material-icons left">redo</i>
          Redo
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav">
          <i class="material-icons left">subdirectory_arrow_right</i>
          History tree
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="generate()">
          <i class="material-icons left">subdirectory_arrow_right</i>
          Generate expression
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="stageChange()">
          <i class="material-icons left">subdirectory_arrow_right</i>
          Build goal
      </a>
    </div>
  </div>  
  `, data(){
    return {
    };
  }, methods: {
    save(){
      console.log('blah')
    }
  },
};