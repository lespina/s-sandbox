const LineIntersection = require('line-intersection');

class Line {
  constructor(start, end) {
    let [x, y] = start;
    this.start = {x, y};

    [x, y] = end;
    this.end = {x ,y};
  }

  intersectsWith(otherLine) {
    return LineIntersection.isSegmentIntersected(
      this.start,
      this.end,
      otherLine.start,
      otherLine.end
    );
  }
}

module.exports = Line;
