class Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		this._bounds = json.bounds === undefined ? {
			x:defaults.sprite.bounds.x(),
			y:defaults.sprite.bounds.x(),
			w:defaults.sprite.bounds.w(),
			h:defaults.sprite.bounds.h()} : json.bounds;

		this.scaleAnimation = json.scaleAnimation === undefined ? defaults.animation.scale.blank() : new ScaleAnimation(json.scaleAnimation);
		this.translationAnimation = json.translationAnimation === undefined ? defaults.animation.translation.blank() : new TranslationAnimation(json.translationAnimation);


		this.subSprites = [];

		this.parrentSprite = undefined;
		this.fillColor = '#000000';
		this.strokeWeight = 0;
		this.touchEnabled = json.touchEnabled === undefined ? true : json.touchEnabled;

		this.translationAnimation.forceUpdate({x:this.bounds.x,y:this.bounds.y});
		this._bounds.x = 0;
		this._bounds.y = 0;
	}

	addSubSprite(sprite) {
		sprite.parrentSprite = this;
		this.subSprites.push(sprite);
	}
	set bounds(json) {
		json = json === undefined ? {} : json;
		this._bounds = {
			x: json.x === undefined ? this._bounds.x : json.x,
			y: json.y === undefined ? this._bounds.y : json.y,
			w: json.w === undefined ? this._bounds.w : json.w,
			h: json.h === undefined ? this._bounds.h : json.h,
		}
	}

	get bounds() {
		return  this._bounds;
	}

	get boundsWithAnimations() {
		return  {
			x:(this._bounds.x + this.translationAnimation.x)* this.scaleAnimation.width,
			y:(this._bounds.y + this.translationAnimation.y)* this.scaleAnimation.height,
			w:this._bounds.w * this.scaleAnimation.width,
			h:this._bounds.h * this.scaleAnimation.height,
		}
	}
	applyAnimations(){
		this.translationAnimation.applyEffect(this);
		this.scaleAnimation.applyEffect(this);
		fill(this.fillColor);
		strokeWeight(this.strokeWeight);
	}
	drawSubViews() {
		for(let i = 0; i < this.subSprites.length; i++) {
			this.subSprites[i].draw();
		}
	}
	draw() {
		push();
		this.applyAnimations();
		rect(this._bounds.x,this._bounds.y,this._bounds.w,this._bounds.h);
		this.drawSubViews();
		pop();
	}

	touchEnded(){
		let didTap = false;
		if(this.touchEnabled) {
			pushMouse();
				this.translationAnimation.applyEffectMouse(this);
				this.scaleAnimation.applyEffectMouse(this);
				if ((mouseX >= this._bounds.x && mouseX <= (this._bounds.x + this._bounds.w)) &&
					(mouseY >= this._bounds.y && mouseY <= (this._bounds.y + this._bounds.h))) {
					didTap = true;
				} else {
					didTap = false
				}
				for (let i = 0; i < this.subSprites.length; i++) {
					this.subSprites[i].touchEnded();
				}
			popMouse();
		}
		return didTap;
	}
}