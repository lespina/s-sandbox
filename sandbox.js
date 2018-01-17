const Circle = require('./circle');

class SandBox {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;

    this.circles = [];
    for (let i=0; i<10; i++) {
      this.circles.push(Circle.createRandom());
    }

  }

  static start(xDim, yDim) {
    const sandbox = new SandBox(xDim, yDim);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    sandbox.animateCallback(ctx);
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    this.circles.forEach(circle => {
      circle.render(ctx);
    });
  }

  update() {
    this.circles.forEach(circle => {
      circle.update();
    });
  }

  animateCallback(ctx) {
    this.update();
    this.render(ctx);
    requestAnimationFrame(this.animateCallback.bind(this, ctx));
  }
}

module.exports = SandBox;
