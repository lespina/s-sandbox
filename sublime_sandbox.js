const SandBox = require('./sandbox.js');
const Circle = require('./circle.js');
const Square = require('./square.js');
const Body = require('./body.js');

document.addEventListener('DOMContentLoaded', () => {
  const [xDim, yDim] = [1000, 600];
  const s = SandBox.start(xDim, yDim, 3, true);
  document.addEventListener('click', (e) => {
    s.add(Square.createRandom(xDim, yDim, e.x, e.y));
  });
  // window.setInterval(SandBox.start.bind(SandBox, 1000, 1000), 2500);
});
