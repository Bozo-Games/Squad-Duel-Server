class WanderCharacterView extends CharacterView {
	constructor(json) {
		super(json);
		this.animation = this.wander();
	}
	animate(json) {
		super.animate(json);
	}

	draw() {
		push();
		super.applyTransformations();
		this.drawCharacter();
		this.drawName();
		pop();
	}

	wander() {
		if(random() > 0.25) {
			let x = random(this.root.w/2, width-this.root.w/2);
			let y = random(this.root.h/2, height-this.root.h/2);
			let d = ((this.global.x - x) ** 2 + (this.global.y - y) ** 2) ** 0.5;
			let w = 1;
			if(x<this.global.x) {
				w = -1;
			}
			return {
				startFrame: {w:w,x:this.global.x,y:this.global.y,loop: 'walk', t: 1, mode: {x: 'g', y: 'g'}},
				keyFrames:[{t: d*12}],
				endFrame: {x: x, y: y, loop: 'idle'},
				callBack: function () {
					this.animation = this.wander();
				}.bind(this)
			}
		} else {
			return {
				startFrame: {t:random(400,1600)},
				callBack: function () {
					this.animation = this.wander();
				}.bind(this)
			}
		}
	}

	get isAnimating() {
		return false;
	}
}