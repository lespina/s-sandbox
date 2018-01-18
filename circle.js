const Line = require('./line.js');
const Vector = require('./vector.js');

const RADIUS = 30;
const HEX_DIGITS = "0123456789ABCDEF";

class Circle {
  static createRandom() {
    return new Circle(
      Vector.random([1000, 1000]),
      Vector.random([15, 15], true),
      1,
      Circle.randomColor()
    );
  }

  static randomColor() {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += HEX_DIGITS[Math.floor((Math.random() * 16))];
    }

    return color;
  }

  static copy(circle) {
    return new Circle(
      circle.pos,
      circle.moveStep,
      circle.mass,
      circle.color
    );
  }

  // positions are represented as [x, y] tuples corresponding to
  //  ----------> +x
  // |
  // |
  // |
  // v
  // +y

  constructor(startPos = [0, 0], startVel = [0, 0], mass = 1, color = COLOR) {
    this.color = color;
    //starting this at a constant value
    this.radius = RADIUS;
    //corresponds to center point of circle

    if (startPos.constructor === Vector) {
      this.pos = startPos;
    } else {
      this.pos = new Vector(startPos);
    }

    if (startVel.constructor === Vector) {
      this.moveStep = startVel;
    } else {
      this.moveStep = new Vector(startVel);
    }

    this.mass = mass;
  }

  allowCollision() {
    this.cannotCollide = false;
  }

  update() {
    this.pos = this.pos.add(this.moveStep);
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    const [x, y] = this.pos.to_a();

    ctx.arc(
      x,
      y,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  inBounds(xDim, yDim) {
    const [x, y] = this.pos.to_a();

    const top = [x, y + this.radius];
    const bottom = [x, y - this.radius];
    const right = [x + this.radius, y];
    const left = [x - this.radius, y];

    let answer = false;

    [top, bottom, left, right].forEach(pos => {
      const [x, y] = pos;

      if (
        0 <= x && x <= xDim &&
        0 <= y && y <= yDim
      ) { answer = true; }
    });

    return answer;
  }

  asLines(numLines = 8) {
    const [x, y] = this.pos.to_a();

    const lines = [];
    const angleIncrement = 2 * Math.PI / numLines;

    let point = [x, y + this.radius];
    let angle = angleIncrement;

    for (let i=0; i<numLines; i++) {
      const points = [point.slice(0)];
      const relativeVec = new Vector(this.radius, angle);
      const vec = this.pos.add(relativeVec);
      point = vec.to_a();
      angle += angleIncrement;
      points.push(point.slice(0));
      lines.push(new Line(...points));
    }

    return lines;
  }

  intersectsWith(otherCircle) {
    const thisLines = this.asLines();
    const otherLines = otherCircle.asLines();
    for (let i=0; i<thisLines.length; i++) {
      for (let j=0; j<otherLines.length; j++) {
        if (thisLines[i].intersectsWith(otherLines[j])) {
          return true;
        }
      }
    }

    return false;
  }

  rebound(otherCircle) {
    const totalMomentumX = this.momentumX() + otherCircle.momentumX();
    const totalMomentumY = this.momentumY() + otherCircle.momentumY();

    let randNumX;
    let randNumY;
    if (this.randNumX) {
      randNumX = this.randNumX;
      randNumY = this.randNumY;
      delete this.randNumX;
      delete this.randNumY;
    } else {
      randNumX = Math.random();
      randNumY = Math.random();
      otherCircle.randNumX = randNumX;
      otherCircle.randNumY = randNumY;
    }

    const newMomentumX = randNumX * totalMomentumX;
    const newMomentumY = randNumY * totalMomentumY;

    let newMoveStepX = newMomentumX / this.mass;
    let newMoveStepY = newMomentumY / this.mass;

    if (this.moveStep.x() > 0) {
      newMoveStepX = -newMoveStepX;
    }

    if (this.moveStep.y() > 0) {
      newMoveStepY = -newMoveStepY;
    }

    this.moveStep = new Vector([
      newMoveStepX,
      newMoveStepY
    ]);

    this.cannotCollide = true;
    window.setTimeout(this.allowCollision.bind(this), 150);
  }

  momentumX() {
    return Math.abs(this.moveStep.x() * this.mass);
  }

  momentumY() {
    return Math.abs(this.moveStep.y() * this.mass);
  }

}

module.exports = Circle;
