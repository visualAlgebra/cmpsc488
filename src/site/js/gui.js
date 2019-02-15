const mouse = {
    state: "idle",
    eventSource: null,
    eventDest: null,
};

const TagGuiModule = {

    onclick: function(div) {
        console.log("CLICK!", div);
    },

    mousedown: function(div) {
        if (mouse.state === "idle") {
            mouse.state = "dragging";
            mouse.eventSource = div;
        }
    },

    mouseup: function(div) {
        if (mouse.state === "dragging") {
            mouse.state = "idle";
            mouse.eventDest = div;
            this.mouseDragDetected(div); // Copy all the targets
        }
    },

    mouseDragDetected: function(div) {
        console.log("Mouse dragged from", mouse.eventSource, "to", mouse.eventDest);
    },

    render: function(tag) {
        const div = $("<div>")

        div.on("click", e => {
            e.stopPropagation();
            this.onclick(div)
        });

        div.on("mousedown", e => {
            e.stopPropagation();
            this.mousedown(div);
        })

        div.on("mouseup", e => {
            e.stopPropagation();
            this.mouseup(div);
        })

        div.addClass(
            (tag.orientation == Orientation.NS)
            ? "north-south"
            : "east-west"
        );

        div.addClass("tag");
        div.data("expressionTree", tag);

        const nw = $("<div>")
        nw.addClass("north-west");

        const button = $("<div>");
        button.addClass("tag-button");

        const buttonColumn = $("<div>");
        buttonColumn.addClass("tag-button-column");
        buttonColumn.append(button);

        const se = $("<div>");
        se.addClass("south-east");

        function appendTo(element, child) {
            if (child.kind === "tag") {
                element.append(child.render());
            } else {
                const container = $("<div>");
                container.addClass("tag-element-container");
                container.append(child.render());
                element.append(container);
            }
        }

        tag.NW.forEach(child => {
            appendTo(nw, child);
        });

        tag.SE.forEach(child => {
            appendTo(se, child);
        });

        div.append(nw);
        div.append(buttonColumn);
        div.append(se);
        return div;
    }
};

const VariableGuiModule = {

    onclick: function(div) {
        console.log("CLICK!", div);
    },

    render: function(variable) {
        const div = $(`<div>x${variable.value}</div>`);

        div.on("click", e => {
            e.stopPropagation();
            this.onclick(div);
        });

        div.addClass("variable");
        div.data("expressionTree", variable);
        return div;
    }
};

const LiteralGuiModule = {

    onclick: function(div) {
        console.log("CLICK!", div);
    },

    render: function(literal) {
        const div = $(`<div>${literal.value}</div>`);

        div.on("click", e => {
            e.stopPropagation();
            this.onclick(div);
        });
        
        div.addClass("literal");
        div.data("expressionTree", literal);
        return div;
    }
};