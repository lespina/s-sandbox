const SandBox = require('./sandbox.js');
const Circle = require('./circle.js');
const Square = require('./square.js');
const Body = require('./body.js');
const shuffle = require('shuffle-array');

document.addEventListener('DOMContentLoaded', () => {
  window.onkeydown = function(e) {
    return (e.keyCode !== 32);
  };

  const bodies = [Circle, Square];

  const [xDim, yDim] = [1000, 600];
  const s = SandBox.start(xDim, yDim, 3, true);
  document.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.keyCode === 32) {
      s.add(shuffle(bodies)[0].createRandom(xDim, yDim));
    }
  });
  document.addEventListener('click', s.setAttractor.bind(s));
  // window.setInterval(SandBox.start.bind(SandBox, 1000, 1000), 2500);
});
