class WanderCharacterView extends CharacterView {
	constructor(json) {
		super(json);
	}
	animate(json) {
		super.animate(json);
		this.animation = this.wander();
	}

	draw() {
		push();
		super.applyTransformations();
		imageMode(CENTER);
		let img = icons.getCharacter('Knight', this.lastAnimationData.loop,this.loopOffSet);
		image(img,0,0,this.w,this.h);
		textAlign(CENTER,TOP);
		fill('#000');
		if(this.lastAnimationData.w < 0) {scale(-1,1);}
		text(this.name,0,this.h/2);
		pop();
	}

	wander() {
		if(random() > 0.5) {
			let x = random(this.root.w, width-this.root.w);
			let y = random(this.root.h, height-this.root.h);
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