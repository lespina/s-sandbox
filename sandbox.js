class SandBox {
  static start() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(300,300,250,0,2*Math.PI);
    ctx.stroke();
  }
}

module.exports = SandBox;
