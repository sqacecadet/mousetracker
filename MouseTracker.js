// defining const
const c = document.querySelector("canvas");
const ctx = c.getContext('2d');

// defining initial canvas dimensions
c.width = window.innerWidth;
c.height = window.innerHeight;

// defining initial x and y at the middle of the canvas
const mouse = {
	x: c.width/2,
	y: c.height/2
}

// defining the resize callback
window.addEventListener('resize', () => {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
});

// defining the mousemove event trigger function
window.addEventListener('mousemove',(evt) => {
	mouse.x = evt.clientX;
	mouse.y = evt.clientY;
});

// colors
var colors = [
			{r: 255, g: 71, b: 71},
			{r: 0, g: 206, b: 237},
			{r: 255, g: 255, b: 255}
		];

function Particle(argX, argY, argDX, argDY, argR, argTTL) {
	// defining the Class props
	this.x = argX,
	this.y = argY,
	this.dx = argDX,
	this.dy = argDY,
	this.r = argR,
	this.timeToLive = argTTL,
	this.opacity = 1,
	this.shouldRemove = false,
	this.randomColor = Math.floor(Math.random() * colors.length);

	// defining the update fn of the Particle
	this.update = function() {
		this.x += this.dx;
		this.y += this.dy;

		// to reverse the direction of the particle of it excedes the canvas dimensions
		if(this.x + this.r >= c.width || this.x - this.r <= 0) {
			this.dx = -this.dx
		}
		if(this.y + this.r >= c.width || this.y - this.r <= 0) {
			this.dy = -this.dy
		}

		// Ensuring the particles will stay inside the canvas
		this.x = Math.min(Math.max(this.x, 0 + this.r), c.width - this.r);
		this.y = Math.min(Math.max(this.y, 0 + this.r), c.height - this.r);

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);

		ctx.strokeStyle = 'rgba(' + colors[this.randomColor].r + ',' + colors[this.randomColor].g + ',' + colors[this.randomColor].b + ',' + this.opacity + ')';
		// ctx.fillStyle = 'rgba(' + colors[this.randomColor].r + ',' + colors[this.randomColor].g + ',' + colors[this.randomColor].b + ',' + this.opacity + ')';

		ctx.stroke();
		// ctx.fill();
		ctx.closePath();

		this.opacity -= 1 / (argTTL / 0.1);
		this.r -= argR / (argTTL / 0.1);
		this.timeToLive -= 0.1;
	}

	// defining remove function
	this.remove = function() {
		// returns true only if timeToLive is <= 0
		return this.timeToLive <= 0;
	};
}


function initParticle (x, y) {
	this.particles = [];

	this.init = function() {
		for (var i = 1; i <= 1; i++) {
			var randomVelocity = {
				x: (Math.random() - 0.5) * 3.5,
				y: (Math.random() - 0.5) * 3.5,
			}

			// var particle = new Particle(x, y, randomVelocity.x, randomVelocity.y, 30, 8);
			this.particles.push(new Particle(x, y, randomVelocity.x, randomVelocity.y, 30, 8));
		}
	}
	this.init();


	this.draw = function() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update();

			if (this.particles[i].remove() == true) {
				this.particles.splice(i, 1);
			};
		}
	}
}

var particlesExplosion = [];

// animate fn
const animate = () => {

	// drawing the canvas Rectangle
	ctx.fillStyle = "#1e1e1e";
	ctx.fillRect(0,0,c.width, c.height);

	particlesExplosion.push(new initParticle(mouse.x, mouse.y));
	// console.log(mouse.x, mouse.y);

	for (var i = 0; i < particlesExplosion.length; i++) {
		particlesExplosion[i].draw();
	}

}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// calling animate function
(function animationLoop(){

	requestAnimFrame(animationLoop);
	animate();
 })();
