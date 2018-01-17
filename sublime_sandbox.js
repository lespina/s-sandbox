const SandBox = require('./sandbox.js');

document.addEventListener('DOMContentLoaded', () => {
  // SandBox.start(1000, 1000);
  window.setInterval(SandBox.start.bind(SandBox, 1000, 1000), 2500);
});
