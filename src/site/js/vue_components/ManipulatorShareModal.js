export default {
  name: "ManipulatorShareModal", template: `
    <div id="shareModal" class="modal">
      <div class="modal-content">
        <h4 class="black-text">Share this problem!</h4>
        <div class="input-field">
          <input id="text" readonly="readonly" v-model="input" type="text" class="validate">
          <a class="tab waves-effect waves-light btn" v-on:click="copy()">
            <i class="material-icons left">blur_on</i>
            <span class="truncate">Copy Link</span>
          </a>
        </div>
      </div>
    </div>
  `, data() {
    return {
      input: "",
    }
  }, methods: {
    copy() {
      var copyText = document.getElementById("text");
      copyText.select();
      document.execCommand("Copy");
    }
  }, mounted() {
    M.AutoInit();
    this.input = window.location.href;
  },
};
