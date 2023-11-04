import { Point } from "./models/point.js";
import { Side } from "./models/side.js";

let currentDice = [];

document.addEventListener("DOMContentLoaded", function () {
  const translateLeftButton = document.getElementById('translate-left');
  if(translateLeftButton){
    translateLeftButton.addEventListener('click', translateLeft);
  }
  const translateDownButton = document.getElementById('translate-down');
  if(translateDownButton){
    translateDownButton.addEventListener('click', translateDown);
  }

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

function translateLeft() {
  console.log('translated');
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point(point.x - 50, point.y);
    });
    return new Side(newPoints, side.value);
  });
  draw(newDice);
}

function translateDown() {
  console.log('translated');
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point(point.x, point.y - 50);
    });
    return new Side(newPoints, side.value);
  });
  draw(newDice);
}


function draw(dice) { // Monta o Dado baseado nos parâmetros enviados
  var canvas = document.getElementById('cartesian-canvas');
  var ctx = canvas.getContext('2d');
  currentDice = dice;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

