function sketch(p) {
  let cloudImg;

  p.preload = () => {
    cloudImg = p.loadImage('assets/example_image.png');
  }

  p.setup = () => {
    p.createCanvas(700, 500);
    p.background(51);

    cloudImg.resize(300, 250);
  }

  p.draw = () => {
    p.fill(255);
    p.imageMode(p.CENTER);
    p.image(cloudImg, p.width/2, p.height/2);
  }
}

let p5Sketch = new p5(sketch, 'canvas-container');