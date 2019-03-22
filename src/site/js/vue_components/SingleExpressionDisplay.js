import {singleExpressionDecompression} from "../display_feature";
import {Deserialize} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";

export default {
  name: "SingleExpressionDisplay",
  props: {
    tree: Array,
    interactive: Boolean
  },
  template: `
  <div
    xmlns="http://www.w3.org/1999/xhtml"
  >
    <ExpressionTree
      v-if="displayPage"
      :tree="workingExpressionTree"
    ></ExpressionTree>
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