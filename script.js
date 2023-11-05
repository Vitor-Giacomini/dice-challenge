import { Point } from "./models/point.js";
import { Side } from "./models/side.js";

let currentDice = [];
let sideSize = 100;
let inclined = false;

document.addEventListener("DOMContentLoaded", function () {
  setupButtons();

  const dice = [
    new Side([new Point(50, 50), new Point(50, -50), new Point(-50, -50), new Point(-50, 50), new Point(50, 50)], 1),
    new Side([new Point(150, 50), new Point(150, -50), new Point(50, -50), new Point(50, 50), new Point(150, 50)], 2),
    new Side([new Point(50, 150), new Point(50, 50), new Point(-50, 50), new Point(-50, 150), new Point(50, 150)], 3),
    new Side([new Point(50, -50), new Point(50, -150), new Point(-50, -150), new Point(-50, -50), new Point(50, -50)], 4),
    new Side([new Point(-50, 50), new Point(-50, -50), new Point(-150, -50), new Point(-150, 50), new Point(-50, 50)], 5),
    new Side([new Point(-250, 50), new Point(-250, -50), new Point(-150, -50), new Point(-150, 50), new Point(-150, 50)], 6)
  ]
  draw(dice);
});

function translate(xTranslation, yTranslation) {
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point(point.x + xTranslation, point.y + yTranslation);
    });
    return new Side(newPoints, side.dots);
  });
  draw(newDice);
}

function scale(xScale, yScale) {
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point(point.x * xScale, point.y * yScale);
    });
    return new Side(newPoints, side.dots);
  });
  draw(newDice);
  sideSize = Math.abs(currentDice[0].points[0].x - currentDice[0].points[2].x)
}

function rotate(angle) {
  console.log(sideSize);
  inclined = !inclined;
  let radians = angle * Math.PI / 180;
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point((point.x * Math.cos(radians) - point.y * Math.sin(radians)), 
      (point.x * Math.sin(radians) + point.y * Math.cos(radians)));
    });
    return new Side(newPoints, side.dots);
  });
  draw(newDice, radians);
}

function separate(distance) {
  console.log(sideSize);
  let radians = 45 * Math.PI / 180;
  
  const newDice = currentDice.map(side => {
    let pointNumber = -1;
    const newPoints = side.points.map(point => {
      pointNumber++;
      if(!inclined){ // Dado reto
        if(point.x <= currentDice[0].points[pointNumber].x && point.y > currentDice[0].points[pointNumber].y){
          return new Point(point.x, point.y + distance); // vai pra cima
        }
        if(point.x >= currentDice[0].points[pointNumber].x && point.y < currentDice[0].points[pointNumber].y){
          return new Point(point.x, point.y - distance); // vai pra baixo
        }
        if(point.x > currentDice[0].points[pointNumber].x && point.y >= currentDice[0].points[pointNumber].y){
          return new Point(point.x + distance, point.y); // vai pra direita
        }
        if(point.x < currentDice[0].points[pointNumber].x && point.y <= currentDice[0].points[pointNumber].y){ 
          return new Point(point.x - distance, point.y); // vai pra esquerda
        }
        return new Point(point.x, point.y);
      }
      if(inclined){ // Dado inclinado
        if(point.x < currentDice[0].points[pointNumber].x && point.y > currentDice[0].points[pointNumber].y){
          return new Point(point.x - distance * Math.cos(radians), point.y + distance * Math.sin(radians)); // vai pra cima
        }        
        if(point.x < currentDice[0].points[pointNumber].x && point.y < currentDice[0].points[pointNumber].y){
          return new Point(point.x - distance * Math.cos(radians), point.y  - distance * Math.sin(radians)); // vai pra baixo
        }
        if(point.x > currentDice[0].points[pointNumber].x && point.y < currentDice[0].points[pointNumber].y){
          return new Point(point.x + distance * Math.cos(radians), point.y - distance * Math.sin(radians)); // vai pra direita
        }
        if(point.x > currentDice[0].points[pointNumber].x && point.y > currentDice[0].points[pointNumber].y){ 
          return new Point(point.x + distance * Math.cos(radians), point.y + distance * Math.sin(radians)); // vai pra esquerda
        }
        return new Point(point.x, point.y);
      }
      
    });
    return new Side(newPoints, side.dots);
  });
  draw(newDice);
}


function draw(dice, radians) {
  const canvas = document.getElementById('cartesian-canvas');
  const ctx = canvas.getContext('2d');
  currentDice = dice;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);

  drawAxes(ctx);

  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'black';
  ctx.lineWidth = 1;

  dice.forEach(side => {
    ctx.beginPath();
    ctx.moveTo(side.points[0].x, side.points[0].y);

    for (let i = 1; i < side.points.length; i++) {
      ctx.lineTo(side.points[i].x, side.points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    drawDots(ctx, side, radians);
  });
}

function drawAxes(ctx){
  ctx.strokeStyle = 'lightgrey';
  ctx.beginPath();
  ctx.moveTo(0, -500);
  ctx.lineTo(0, 500);
  ctx.moveTo(550, 0);
  ctx.lineTo(-550, 0);
  ctx.closePath();
  ctx.stroke();
}

function drawDots(ctx, side, radians) {
  console.log(radians);
  const centerX = (side.points[0].x + side.points[2].x) / 2;
  const centerY = (side.points[0].y + side.points[2].y) / 2;
  const dotRadius = Math.abs(side.points[0].x - side.points[2].x) / 20;
  const offset = Math.abs(side.points[0].x - side.points[2].x) / 5;

  const dotPatterns = {
    1: () => {
        drawDot(ctx, centerX, centerY, dotRadius);
    },
    2: () => {
        drawDot(ctx, centerX - offset, centerY + offset, dotRadius);
        drawDot(ctx, centerX + offset, centerY - offset, dotRadius);
    },
    3: () => {
        drawDot(ctx, centerX - offset + (centerX * Math.cos(radians) - centerY * Math.sin(radians)), centerY + offset + (centerX * Math.sin(radians) + centerY * Math.cos(radians)), dotRadius);
        drawDot(ctx, centerX, centerY, dotRadius);
        drawDot(ctx, centerX + offset + (centerX * Math.cos(radians) - centerY * Math.sin(radians)), centerY - offset + (centerX * Math.sin(radians) + centerY * Math.cos(radians)), dotRadius);
    },
    4: () => {
        drawDot(ctx, centerX - offset, centerY - offset, dotRadius);
        drawDot(ctx, centerX - offset, centerY + offset, dotRadius);
        drawDot(ctx, centerX + offset, centerY - offset, dotRadius);
        drawDot(ctx, centerX + offset, centerY + offset, dotRadius);
    },
    5: () => {
        drawDot(ctx, centerX - offset, centerY - offset, dotRadius);
        drawDot(ctx, centerX - offset, centerY + offset, dotRadius);
        drawDot(ctx, centerX, centerY, dotRadius);
        drawDot(ctx, centerX + offset, centerY - offset, dotRadius);
        drawDot(ctx, centerX + offset, centerY + offset, dotRadius);
    },
    6: () => {
        drawDot(ctx, centerX - offset, centerY - offset, dotRadius);
        drawDot(ctx, centerX - offset, centerY, dotRadius);
        drawDot(ctx, centerX - offset, centerY + offset, dotRadius);
        drawDot(ctx, centerX + offset, centerY - offset, dotRadius);
        drawDot(ctx, centerX + offset, centerY, dotRadius);
        drawDot(ctx, centerX + offset, centerY + offset, dotRadius);
    }
  };

    dotPatterns[side.dots]();
}

function drawDot(ctx, x, y, dotRadius) {
  ctx.beginPath();
  ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
  ctx.fill();
}

function setupButtons(){
  const translateLeftButton = document.getElementById('translate-left');
  if (translateLeftButton) {
    translateLeftButton.addEventListener('click', () => translate(-sideSize/2, 0));
  }
  const translateDownButton = document.getElementById('translate-down');
  if (translateDownButton) {
    translateDownButton.addEventListener('click', () => translate(0, -sideSize/2));
  }
  const translateUpButton = document.getElementById('translate-up');
  if (translateUpButton) {
    translateUpButton.addEventListener('click', () => translate(0, sideSize/2));
  }
  const translateRightButton = document.getElementById('translate-right');
  if (translateRightButton) {
    translateRightButton.addEventListener('click', () => translate(sideSize/2, 0));
  }
  const scaleUpButton = document.getElementById('scale-up');
  if (scaleUpButton) {
    scaleUpButton.addEventListener('click', () => scale(1.2, 1.2));
  }
  const scaleDownButton = document.getElementById('scale-down');
  if (scaleDownButton) {
    scaleDownButton.addEventListener('click', () => scale(0.5, 0.5));
  }
  const rotateClockwiseButton = document.getElementById('rotate-clockwise');
  if (rotateClockwiseButton) {
    rotateClockwiseButton.addEventListener('click', () => rotate(-45));
  }
  const rotateAntiClockwiseButton = document.getElementById('rotate-anti-clockwise');
  if (rotateAntiClockwiseButton) {
    rotateAntiClockwiseButton.addEventListener('click', () => rotate(45));
  }
  const separateButton = document.getElementById('separate');
  if (separateButton) {
    separateButton.addEventListener('click', () => separate(sideSize/2));
  }
}


