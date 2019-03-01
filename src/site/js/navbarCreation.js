function createNavbar(){
	let page=getPage();
	let nav=document.createElement("nav");

	let div=document.createElement("div");
	div.className="nav-wrapper";
	nav.appendChild(div);

	let a1=document.createElement("a");
	a1.href="http://localhost:8080/index.html";
	a1.className="brand-logo";
	a1.innerHTML="VisualAlgebra";
	div.appendChild(a1);

	let a2=document.createElement("a");
	a2.href="#";
	a2.className="sidenav-trigger";
	a2.setAttribute("data-target", "navbarSidenav");
	div.appendChild(a2);

	let i=document.createElement("i");
	i.className="material-icons";
	i.innerHTML="menu";
	a2.appendChild(i);

	let ul1=document.createElement("ul");
	ul1.className="right hide-on-med-and-down";
	ul1.id="nav-mobile";
	let li1=document.createElement("li");
	li1.innerHTML='<a href="http://localhost:8080/index.html">Home</a>';
	if(page==="index"){
		li1.className+="active ";
	}
	ul1.appendChild(li1);

	let li2=document.createElement("li");
	li2.innerHTML='<a href="http://localhost:8080/creator.html">Create</a>';
	if(page==="creator"){
		li2.className+="active ";
	}
	ul1.appendChild(li2);

	let li3=document.createElement("li");
	li3.innerHTML='<a href="http://localhost:8080/manipulator.html">Manipulate</a>';
	if(page==="manipulator"){
		li3.className+="active ";
	}
	ul1.appendChild(li3);

	let li4=document.createElement("li");
	li4.innerHTML='<a href="http://localhost:8080/Explorer.html">Explore</a>';
	if(page==="Explorer"){
		li4.className+="active ";
	}
	ul1.appendChild(li4);

	let li6=document.createElement("li");
	li6.innerHTML='<a href="http://localhost:8080/user_profile_page.html">User Profile</a>';
	if(page==="user_profile_page"){
		li6.className+="active ";
	}
	ul1.appendChild(li6);

	div.appendChild(ul1);

	let ul2=document.createElement("ul");
	ul2.className="sidenav";
	ul2.id="navbarSidenav";
	let nav2=document.createElement("nav");
	nav2.innerHTML='<div class="nav-wrapper"><a class="brand-logo" href="http://localhost:8080/index.html">VisualAlgebra</a></div>';

	ul2.appendChild(nav2);
	ul2.appendChild(li1.cloneNode(true));
	ul2.appendChild(li2.cloneNode(true));
	ul2.appendChild(li3.cloneNode(true));
	ul2.appendChild(li4.cloneNode(true));
	ul2.appendChild(li6.cloneNode(true));

	if(page==="manipulator"){//create nav buttons
		let manipdivrow=document.createElement("div");
		manipdivrow.className="row";

		//hint
		let manipli1a=document.createElement("a");
		manipli1a.className="tab waves-effect waves-light btn col";
		let manipli1ai=document.createElement("i");
		manipli1ai.className="material-icons left";
		manipli1ai.innerHTML="compare_arrows";
		manipli1a.appendChild(manipli1ai);

		manipli1a.innerHTML+="Hint";
		manipdivrow.appendChild(manipli1a);

		//share
		let manipli2a=document.createElement("a");
		manipli2a.className="tab waves-effect waves-light btn col";
		let manipli2ai=document.createElement("i");
		manipli2ai.className="material-icons left";
		manipli2ai.innerHTML="share";
		manipli2a.appendChild(manipli2ai);

		manipli2a.innerHTML+="Share";
		manipdivrow.appendChild(manipli2a);

		//restart
		let manipli3a=document.createElement("a");
		manipli3a.className="tab waves-effect waves-light btn col";
		let manipli3ai=document.createElement("i");
		manipli3ai.className="material-icons left";
		manipli3ai.innerHTML="rotate_left";
		manipli3a.appendChild(manipli3ai);

		manipli3a.innerHTML+="Restart";
		manipdivrow.appendChild(manipli3a);

		//undo
		let manipli4a=document.createElement("a");
		manipli4a.className="tab waves-effect waves-light btn col";
		manipli4a.onclick="histAction(0)";
		let manipli4ai=document.createElement("i");
		manipli4ai.className="material-icons left";
		manipli4ai.innerHTML="undo";
		manipli4a.appendChild(manipli4ai);

		manipli4a.innerHTML+="Undo";
		manipdivrow.appendChild(manipli4a);

		//redo
		let manipli5a=document.createElement("a");
		manipli5a.className="tab waves-effect waves-light btn col";
		manipli5a.onclick="histAction(1)";
		let manipli5ai=document.createElement("i");
		manipli5ai.className="material-icons left";
		manipli5ai.innerHTML="redo";
		manipli5a.appendChild(manipli5ai);

		manipli5a.innerHTML+="Redo";
		manipdivrow.appendChild(manipli5a);

		return [nav, ul2, manipdivrow];
	}
	return [nav, ul2];
}
function initNav(){
	let maindiv=document.getElementById("navbarLocation");
	let ret=createNavbar();
	if(ret.length===3){
		maindiv.prepend(ret[2]);
	}
	maindiv.prepend(ret[1]);
	maindiv.prepend(ret[0]);
}
function getPage() {
  let one=(window.location.href).substr((window.location.href).indexOf("8080")+5);
  let str="";
  for (let x=0; x<one.length; x++){
  	let char=one.charAt(x);
  	if(char==='.'||char==='/'){
  		break;
  	}
  	str+=char;
  }
  return str;
}
initNav();
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});