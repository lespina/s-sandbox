const SandBox = require('./sandbox.js');

document.addEventListener('DOMContentLoaded', () => {
  console.log(SandBox);
  SandBox.start();

  // const canvas = document.getElementById("canvas");
  // const ctx = canvas.getContext("2d");
  // ctx.beginPath();
  // ctx.arc(150,220,100,0,2*Math.PI);
  // ctx.stroke();
});
