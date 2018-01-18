const SandBox = require('./sandbox.js');
const Circle = require('./circle.js');

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', () => {
    SandBox.start(1000, 600, 50, true);
  });
  // window.setInterval(SandBox.start.bind(SandBox, 1000, 1000), 2500);
});
