import { Point } from "./models/point.js";
import { Side } from "./models/side.js";

document.addEventListener("DOMContentLoaded", function () {
  // Roda ao iniciar o documento, monta o dado em seu primeiro estado
  const dice = [
    new Side([new Point(50, 50), new Point(50, -50), new Point(-50, -50), new Point(-50, 50), new Point(50, 50)], 1),
    new Side([new Point(50, -150), new Point(50, -150), new Point(-50, -150), new Point(-50, -50), new Point(50, -50)], 2),
    new Side([new Point(50, 150), new Point(50, 50), new Point(-50, 50), new Point(-50, 150), new Point(50, 150)], 3),
    new Side([new Point(150, 50), new Point(150, -50), new Point(50, -50), new Point(50, 50), new Point(150, 50)], 4),
    new Side([new Point(-150, 50), new Point(-150, -50), new Point(-50, -50), new Point(-50, 50), new Point(50, 50)], 5),
    new Side([new Point(-250, 50), new Point(-250, -50), new Point(-150, -50), new Point(-150, 50), new Point(-150, 50)], 6)
  ]
  draw(dice);
});

function draw(dice) { // Monta o Dado baseado nos parâmetros enviados
  var canvas = document.getElementById('cartesian-canvas');
  var ctx = canvas.getContext('2d');

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;

  dice.forEach(side => {
    ctx.beginPath();
    ctx.moveTo(side.points[0].x, side.points[0].y);

    for (let i = 1; i < side.points.length; i++) {
      ctx.lineTo(side.points[i].x, side.points[i].y);
    }
    
    ctx.closePath();
    ctx.stroke();
  });
}

