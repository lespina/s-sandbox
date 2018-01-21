const shuffle = require('shuffle-array');
const Circle = require('./circle');
const Square = require('./square');
const Triangle = require('./triangle');
const Vector = require('./vector');
const Grid = require('./grid');
const _ = require('lodash');

const GRIDSIZE = 50;

class SandBox {
  constructor(xDim, yDim, numBodies, gravityOn, dampeningFactor = 0.99) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.dampeningFactor = dampeningFactor;
    this.gravity = gravityOn;
    this.nextId = 0;
    this.attractiveForce = () => new Vector([0, 0]);

    this.grid = new Grid(xDim / GRIDSIZE, yDim / GRIDSIZE, GRIDSIZE);

    for (let i=0; i<numBodies; i++) {
      const body = shuffle([Triangle, Circle, Square])[0].createRandom(xDim, yDim, null, null, 10);
      this.add(body);
    }
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
    body.id = this.nextId++;
    const pos = body.gridPos(GRIDSIZE);
    this.grid.add(body, pos);
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(0, 0, this.xDim, this.yDim);
    _.values(this.grid.collection()).forEach(circle => {
      circle.render(ctx);
    });
  }

  update() {
    const gravity = (this.gravity) ? new Vector([0, 2]) : new Vector([0, 0]);
    const bodies = this.grid.collection();

    for (let bodyId in bodies) {
      const body = bodies[bodyId];
      if (!body.inBounds(this.xDim, this.yDim)) {
        body.reverseOnBounds(this.xDim, this.yDim, this.dampeningFactor, this.grid);
      }
    }

    for (let bodyId in bodies) {
      const body = bodies[bodyId];
      const gridPos = body.gridPos(this.grid.gridSize);
      const adjSpace = this.grid.adjacentPositions(gridPos);

      adjSpace.forEach(pos => {
        const otherBodies = this.grid.get(pos);

        for (let otherBodyId in otherBodies) {
          const otherBody = otherBodies[otherBodyId];
          if (!body.cannotCollide && bodyId !== otherBodyId && body.intersectsWith(otherBody)) {
            delete bodies[otherBody];
            body.collide(otherBody, this.dampeningFactor);
            // body.dampen(this.dampeningFactor);
            // otherBody.dampen(this.dampeningFactor);
            //
            // body.rebound(otherBody);
            // body.angularRebound(otherBody);

            const extAcceleration = this.attractiveForce.call(otherBody).add(gravity);
            otherBody.update(extAcceleration, this.grid);
          }
        }
      }, this);

      const extAcceleration = this.attractiveForce.call(body).add(gravity);
      body.update(extAcceleration, this.grid);
    }
  }

  animateCallback(ctx) {
    console.log('framerate');
    this.update();
    this.render(ctx);
    requestAnimationFrame(this.animateCallback.bind(this, ctx));
  }
}

module.exports = SandBox;
