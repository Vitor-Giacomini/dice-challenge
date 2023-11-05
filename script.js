import { Point } from "./models/point.js";
import { Side } from "./models/side.js";

let currentDice = [];
let sideSize = 100;
let inclined = false;

document.addEventListener("DOMContentLoaded", function () {
  setupButtons(); // Monta os botões e o dado no seu estado inicial

  const dice = [
    new Side([new Point(50, 50), new Point(50, -50), new Point(-50, -50), new Point(-50, 50), new Point(50, 50)], 
    [new Point(0, 0)]),

    new Side([new Point(150, 50), new Point(150, -50), new Point(50, -50), new Point(50, 50), new Point(150, 50)], 
    [new Point(80, 20), new Point(120, -20)]),

    new Side([new Point(50, 150), new Point(50, 50), new Point(-50, 50), new Point(-50, 150), new Point(50, 150)], 
    [new Point(-20, 120), new Point(0, 100), new Point(20, 80)]),

    new Side([new Point(50, -50), new Point(50, -150), new Point(-50, -150), new Point(-50, -50), new Point(50, -50)],
    [new Point(-20 , -80), new Point(20, -80), new Point(-20, -120), new Point(20, -120)]),

    new Side([new Point(-50, 50), new Point(-50, -50), new Point(-150, -50), new Point(-150, 50), new Point(-50, 50)], 
    [new Point(-120, 20), new Point(-80, 20), new Point(-100, 0), new Point(-120, -20), new Point(-80, -20)]),

    new Side([new Point(-150, 50), new Point(-150, -50),  new Point(-250, -50), new Point(-250, 50), new Point(-150, 50)], 
    [new Point(-220, 20), new Point(-220, 0), new Point(-220, -20),  new Point(-180, 20), new Point(-180, 0), new Point(-180, -20)])
  ]
  draw(dice);
});

function translate(xTranslation, yTranslation) {
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point(point.x + xTranslation, point.y + yTranslation);
    });
    const newDots = side.dots.map(dot => {
      return new Point(dot.x + xTranslation, dot.y + yTranslation);
    })
    return new Side(newPoints, newDots);
  });
  draw(newDice);
}

function scale(xScale, yScale) {
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point(point.x * xScale, point.y * yScale);
    });
    const newDots = side.dots.map(dot => {
      return new Point(dot.x * xScale, dot.y * yScale);
    });
    return new Side(newPoints, newDots);
  });
  draw(newDice);
}

function rotate(angle) {
  inclined = !inclined;
  let radians = angle * Math.PI / 180;
  const newDice = currentDice.map(side => {
    const newPoints = side.points.map(point => {
      return new Point((point.x * Math.cos(radians) - point.y * Math.sin(radians)), 
      (point.x * Math.sin(radians) + point.y * Math.cos(radians)));
    });
    const newDots = side.dots.map(dot => {
      return new Point((dot.x * Math.cos(radians) - dot.y * Math.sin(radians)), 
      (dot.x * Math.sin(radians) + dot.y * Math.cos(radians)));
    });
    return new Side(newPoints, newDots);
  });
  draw(newDice);
}

function separate(distance) {
  let radians = 45 * Math.PI / 180;
  
  const newDice = currentDice.map(side => {

    let pointNumber = -1;
    let dotNumber = -1;
    const centerX = (side.points[0].x + side.points[2].x) / 2;
    const centerY = (side.points[0].y + side.points[2].y) / 2;
    const currentDiceX = (currentDice[0].points[0].x + currentDice[0].points[2].x)/2;
    const currentDiceY = (currentDice[0].points[0].y + currentDice[0].points[2].y)/2;

    const newPoints = side.points.map(point => {
      pointNumber++;
      if(!inclined){ // Dado reto
        if(centerX-0.1 <= currentDiceX && centerY-0.1 > currentDiceY){
          return new Point(point.x, point.y + distance); // vai pra cima
        }
        if(centerX+0.1 >= currentDiceX && centerY+0.1 < currentDiceY){
          return new Point(point.x, point.y - distance); // vai pra baixo
        }
        if(centerX-0.1 > currentDiceX && centerY+0.1 >= currentDiceY){
          return new Point(point.x + distance, point.y); // vai pra direita
        }
        if(centerX+0.1 < currentDiceX && centerY-0.1 <= currentDiceY){ 
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

    const newDots = side.dots.map(dot => {
      if(!inclined){ // Dado reto
        if(centerX-0.1 <= currentDiceX && centerY-0.1 > currentDiceY){
          return new Point(dot.x, dot.y + distance); // vai pra cima
        }
        if(centerX+0.1 >= currentDiceX && centerY+0.1 < currentDiceY){
          return new Point(dot.x, dot.y - distance); // vai pra baixo
        }
        if(centerX-0.1 > currentDiceX && centerY+0.1 >= currentDiceY){
          return new Point(dot.x + distance, dot.y); // vai pra direita
        }
        if(centerX+0.1 < currentDiceX && centerY-0.1 <= currentDiceY){ 
          return new Point(dot.x - distance, dot.y); // vai pra esquerda
        }
        return new Point(dot.x, dot.y);
      }
      if(inclined){ // Dado inclinado
        if(dot.x < currentDice[0].dots[0].x && dot.y > currentDice[0].dots[0].y){
          return new Point(dot.x - distance * Math.cos(radians), dot.y + distance * Math.sin(radians)); 
          // vai pra cima
        }        
        if(dot.x < currentDice[0].dots[0].x && dot.y < currentDice[0].dots[0].y){
          return new Point(dot.x - distance * Math.cos(radians), dot.y  - distance * Math.sin(radians)); 
          // vai pra baixo
        }
        if(dot.x > currentDice[0].dots[0].x && dot.y < currentDice[0].dots[0].y){
          return new Point(dot.x + distance * Math.cos(radians), dot.y - distance * Math.sin(radians)); 
          // vai pra direita
        }
        if(dot.x > currentDice[0].dots[0].x && dot.y > currentDice[0].dots[0].y){ 
          return new Point(dot.x + distance * Math.cos(radians), dot.y + distance * Math.sin(radians)); 
          // vai pra esquerda
        }
        return new Point(dot.x, dot.y);
      }
      
    });
    return new Side(newPoints, newDots);
  });
  draw(newDice);
}


function draw(dice) {
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
  
    sideSize = !inclined
    ? Math.abs(currentDice[0].points[0].x - currentDice[0].points[2].x)
    : Math.abs(currentDice[0].points[0].x - currentDice[0].points[1].x)/Math.sin(45 * Math.PI/180);

    for (let i = 0; i < side.dots.length; i++) {
      ctx.beginPath();
      ctx.arc(side.dots[i].x, side.dots[i].y, sideSize/20, 0, Math.PI * 2, true);
      ctx.fill();
    }
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


