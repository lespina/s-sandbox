const Circle = require('./circle');
const Vector = require('./vector');

class SandBox {
  constructor(xDim, yDim, numCircles, dampeningFactor = 0.95) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.dampeningFactor = dampeningFactor;

    this.inView = [];
    for (let i=0; i<numCircles; i++) {
      const circle = Circle.createRandom();
      this.inView.push(circle);
    }

  }

  static start(xDim, yDim, numCircles) {
    const sandbox = new SandBox(xDim, yDim, numCircles);
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
    this.inView.forEach((circle, i) => {
      let newCircle;
      otherCircles.forEach((otherCircle, j) => {
        if (!circle.cannotCollide && i !== j && circle.intersectsWith(otherCircle)) {
          newCircle = Circle.copy(circle);
          newCircle.moveStep = newCircle.moveStep.multiply(new Vector([this.dampeningFactor, this.dampeningFactor]));
          newCircle.rebound(otherCircle);
        }
      }, this);

      let chosenCircle;
      if (newCircle) {
        chosenCircle = newCircle;
      } else {
        chosenCircle = circle;
      }

      chosenCircle.update();
      if (chosenCircle.inBounds(this.xDim, this.yDim)) {
        newView.push(chosenCircle);
      } else {
        chosenCircle.reverse();
        newView.push(chosenCircle);
      }
    }, this);

    this.inView = newView;
  }

  animateCallback(ctx) {
    this.update(this.inView);
    this.render(ctx);
    requestAnimationFrame(this.animateCallback.bind(this, ctx));
  }
}

module.exports = SandBox;
