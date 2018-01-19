const Circle = require('./circle');
const Square = require('./square');
const Vector = require('./vector');

class SandBox {
  constructor(xDim, yDim, numCircles, gravityOn, dampeningFactor = 0.999) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.dampeningFactor = dampeningFactor;
    if (gravityOn) {
      this.gravity = new Vector([0, 1]);
    }

    this.inView = {};
    for (let i=0; i<numCircles; i++) {
      const circle = Circle.createRandom(xDim, yDim);
      circle.id = i;
      this.inView[circle.id] = circle;
    }
    this.nextId = Object.keys(this.inView).length;
  }

  static start(xDim, yDim, numCircles, gravityOn) {
    const sandbox = new SandBox(xDim, yDim, numCircles, gravityOn);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    sandbox.animateCallback(ctx);
    return sandbox;
  }

  add(body) {
    this.inView[this.nextId++] = body;
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    Object.values(this.inView).forEach(circle => {
      circle.render(ctx);
    });
  }

  update(otherCircles) {
    for (let circleId in otherCircles) {
      const circle = otherCircles[circleId];

      for (let otherCircleId in otherCircles) {
        const otherCircle = otherCircles[otherCircleId];
        if (!circle.cannotCollide && circleId !== otherCircleId && circle.intersectsWith(otherCircle)) {
          delete otherCircles[otherCircle];
          circle.moveStep.dampen(this.dampeningFactor);
          otherCircle.moveStep.dampen(this.dampeningFactor);
          // circle.moveStep = circle.moveStep.multiply(new Vector([this.dampeningFactor, this.dampeningFactor]));
          // otherCircle.moveStep = otherCircle.moveStep.multiply(new Vector([this.dampeningFactor, this.dampeningFactor]));
          circle.rebound(otherCircle);
          otherCircle.update(this.gravity);
        }
      }
      circle.update(this.gravity);
    }

    for (let circleId in this.inView) {
      const circle = otherCircles[circleId];
      if (!circle.inBounds(this.xDim, this.yDim)) {
        circle.reverseOnBounds(this.xDim, this.yDim, this.dampeningFactor);
      }
    }


    // this.inView.forEach((circle, i) => {
    //   let newCircle;
    //   otherCircles.forEach((otherCircle, j) => {
    //     if (!circle.cannotCollide && i !== j && circle.intersectsWith(otherCircle)) {
    //       newCircle = Circle.copy(circle);
    //       // newCircle.moveStep = newCircle.moveStep.multiply(new Vector([this.dampeningFactor, this.dampeningFactor]));
    //       newCircle.rebound(otherCircle);
    //     }
    //   }, this);
    //
    //   let chosenCircle;
    //   if (newCircle) {
    //     chosenCircle = newCircle;
    //   } else {
    //     chosenCircle = circle;
    //   }
    //
    //   chosenCircle.update();
    //   if (chosenCircle.inBounds(this.xDim, this.yDim)) {
    //     newView.push(chosenCircle);
    //   } else {
    //     chosenCircle.reverse();
    //     newView.push(chosenCircle);
    //   }
    // }, this);
    //
    // this.inView = newView;
  }

  animateCallback(ctx) {
    this.update(Object.assign(this.inView));
    this.render(ctx);
    requestAnimationFrame(this.animateCallback.bind(this, ctx));
  }
}

module.exports = SandBox;
