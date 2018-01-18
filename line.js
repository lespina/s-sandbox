const LineIntersection = require('line-intersection');

class Line {
  constructor(start, end) {
    let [x, y] = start;
    this.start = {x, y};

    [x, y] = end;
    this.end = {x ,y};
  }

  maxX() {
    return Math.max(this.start.x, this.end.x);
  }

  maxY() {
    return Math.max(this.start.y, this.end.y);
  }

  intersectsWith(otherLine) {
    return LineIntersection.isSegmentIntersected(
      [
        this.start,
        this.end,
        otherLine.start,
        otherLine.end
      ]
    );
  }
}

module.exports = Line;
