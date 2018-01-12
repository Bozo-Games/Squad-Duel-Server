class ParticleView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		this.minAngle = json.minAngle === undefined ? 0 : json.minAngle;
		this.maxAngle = json.maxAngle === undefined ? TWO_PI : json.maxAngle;

		this.vel = json.vel === undefined ? 1 : json.vel;
		this.halfLife = json.halfLife === undefined ? 50 : json.halfLife;

		this.minCount = json.minCount === undefined ? 1 : json.minCount;
		this.maxCount = json.maxCount ===  undefined ? 2 : json.maxCount;


		this.particles = [];
	}
	draw() {
		this.validateMinMaxCount();
		push();
		super.applyTransformations();
		ellipseMode(CENTER);
		for(let i = this.particles.length-1; i >= 0; i--) {
			let p = this.particles[i];
			this.drawParticle(p);
			this.moveParticle(p);
			if(p.life < 0) {
				this.particles.splice(i,1);
			}
		}
		if(this.shouldAddParticle()) {
			this.addParticle();
		}
		super.drawSubSprites();
		pop();
	}

	drawParticle(p) {
		ellipse(p.x,p.y,this.w*p.w,this.h*p.h);
	}

	moveParticle(p) {
		p.life--;
		p.x += p.dx;
		p.y += p.dy;
		p.w += p.dw;
		p.h += p.dh;
	}

	shouldAddParticle() {
		return (Math.random() > this.particles.length / (this.maxCount - this.minCount)) && this.particles.length < this.maxCount;
	}

	addParticle() {
		let angle = random(this.minAngle, this.maxAngle);
		let dx = Math.cos(angle) *this.vel;
		let dy = Math.sin(angle) *this.vel;
		this.particles.push( {
			x: 0,
			y: 0,
			w:1,
			h:1,
			dx: dx,
			dy: dy,
			dw: -0.01,
			dh: -0.01,
			life: this.halfLife
		});
	}

	validateMinMaxCount() {
		if(this.minCount > this.maxCount) {
			let t = this.minCount;
			this.minCount = this.maxCount;
			this.maxCount = t;
		}
		if(this.minCount === this.maxCount) {
			this.maxCount++;
		}
	}
}