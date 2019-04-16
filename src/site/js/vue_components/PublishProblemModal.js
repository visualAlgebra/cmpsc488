import * as M from "materialize-css";
import {post_problem_from_site} from "../database_management";
import {compress_string_js, ProblemInfo} from "../expression_tree";

export default {
  name: "PublishProblemModal", props: ["closeFinish", "createdProblem"], template: `
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
      }
      let prob=new ProblemInfo(this.problemID);
      compress_string_js(this.createdProblem[0], (res)=>{
        prob.expression_start=res;
        compress_string_js(this.createdProblem[1], (res2)=>{
          prob.expression_goal=res2;
          prob.description=this.description;
          post_problem_from_site(prob, this.actuallyClose);
        });
      });
    }, actuallyClose(res){
      if(!res){
        this.tryCloseFinish();
      }
      alert("Successfully added.");
      this.closeFinish();
    }, checkIfNameAlreadyInUse(name){//TODO try to get boolean from database to tell if this name already in use.
      return false;
    }
  }, mounted() {
    M.AutoInit();
  },
};
