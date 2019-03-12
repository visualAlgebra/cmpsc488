import {compress_string_js, Literal, Orientation, ProblemInfo, Tag, Variable} from "./expression_tree";

export function createRandomExpression(num_nodes){
    if(num_nodes===1){
        return _genRandomNode(false);
    }
    let retval=_genRandomNode(true);
    let rand=0;
    for(let x=1; x<num_nodes; x++){
        _pushDownNode(retval,_genRandomNode(false));
    }
    return retval;
}

export function createDummyProblem(num_nodes,num_nodes2){
    let retval=new ProblemInfo('RAND_'+Math.floor(Math.random()*1000000000));
    compress_string_js(createRandomExpression(num_nodes).toString(),res => {
      retval.expression_start=res;
    });
    compress_string_js(createRandomExpression(num_nodes2).toString(),res => {
      retval.expression_goal=res;
    });
    return retval;
}

//function _pushDownNode(tree,node){
//let length=tree.NW.length+tree.SE.length;
//    if(length===0){
//        _addRandomWay(tree,node);
//        return;
//    }
//    let tagcount=0;
//    for(let x=0; x<length; x++){
//        if(x<tree.NW.length){
//            if(tree.NW[x].kind==='tag'){
//                tagcount++;
//            }
//        }else{
//            if(tree.SE[x-tree.NW.length].kind==='tag'){
//                tagcount++;
//            }
//        }
//    }
//    let ratio=tagcount/length;
//    rand=Math.random();//0-0.999999

function _pushDownNode(tree,node){
    let rand=0;
    let added=false;
    rand=Math.floor(Math.random()*2);//0-1
    if(rand===0){
        if(tree.NW.length!==0){
            val=Math.floor(tree.NW.length*0.90);
            for(let x=0; x<val; x++) {
                rand=Math.floor(Math.random()*tree.NW.length);//0-length-1
                if(tree.NW[rand].kind==='tag'){
                    _pushDownNode(tree.NW[rand],node);
                    added=true;
                    break;
                }
            }
            if(added===false){
                _addRandomWay(tree,node);
            }
        }else{
            tree.addNorthWest(node);
        }
    }else{
        if(tree.SE.length!==0){
            val=Math.floor(tree.SE.length*0.90);
            for(let x=0; x<val; x++) {
                rand=Math.floor(Math.random()*tree.SE.length);//0-length-1
                if(tree.SE[rand].kind==='tag'){
                    _pushDownNode(tree.SE[rand],node);
                    added=true;
                    break;
                }
            }
            if(added===false){
                _addRandomWay(tree,node);
            }
        }else{
            tree.addSouthEast(node);
        }
    }
}

function _addRandomWay(tree,node){
    rand=Math.floor(Math.random()*2);//0-1
    if(rand===0){
        tree.addNorthWest(node);
    }else{
        tree.addSouthEast(node);
    }
}

function _genRandomNode(tag){
    let rand=Math.floor(Math.random()*3);//0-2
    if(rand===2||tag===true){
        rand=Math.floor(Math.random()*2);//0-1
        if(rand===0){
            return new Tag(Orientation.EW);
        }else{
            return new Tag(Orientation.NS);
        }
    } else if(rand===0){
        rand=Math.floor(Math.random()*3);//0-2
        return new Literal(rand);
    }else if(rand===1){
        rand=Math.floor(Math.random()*21);//0-20
        return new Variable(rand);
    }
}