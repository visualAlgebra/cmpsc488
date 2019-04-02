export default {
  name: "CreatorNavigationButtons",
  props: [
    "goToNextStage",
    "stage",
    "clearTree",
  ],
  template: `
  <div>
    <div class="row">
      <a class="tab waves-effect waves-light btn col" v-on:click="save()" v-if="stage==='build'">
          <i class="material-icons left">file_upload</i>
          Save
      </a>
      <a v-bind:href="url" class="tab waves-effect waves-light btn col" v-on:click="load()">
          <i class="material-icons left">file_download</i>
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
          <i class="material-icons left">sort</i>
          History tree
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="generate()">
          <i class="material-icons left">create</i>
          Generate expression
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="goToNextStage()" v-if="stage==='build'">
          <i class="material-icons left">play_arrow</i>
          Build goal
      </a>
    </div>
  </div>  
  `,
  data: () => ({
    url:"http://localhost:8080/profile/accounts/"+"TEST_USER_0",
  }),
  methods: {
    save(){

    },load(){

    }, clear(){
      this.clearTree();
    }, undo(){

    }, redo(){

    }, generate(){

    }
  },
};
