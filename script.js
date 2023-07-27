import gameObj from './objects.js';

const canvas = document.querySelector('canvas');
const playBtn = document.querySelector('.overlay .playBtn');
const playHard = document.querySelector('.hard');
const scoreText = document.querySelector('p span');
const gameOverText = document.querySelector('h3');
const c = canvas.getContext('2d');

gameOverText.style.display = 'none';
const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;

canvas.width = innerWidth;
canvas.height = innerHeight;

const mousePos = {
  x: undefined,
  y: undefined
};

let score = 0;

window.addEventListener('mousemove', function(e){
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  // console.log(mousePos);
});

const colorArray = ["#FF5733", "#FFC300", "#FF33FF", "#33FF99", "#33CCFF", "#FF33CC", "#33FFCC", "#CC33FF", "#66FF33", "#FF3366", "#33CC33", "#FF6633", "#33FFFF", "#FFCC33", "#9933FF", "#CCFF33", "#FF3333", "#CC33CC", "#66FFFF", "#FF9933"];

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

let player;
let bulletArr = [];
let enemyArr = [];
let allParticles = [];
let starsArr = [];

const init = function (){
  makeStars();
  player = new gameObj.Player(0, 0, 50, 50, 'white');
  playBtn.addEventListener('click', function(){
    playInit();
    playBtn.style.display = 'none';
    playHard.style.display = 'none';
  });
  playHard.addEventListener('click', function(){
    playInit();
    baseSpeed = 4;
    playBtn.style.display = 'none';
    playHard.style.display = 'none';
  });
}

const playInit = function (){
  bulletMake();
  enemyMake();
}

const makeStars = function(){
  for(let i = 0; i < 200; i++){
    let x = randomNumber(0, innerWidth);
    let y = randomNumber(0, innerHeight);
    let radius = randomNumber(1, 2);
    const star = new gameObj.Star(x, y, radius, 'white');
    starsArr.push(star);
  }
}

const bulletMake = function() {
  document.addEventListener('click', function(){
    const xPos = mousePos.x
    const bullet1 = new gameObj.Bullet(xPos + 7, 600, 5, 'white', 0, -10);
    const bullet2 = new gameObj.Bullet(xPos - 7, 600, 5, 'white', 0, -10);
    bulletArr.push(bullet1);
    bulletArr.push(bullet2);
  });
}

const bulletAnim = function() {
  for(let i = 0; i < bulletArr.length; i++) {
      bulletArr[i].update();
      if (bulletArr[i].y < 40) {
        bulletArr.splice(i, 1);
      }
  }
}

let baseSpeed = 2;

function enemSpeedCalc(rad) {
  return randomNumber(baseSpeed, 4 + baseSpeed);
}

const enemyMake = function(){
  // const enemy = new Enemy(100, 200, 20, 'lightgreen', 0, 0);
  setInterval(() => {
    const x = randomNumber(100, innerWidth - 100);
    const y = 20;
    const rad = randomNumber(20, 50);
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    const dy = enemSpeedCalc(rad);
    const newEnem = new gameObj.Enemy(x, y, rad, color, 0, dy);
    enemyArr.push(newEnem);
  }, 3000);
  
}

const enemyAnim = function(){
  for(let i = 0; i < enemyArr.length; i++){
    if(enemyArr[i].y > 600) {
      gamePlaying = false;
    }
    enemyArr[i].update();
  }
}

const distCalc = function(x1, y1, x2, y2) {
  const xD = x2 - x1;
  const yD = y2 - y1;

  return Math.sqrt(Math.pow(xD, 2) + Math.pow(yD, 2));
}

const dieParticleInit = function(x, y, color){
  const particles = [];
  console.log(x, y, color);
  for(let i = 0; i < 15; i++){
    const rad = randomNumber(1, 4);
    const dx = randomNumber(-1, 1);
    const dy = randomNumber(-5, -3);
    const part = new gameObj.Particles(x, y, rad, color, dx, dy);
    particles.push(part);
  }
  allParticles.push(particles);
  console.log('particles made', allParticles);
}

const partAnim = function(){
  if(allParticles.length > 0){
    for(let i = 0; i < allParticles.length; i++){
      if(allParticles[i].length === 0){
        allParticles.splice(i, 1);
      } else {
        for(let j = 0; j < allParticles[i].length; j++){
          if(allParticles[i][j].radius < 0.5){
            allParticles[i].splice(j, 1);
          }
          allParticles[i][j].update();
        }
      }
    }
  }
}

const collDetect = function() {
  if(bulletArr.length > 0){
    for(let i = 0; i < bulletArr.length; i++){
      for(let j = 0; j < enemyArr.length; j++){
        let dist = distCalc(bulletArr[i].x, bulletArr[i].y, enemyArr[j].x, enemyArr[j].y);
        let radDist = bulletArr[i].radius + enemyArr[j].radius;
        if (dist < radDist) {
          console.log('hit confirmed');
          bulletArr.splice(i, 1);
          if(enemyArr[j].radius < 10){
            console.log(enemyArr[j].x, enemyArr[j].y);
            dieParticleInit(enemyArr[j].x, enemyArr[j].y, enemyArr[j].color);
            enemyArr.splice(j, 1);
          } else {
            enemyArr[j].radius -= 4;
            score += 10;
            scoreText.innerHTML = score;
          }
        }
      }
    }
  }
}

let gamePlaying = true;

const animate = function (){
  if(gamePlaying){
    requestAnimationFrame(animate);
    c.fillStyle = '#111111';
    c.fillRect(0, 0, innerWidth, innerHeight);
    for(let i = 0; i < starsArr.length; i++){
      starsArr[i].draw();
    }
    bulletAnim();
    enemyAnim();
    collDetect();
    partAnim();
    player.update();
  } else {
    c.fillStyle = '#111111';
    c.fillRect(0, 0, innerWidth, innerHeight);
    for(let i = 0; i < starsArr.length; i++){
      starsArr[i].draw();
    }
    gameOverText.style.display = 'block';
  }
}

init();
animate();