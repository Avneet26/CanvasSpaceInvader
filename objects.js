const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

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
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

const Particles = function(x, y, radius, color, dx, dy, grav = 0.2) {
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
    this.dy += this.grav;
    this.radius -= 0.05;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

const Star = function(x, y, radius, color = 'white'){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;

  this.draw = function(){
    c.beginPath();
    c.fillStyle = color;
    c.arc(x, y, radius, 0, 2*Math.PI);
    c.fill();
  }
}

const gameObj = {Player, Enemy, Bullet, Particles, Star};
export default gameObj;