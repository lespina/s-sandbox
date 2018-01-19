const Line = require('./line.js');
const Vector = require('./vector.js');
const Body = require('./body.js');

const SIDESIZE = 30;

class Square extends Body {
  static createRandom(xDim, yDim, x, y, sideSize) {
    sideSize = sideSize || Math.random() * 50 + 10;
    return Body.createRandom.call(this, xDim, yDim, x, y, sideSize);
  }

  static copy(square) {
    return new Square(
      square.pos,
      square.moveStep,
      square.mass,
      square.color,
      square.sideSize
    );
  }

  constructor(startPos = [0, 0], startVel = [0, 0], mass = 1, color, sideSize = SIDESIZE) {
    super(startPos, startVel, mass, color, { sideSize });
  }

  render(ctx) {
    const size = this.sideSize;
    const [x, y] = this.pos.to_a();
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }

  asLines() {
    const size = this.sideSize;
    const [x, y] = this.pos.to_a();
    const topLeft = [x - size / 2, y - size / 2];
    const topRight = [x + size / 2, y - size / 2];
    const bottomLeft = [x - size / 2, y + size / 2];
    const bottomRight = [x + size / 2, y + size / 2];

    const lines = [
      new Line(topLeft, topRight),
      new Line(topRight, bottomRight),
      new Line(bottomRight, bottomLeft),
      new Line(bottomLeft, topLeft)
    ];
    
    return lines;
  }
}

module.exports = Square;
