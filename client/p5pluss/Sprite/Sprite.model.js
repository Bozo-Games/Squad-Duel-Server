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

		this.translationAnimation.forceUpdate({x:this._bounds.x,y:this._bounds.y});
		this._bounds.x = 0;
		this._bounds.y = 0;

		this.subSprites = [];

		this.parentSprite = undefined;
		this.fillColor = json.fillColor === undefined ? '#000000' : json.fillColor;
		this.strokeWeight = json.strokeWeight === undefined ? 0 : json.strokeWeight;
		this.touchEnabled = json.touchEnabled === undefined ? true : json.touchEnabled;
		this.fontSize = json.fontSize === undefined ? 14 : json.fontSize;

		if(json.parentSprite instanceof Sprite) {
			json.parentSprite.addSubSprite(this);
		}

	}

	addSubSprite(sprite) {
		sprite.parentSprite = this;
		this.subSprites.push(sprite);
	}
	removeSubSprite(sprite) {
		for(let i = this.subSprites.length -1 ; i >= 0; i--){
			if(this.subSprites[i] === sprite) {
				this.subSprites.splice(i,1);
				sprite.parentSprite = undefined;
			}
		}
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
		return this._bounds;
	}
/*
	get bounds() {
		return  {
			x:(this._bounds.x + this.translationAnimation.x)* this.scaleAnimation.width,
			y:(this._bounds.y + this.translationAnimation.y)* this.scaleAnimation.height,
			w:this._bounds.w * this.scaleAnimation.width,
			h:this._bounds.h * this.scaleAnimation.height,
		}
	}*/
	applyAnimations(){
		//translate(this.bounds.x,this.bounds.y);
		this.translationAnimation.applyEffect(this);
		this.scaleAnimation.applyEffect(this);
		fill(this.fillColor);
		strokeWeight(this.strokeWeight);
		textSize(this.fontSize);
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

	get activeAnimationCount() {
		let aa = this.translationAnimation._keyValues.length + this.scaleAnimation._keyValues.length;
		for (let i = 0; i < this.subSprites.length; i++) {
			aa += this.subSprites[i].activeAnimationCount;
		}
		return aa;
	}
}