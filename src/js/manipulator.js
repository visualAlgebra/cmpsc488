let canvasContainer;
let cloudImg;

function preload() {
  cloudImg = loadImage('assets/example_image.png');
}

function setup() {
  canvasContainer = select('#canvas-container');
  canvas = createCanvas(700, 500);
  canvas.parent(canvasContainer);
  background(51);

  cloudImg.resize(300, 250);
}

function draw() {
  fill(255);
  imageMode(CENTER);
  image(cloudImg, width/2, height/2);
}
