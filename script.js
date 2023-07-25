const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;

canvas.width = innerWidth;
canvas.height = innerHeight;

const mousePos = {
  x: undefined,
  y: undefined
};

window.addEventListener('mousemove', function(e){
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  // console.log(mousePos);
});

const Player = function (x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.h = h;
  this.w = w;
  this.color = color;

  this.draw = function() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.w, this.h);
  }

  this.update = function() {
    this.x = mousePos.x - (this.w/2);
    this.y = 600;
    this.draw();
  }
}

const Bullet = function(x, y, radius, color, dx, dy){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.dx = dx;
  this.dy = dy;

  this.draw = function() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    c.fill();
  }

  this.update = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

const Enemy = function(x, y, radius, color, dx, dy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.dx = dx;
  this.dy = dy;

  this.draw = function() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    c.fill();
  }

  this.update = function(){
    this.draw();
  }
}

const Particles = function(x, y, radius, color, dx, dy, grav) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.dx = dx;
  this.dy = dy;
  this.grav = grav;

  this.draw = function() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    c.fill();
  }

  this.update = function() {
    this.x =+ this.dx;
    this.y =+ this.dy;
    this.draw();
  }
}

let player;
let bulletArr = [];
let enemyArr = [];
let allParticles = [];

const init = function (){
  player = new Player(0, 0, 50, 50, 'white');
  bulletMake();
  enemyMake();
}

const bulletMake = function() {
  document.addEventListener('click', function(){
    const xPos = mousePos.x
    const bullet = new Bullet(xPos, 600, 5, 'white', 0, -10);
    bulletArr.push(bullet);
  });
}

const bulletAnim = function() {
  for(i = 0; i < bulletArr.length; i++) {
      bulletArr[i].update();
      if (bulletArr[i].y < 40) {
        bulletArr.splice(i, 1);
      }
  }
}

const enemyMake = function(){
  const enemy = new Enemy(100, 200, 20, 'lightgreen', 0, 0);
  enemyArr.push(enemy);
}

const enemyAnim = function(){
  for(i = 0; i < enemyArr.length; i++){
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
  for(i = 0; i < 15; i++){
    const rad = Math.floor(Math.random() * 5);
    const dx = (Math.random() - 0.5) + 1;
    const dy = (Math.random() - 0.5) + 1;
    const part = new Particles(x, y, rad, color, dx, dy);
    particles.push(part);
  }
  allParticles.push(particles);
}

const partAnim = function(){
  for(i = 0; i < allParticles.length; i++){
    console.log(particles);
    allParticles[i].update();
  }
}

const collDetect = function() {
  if(bulletArr.length > 0){
    for(i = 0; i < bulletArr.length; i++){
      for(j = 0; j < enemyArr.length; j++){
        let dist = distCalc(bulletArr[i].x, bulletArr[i].y, enemyArr[j].x, enemyArr[j].y);
        let radDist = bulletArr[i].radius + enemyArr[j].radius;
        if (dist < radDist) {
          console.log('hit confirmed');
          bulletArr.splice(i, 1);
          if(enemyArr[j].radius < 10){
            dieParticleInit(enemyArr[j].x, enemyArr[j].y, enemyArr[j].color);
            enemyArr.splice(j, 1);
          } else {
            enemyArr[j].radius -= 2;
          }
        }
      }
    }
  }
}

const animate = function (){
  requestAnimationFrame(animate);
  c.fillStyle = '#111111';
  c.fillRect(0, 0, innerWidth, innerHeight);
  bulletAnim();
  enemyAnim();
  collDetect();
  player.update();
}

init();
animate();