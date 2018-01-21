const SandBox = require('./sandbox.js');
const Circle = require('./circle.js');
const Square = require('./square.js');
const Triangle = require('./triangle.js');
const shuffle = require('shuffle-array');

document.addEventListener('DOMContentLoaded', () => {
  window.onkeydown = function(e) {
    return (e.keyCode !== 32);
  };

  const bodies = [Circle, Square, Triangle];

  const [xDim, yDim] = [1000, 600];
  const s = SandBox.start(xDim, yDim, 250, true);
  document.addEventListener('keyup', (e) => {
    e.preventDefault();
    switch (e.keyCode) {
      case 32:
        s.add(shuffle(bodies)[0].createRandom(xDim, yDim));
        break;
      case 71:
        s.toggleGravity();
        break;
      case 82:
        s.removeForces();
        break;
    }
  });
  document.addEventListener('click', s.setAttractor.bind(s));
  // window.setInterval(SandBox.start.bind(SandBox, 1000, 1000), 2500);
});
