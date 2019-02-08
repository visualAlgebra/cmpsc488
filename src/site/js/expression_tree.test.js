const expression_tree = require("./expression_tree");

test("Tests that Variable can be constructed", () => {
    const x = new expression_tree.Variable(1); // Currently broken!
});

test("adds 1 and 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
});