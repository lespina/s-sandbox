const Line = require('./line.js');
const Vector = require('./vector.js');
const Body = require('./body.js');
const Circle = require('./circle.js');

const SIDESIZE = 30;

class Square extends Body {
  static createRandom(xDim, yDim, x, y, sideSize) {
    sideSize = 50 || Math.random() * 50 + 10;
    return Body.createRandom.call(this, xDim, yDim, x, y, sideSize, sideSize);
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
    const [x, y] = this.pos.toArr();
    ctx.fillStyle = this.color;

    this.drawRot(ctx);

    let orientation = new Vector(this.sideSize / 2, this.orientation);
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

  drawRot(ctx){
    super.drawRot(ctx, (innerCtx) => {
      innerCtx.fillRect(- this.sideSize / 2, - this.sideSize / 2, this.sideSize, this.sideSize);
    });
  }

  inBounds(xDim, yDim) {
    const [x, y] = this.pos.toArr();

    const top = 0;
    const bottom = yDim;
    const right = xDim;
    const left = 0;

    let answer = true;

    this.asLines().forEach(line => {
      if (
        line.maxX() > right ||
        line.minX() < left ||
        line.maxY() > bottom ||
        line.minY() < top
      ) { answer = false; }
    });

    return answer;
  }

  asLines() {
    const size = this.sideSize;
    const [x, y] = this.pos.toArr();

    const topLeft = [x - size / 2, y - size / 2];
    const topRight = [x + size / 2, y - size / 2];
    const bottomLeft = [x - size / 2, y + size / 2];
    const bottomRight = [x + size / 2, y + size / 2];

    const lines = [
      new Line(topLeft, topRight).rotate({x, y}, this.orientation),
      new Line(topRight, bottomRight).rotate({x, y}, this.orientation),
      new Line(bottomRight, bottomLeft).rotate({x, y}, this.orientation),
      new Line(bottomLeft, topLeft).rotate({x, y}, this.orientation)
    ];

    return lines;
  }

  reverseOnBounds(xDim, yDim) {
    const [x, y] = this.pos.toArr();

    const top = 0;
    const bottom = yDim;
    const right = xDim;
    const left = 0;

    this.asLines().forEach(line => {
      if (line.maxX() > right) {
        this.moveStep.signX(false);
      } else if (line.minX() < left) {
        this.moveStep.signX(true);
      } else if (line.maxY() > bottom) {
        this.moveStep.signY(false);
      } else if (line.minY() < top) {
        this.moveStep.signY(true);
      }
    });
  }
}

module.exports = Square;
