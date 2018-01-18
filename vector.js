class Vector {
  constructor(arg1, arg2) {
    if (arg2 === undefined) {
      this.nums = arg1;
    } else {
      const mag = arg1;
      const angle = arg2;
      const x = mag * Math.cos(angle);
      const y = mag * Math.sin(angle);
      this.nums = [x, y];
    }
  }

  x() {
    return this.nums[0];
  }

  y() {
    return this.nums[1];
  }

  reverse() {
    const [x, y] = this.nums;
    this.nums = [-x, -y];
  }

  static random(bounds, includeNegatives) {
    const nums = [];
    if (includeNegatives) {
      bounds.forEach(bound => {
        let num = (Math.random() * bound);
        num = ((Math.random() < 0.5) ? -1 * num : num);
        nums.push(num);
      });
    } else {
      bounds.forEach(bound => {
        nums.push(Math.random() * bound);
      });
    }


    return new Vector(nums);
  }

  to_a() {
    return this.nums.slice(0);
  }

  magnitude() {
    let result = 0;
    this.nums.forEach(num => {
      result += (num * num);
    });

    return Math.sqrt(result);
  }

  //defined as radian value of angle from the +x axis clockwise (ONLY WORKS FOR 2-D VECTORS)
  angle() {
    const [x, y] = this.nums;
    return Math.atan2(x, y);
  }

  operate(operator, ...vectors) {
    const newNums = this.nums.slice(0);

    vectors.forEach(vector => {
      vector.nums.forEach((value, i) => {
        newNums[i] = operator(newNums[i], value);
      }, this);
    }, this);

    return new Vector(newNums);
  }

  add(...vectors) {
    return this.operate((a, b) => a + b, ...vectors);
  }

  subtract(...vectors) {
    return this.operate((a, b) => a - b, ...vectors);
  }

  multiply(...vectors) {
    return this.operate((a, b) => a * b, ...vectors);
  }

  div(...vectors) {
    return this.operate((a, b) => Math.floor(a / b), ...vectors);
  }

  fdiv(...vectors) {
    return this.operate((a, b) => a / b, ...vectors);
  }
}

module.exports = Vector;
