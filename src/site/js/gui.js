function renderTag(tag) {
    const div = document.createElement("div");

    
    const cssClass = (tag.orientation == Orientation.NS)
        ? "north-south"
        : "east-west";

    div.classList.add(cssClass);

    div.classList.add("tag");
    div["expressionTree"] = tag;

    const nw = document.createElement("div");
    nw.className = "north-west";

    const button = document.createElement("div");
    button.className = "tag-button";

    const se = document.createElement("div");
    se.className = "south-east";

    tag.NW.forEach(child => {
      nw.appendChild(child.render());
    });

    tag.SE.forEach(child => {
      se.appendChild(child.render());
    });

    div.appendChild(nw);
    div.appendChild(button);
    div.appendChild(se);
    return div;
}

function renderVariable(variable) {
    const div = document.createElement("div");
    div.textContent = `x${variable.value}`;
    div.className = "variable";
    div["expressionTree"] = variable;
    return div;
}

function renderLiteral(literal) {
    const div = document.createElement("div");
    div.textContent = literal.value;
    div.classList.add("literal");
    div["expressionTree"] = literal;
    return div;
}