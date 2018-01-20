const shuffle = require('shuffle-array');
const Circle = require('./circle');
const Square = require('./square');
const Vector = require('./vector');

class SandBox {
  constructor(xDim, yDim, numBodies, gravityOn, dampeningFactor = 0.98) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.dampeningFactor = dampeningFactor;
    this.gravity = gravityOn;
    // if (gravityOn) {
    //   this.gravity = new Vector([0, 1]);
    //   window.setInterval(this.rotateGravity.call(this), 5000);
    // }
    this.attractiveForce = () => new Vector([0, 0]);
    this.inView = {};
    for (let i=0; i<numBodies; i++) {
      const body = shuffle([Circle, Square])[0].createRandom(xDim, yDim);
      body.id = i;
      this.inView[body.id] = body;
    }
    this.nextId = Object.keys(this.inView).length;
  }

  setAttractor(e) {
    const mousePos = new Vector([e.x, e.y]);
    this.attractiveForce = function() {
      const attractiveForce = mousePos.subtract(this.pos);
      const mag = attractiveForce.magnitude();
      attractiveForce.dampen(1/mag);
      return attractiveForce;
    };
  }

  toggleGravity() {
    this.gravity = !this.gravity;
  }

  removeForces() {
    this.gravity = false;
    this.attractiveForce = () => new Vector([0, 0]);
  }

  rotateGravity() {
    const forces = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    return () => {
      forces.unshift(forces.pop());
      this.gravity = new Vector(forces[0]);
    };
  }

  static start(xDim, yDim, numCircles, gravityOn) {
    const sandbox = new SandBox(xDim, yDim, numCircles, gravityOn);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    sandbox.animateCallback(ctx);
    return sandbox;
  }

  add(body) {
    body.id = this.nextId;
    this.inView[this.nextId++] = body;
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(0, 0, this.xDim, this.yDim);
    Object.values(this.inView).forEach(circle => {
      circle.render(ctx);
    });
  }

  update(otherBodies) {
    const gravity = (this.gravity) ? new Vector([0, 1]) : new Vector([0, 0]);

    for (let bodyId in this.inView) {
      const body = otherBodies[bodyId];
      if (!body.inBounds(this.xDim, this.yDim)) {
        body.reverseOnBounds(this.xDim, this.yDim, this.dampeningFactor);
      }
    }

    for (let bodyId in otherBodies) {
      const body = otherBodies[bodyId];

      for (let otherBodyId in otherBodies) {
        const otherBody = otherBodies[otherBodyId];
        if (!body.cannotCollide && bodyId !== otherBodyId && body.intersectsWith(otherBody)) {
          delete otherBodies[otherBody];
          body.moveStep.dampen(this.dampeningFactor);
          body.orientMoveStep *= this.dampeningFactor;
          otherBody.moveStep.dampen(this.dampeningFactor);
          otherBody.orientMoveStep *= this.dampeningFactor;

          body.rebound(otherBody);
          body.angularRebound(otherBody);
          otherBody.update(this.attractiveForce.call(otherBody).add(gravity));
        }
      }
      body.update(this.attractiveForce.call(body).add(gravity));
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
