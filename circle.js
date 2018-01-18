const Line = require('./line.js');
const Vector = require('./vector.js');

// const RADIUS = 30;
const HEX_DIGITS = "0123456789ABCDEF";

class Circle {
  static createRandom() {
    const randDensity = 1;

    return new Circle(
      Vector.random([1000, 1000]),
      Vector.random([15, 15], true),
      randDensity * 10,
      Circle.randomColor(),
      29 + randDensity
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
      circle.color,
      circle.radius
    );
  }

  // positions are represented as [x, y] tuples corresponding to
  //  ----------> +x
  // |
  // |
  // |
  // v
  // +y

  constructor(startPos = [0, 0], startVel = [0, 0], mass = 1, color = COLOR, radius = RADIUS) {
    this.color = color;
    //starting this at a constant value
    this.radius = radius;
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

    const [dx, dy] = this.moveStep.nums;

    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(x + 10*dx, y + 10*dy);
    // ctx.strokeStyle = '#FF0000';
    // ctx.stroke();
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

  chooseV1fx(otherCircle) {
    const randNum = Math.random();
    const newVel = Math.abs(randNum > 0.5) ? this.x() * randNum : this.x() * (1 + randNum);

    const thisMomentum = this.mass * this.x();
    const otherMomentum = otherCircle.mass * otherCircle.x();
    const totalMomentum = thisMomentum + otherMomentum;

    let posOrNeg = ((totalMomentum > 0) ? 1 : -1);

    if (this.mass > otherCircle.mass) {
      return newVel * posOrNeg;
    } else {
      return newVel * -posOrNeg;
    }
  }

  rebound(otherCircle) {
    //CONSTANTS:
    const v10x = this.x();
    const v10y = this.y();
    const v20x = otherCircle.x();
    const v20y = otherCircle.y();

    const initMagSq1 = Math.pow(v10x, 2) + Math.pow(v10y, 2);
    const initMagSq2 = Math.pow(v20x, 2) + Math.pow(v20y, 2);

    const m1 = this.mass;
    const m2 = otherCircle.mass;
    const u1 = m1 / m2;
    const u2 = m2 / m1;

    //CHOOSING RANDOM VALUE FOR: x component of final velocity of this particle
    const v1fx = this.chooseV1fx(otherCircle);

    const v2fx = u1 * v10x + v20x - u1 * v1fx;

    const a = 1 + u1;
    const b = -2 * (u1 * v10y + v20y);
    const c = u2 * Math.pow((u1 * v10y + v20y), 2) - (
        initMagSq1 + u2 * initMagSq2 - Math.pow(v1fx, 2) - u2 * Math.pow(v2fx, 2)
      );

    const sqrtDiscriminant = Math.sqrt(Math.abs(b*b - 4*a*c));
    const varTerm = ((Math.random() > 0.5) ? sqrtDiscriminant : -sqrtDiscriminant);
    const v1fy = (-b + varTerm) / (2*a);

    const v2fy = u1 * v10y + v20y - u1 * v1fy;

    const initMomentumX = m1 * v10x + m2 * v20x;
    const finalMomentumX = m1 * v1fx + m2 * v2fx;

    const initMomentumY = m1 * v10y + m2 * v20y;
    const finalMomentumY = m1 * v1fy + m2 * v2fy;

    const initEnergy = m1 * (v10x * v10x + v10y * v10y) + m2 * (v20x * v20x + v20y * v20y);
    const finalEnergy = m1 * (v1fx * v1fx + v1fy * v1fy) + m2 * (v2fx * v2fx + v2fy * v2fy);

    if (Math.abs(finalEnergy - initEnergy) < 0.00001) {
      this.moveStep = new Vector([v1fx, v1fy]);
      otherCircle.moveStep = new Vector([v2fx, v2fy]);
      this.cannotCollide = true;
      window.setTimeout(this.allowCollision.bind(this), 150);
    }

  }

  x() {
    return this.moveStep.x();
  }

  y() {
    return this.moveStep.y();
  }

  momentum() {
    return this.moveStep.magnitude() * this.mass;
  }

  momentumX() {
    return Math.abs(this.moveStep.x() * this.mass);
  }

  momentumY() {
    return Math.abs(this.moveStep.y() * this.mass);
  }

  reverse() {
    this.moveStep.reverse();
  }

  reverseOnBounds(xDim, yDim) {
    const [x, y] = [this.pos.x(), this.pos.y()];
    if (x <= 0 || xDim <= x) {
      this.moveStep.reverseX();
    }

    if (y <= 0 || yDim <= y) {
      this.moveStep.reverseY();
    }
  }

  angle() {
    return this.moveStep.angle();
  }

  rotate(angle) {
    this.moveStep.rotate(angle);
  }
}

module.exports = Circle;
