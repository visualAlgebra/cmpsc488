import * as M from "materialize-css";

export default {
  name: "CreateProblemModal", props: ["closeFinish"], template: `
    <div id="finishProblemModal" class="modal">
      <div class="modal-content">
        <h4 class="black-text">Finish making problem:</h4>
        <label>Type a name for your problem:</label>
        <input v-model="problemID" placeholder="edit me">
        <label>Type a description for your problem:</label>
        <input v-model="description" placeholder="edit me">
      </div>
      <div class="modal-footer">
        <a class="modal-close waves-effect waves-green btn-flat" v-on:click="tryCloseFinish">Finish</a>
      </div>
    </div>
  `,  data(){
    return {
      description:"", problemID:"",
    };
  }, methods: {
    tryCloseFinish(){
      if(this.description.length>=1000){
        alert("Description field has too many characters, Please shorten to below 1000 characters.");
        return;
      }
      if(this.problemID.length>=50){
        alert("Name field has too many characters, Please shorten to below 50 characters.");
        return;
      }else if(this.problemID.length<=2){
        alert("Name field requires more characters");
        return;
      }else if(this.checkIfNameAlreadyInUse(this.problemID)){//TODO because this will require an async call, we will require async handler here
        alert("Name is already being used by another problem, please select another");
        return;
      }
      this.closeFinish();
    }, checkIfNameAlreadyInUse(name){//TODO try to get boolean from database to tell if this name already in use.
      return false;
    }
  }, mounted() {
    M.AutoInit();
  },
};
