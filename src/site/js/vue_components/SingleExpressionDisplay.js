import {singleExpressionDecompression} from "../display_feature";
import {Deserialize} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";

export default {
  name: "SingleExpressionDisplay", props: ["tree", "hoverable"], template: `
  <div>
    <ExpressionTree v-if="updatedWorkingExpressionTree"
    :tree="workingExpressionTree"
    :hoverable="false"></ExpressionTree>
  </div>  
  `, data(){
    return {
      workingExpressionTree:null,
      loaded:false,
    };
  },mounted(){
    singleExpressionDecompression(this.tree, res=>{
      console.log(res);
      this.workingExpressionTree=Deserialize(res);
      this.loaded=true;
    });
  }, computed:{
    updatedWorkingExpressionTree: function() {
      if(this.loaded === true){
        console.log("Loaded: "+this.workingExpressionTree.toString());
        return true;
      }
      return false;
    },
  }, components: {
    ExpressionTree,
  },
};