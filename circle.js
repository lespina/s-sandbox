const Line = require('./line.js');
const Vector = require('./vector.js');
const Body = require('./body.js');
const Square = require('./square.js');

const RADIUS = 30;

class Circle extends Body {
  static createRandom(xDim, yDim, x, y, radius) {
    radius = radius || Math.random() * 50 + 10;
    return Body.createRandom.call(this, xDim, yDim, x, y, radius, radius);
  }

  static copy(circle) {
    return new Circle(
      circle.pos,
      circle.moveStep,
      circle.mass,
      circle.color,
      circle.radius
    );
  }

  constructor(startPos = [0, 0], startVel = [0, 0], mass = 1, color, radius = RADIUS) {

    super(startPos, startVel, mass, color, { radius });
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    const [x, y] = this.pos.toArr();

    ctx.arc(
      x,
      y,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();

    let orientation = new Vector(this.radius, this.orientation);
    for (let i=0; i<4; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "#000000";
      ctx.moveTo(x, y);
      const [orientX, orientY] = orientation.toArr();
      ctx.lineTo(x + orientX, y + orientY);
      ctx.stroke();
      orientation.rotate(Math.PI / 2);
    }
  }

  asLines(numLines = 8) {
    const [x, y] = this.pos.toArr();

    const lines = [];
    const angleIncrement = 2 * Math.PI / numLines;

    let point = [x, y + this.radius];
    let angle = angleIncrement;

    for (let i=0; i<numLines; i++) {
      const points = [point.slice(0)];
      const relativeVec = new Vector(this.radius, angle);
      const vec = this.pos.add(relativeVec);
      point = vec.toArr();
      angle += angleIncrement;
      points.push(point.slice(0));
      lines.push(new Line(...points));
    }

    return lines;
  }

  intersectsWith(otherBody) {
    let length;
    if (otherBody.constructor === Circle) {
      length = otherBody.radius;
    } else if (otherBody.constructor === Square) {
      length = otherBody.sideSize / 2;
    } else {
      return super.intersectsWith(otherBody);
    }

    const dist = this.pos.subtract(otherBody.pos).magnitude();
    return (dist < this.radius + length);
  }

    // let dist = this.pos.subtract(otherCircle.pos).magnitude();
    // while (dist < this.radius + otherCircle.radius) {
    //   this.update();
    //   otherCircle.update();
    //   dist = this.pos.subtract(otherCircle.pos).magnitude();
    // }

  reverseOnBounds(xDim, yDim, dampeningFactor) {
    const [x, y] = [this.pos.x(), this.pos.y()];
    if (x <= this.radius) {
      this.pos.nums[0] = this.radius;
      this.moveStep.reverseX();
    } else if (xDim <= x + this.radius) {
      this.pos.nums[0] = xDim - this.radius;
      this.moveStep.reverseX();
    }

    if (y <= this.radius) {
      this.pos.nums[1] = this.radius;
      this.moveStep.reverseY();
    } else if (yDim <= y + this.radius) {
      this.pos.nums[1] = yDim - this.radius;
      this.moveStep.reverseY();
    }

    this.moveStep = this.moveStep.multiply(new Vector([dampeningFactor, dampeningFactor]));
    if (Math.abs(this.moveStep.x()) < 0.1) {
      this.moveStep.nums[x] = 0;
    }
    if (Math.abs(this.moveStep.y()) < 0.1) {
      this.moveStep.nums[y] = 0;
    }
  }

}

module.exports = Circle;
