import {singleExpressionDecompression} from "../display_feature";
import {Deserialize} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";

export default {
  name: "SingleExpressionDisplay", props: ["tree", "hoverable"], template: `
  <div>
    <ExpressionTree v-if="displayPage"
    :tree="workingExpressionTree"
    :hoverable="false"></ExpressionTree>
  </div>  
  `, data(){
    return {
      workingExpressionTree: null, display: false,
    };
  }, mounted(){
    singleExpressionDecompression(this.tree, res=>{
      this.workingExpressionTree=Deserialize(res);
      this.display=true;
    });
  }, computed: {
    displayPage: function(){
      if(this.display===true){
        return true;
      }
      return false;
    },
  }, components: {
    ExpressionTree,
  },
};