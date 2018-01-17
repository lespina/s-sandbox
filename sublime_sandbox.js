const SandBox = require('./sandbox.js');
const Circle = require('./circle.js');

document.addEventListener('DOMContentLoaded', () => {
  SandBox.start(1000, 1000, 100);
  // window.setInterval(SandBox.start.bind(SandBox, 1000, 1000), 2500);
});
