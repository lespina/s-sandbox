const Circle = require('./circle');

class SandBox {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;

    this.inView = [];
    for (let i=0; i<100; i++) {
      const circle = Circle.createRandom();
      this.inView.push(circle);
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
    this.inView.forEach(circle => {
      circle.render(ctx);
    });
  }

  update(otherCircles) {
    const newView = [];
    this.inView.forEach(circle => {
      circle.update();
      if (circle.inBounds(this.xDim, this.yDim)) {
        newView.push(circle);
      }
    }, this);

    this.inView = newView;
  }

  animateCallback(ctx) {
    this.update();
    this.render(ctx);
    requestAnimationFrame(this.animateCallback.bind(this, ctx));
  }
}

module.exports = SandBox;
