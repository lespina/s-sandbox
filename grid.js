class Grid {
  static createGrid(width, height) {
    const result = [];
    for (let i=0; i<width; i++) {
      for (let j=0; j<height; j++) {
        result[i][j] = {};
      }
    }
  }

  constructor(width, height) {
    this.grid = Grid.createGrid(width, height);
  }

  add(item, pos) {
    const [i, j] = pos;
    this.grid[i][j][item.id] = item;
    return this;
  }

  remove(item, pos) {
    const [i, j] = pos;
    delete this.grid[i][j][item.id];
    return this;
  }

  move(id, start, end) {
    const [i, j] = start;
    const item = this.grid[i][j][id];
    if (!item) { throw 'item not found'; }
    delete this.grid[i][j][id];

    const [k, l] = end;
    this.grid[k][l][id] = item;
    return this;
  }

  includes(item) {
    for (let i=0; i<width; i++) {
      for (let j=0; j<height; j++) {
        if (result[i][j][item.id] === item) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = Grid;
