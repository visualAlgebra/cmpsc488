document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});
window.onload = () => {
    getInitialProblemsToDisplay();
};

function getInitialProblemsToDisplay(){
    get_problems_from_db(4,res=>displayProblems(res));
}
function displayProblems(query){
    console.log(query);
    console.log(query.queryResults);
}
//<div class="col s12 m6 l4">
//                <div class="card blue-grey darken-1">
//                    <div class="card-content white-text">
//                        <span class="card-title">
//                            <i class="material-icons left">folder</i>
//                            Lesson 1
//                        </span>
//                        <div class="row">
//                            <div class="col">
//                                <li>Problem 1
//    								<div name="problem_holder" id="l1p1"></div>
//                                </li>
//                            </div>
//                            <div class="col">
//                                <li>Problem 1 Goal
//    								<div name="problem_holder" id="l1p1g"></div>
//                                </li>
//                            </div>
//                        </div>
//                    </div>
//                </div>
//    		</div>
//            <div class="col s12 m6 l4">
//                <div class="card blue-grey darken-1">
//                    <div class="card-content white-text">
//                        <span class="card-title">
//                            <i class="material-icons left">folder</i>
//                            Lesson 2
//                        </span>
//                        <div class="row">
//                            <div class="col">
//                                <li>Problem 1
//    								<div name="problem_holder" id="l2p1"></div>
//                                </li>
//                            </div>
//                            <div class="col">
//                                <li>Problem 1 Goal
//    								<div name="problem_holder" id="l2p1g"></div>
//                                </li>
//                            </div>
//                        </div>
//                    </div>
//                </div>
//            </div>