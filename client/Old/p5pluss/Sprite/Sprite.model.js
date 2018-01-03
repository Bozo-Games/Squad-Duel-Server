class Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		//sizing
		checkJSONValue(this,json,'_root.x',['x','root.x'],0);
		checkJSONValue(this,json,'_root.y',['y','root.y'],0);
		checkJSONValue(this,json,'_root.w',['w','root.w','width','root.width'],100);
		checkJSONValue(this,json,'_root.h',['h','root.h','height','root.height'],100);

		//parenting
		this._subSprites = [];
		checkJSONValue(this,json,'_parentSprite',['parentSprite']);
		if(this._parentSprite !== undefined) {
			this._parentSprite.addSubSprite(this);
		}

		//touch
		checkJSONValue(this,json,'touchEnabled',['touchEnabled'],false);

		//animations
		this._animationQueu = [];
		checkJSONValue(this,json,'_animationTranslation.x',['animation.x'],0);
		checkJSONValue(this,json,'_animationTranslation.y',['animation.y'],0);
		checkJSONValue(this,json,'_animationScale.w',['animation.w'],1);
		checkJSONValue(this,json,'_animationScale.h',['animation.h'],1);
		this._animation = {
			x:this._animationTranslation.x,
			y:this._animationTranslation.y,
			w:this._animationScale.w,
			h:this._animationScale.h};

		//debug;
		this.debug = false;

		//draw settings
		checkJSONValue(this,json,'_drawSettings.fillColor',['color','fillColor','settings.fill','settings.fillColor','drawSettings.fillColor','drawSettings.color'],'#666666');
		checkJSONValue(this,json,'_drawSettings.stroke.weight',[
			'strokeWeight','borderWidth',
			'settings.strokeWeight','settings.borderWidth',
			'drawSettings.strokeWeight','drawSettings.borderWidth',
			'settings.stroke.weight','settings.border.width',
			'drawSettings.strokeWeight','drawSettings.borderWidth',
			'drawSettings.stroke.weight','drawSettings.border.width','drawSettings.border.w'],1);
		checkJSONValue(this,json,'_drawSettings.stroke.color',[
			'strokeColor','borderColor',
			'settings.strokeColor','settings.borderColor',
			'drawSettings.strokeColor','drawSettings.borderColor',
			'settings.stroke.color','settings.border.color',
			'drawSettings.stroke.color','drawSettings.border.color',
		],'#000000');

	}
	//---------------------------------------------------------------------------------------------------------- Getters
	get animation() {
		return this._animation;
	}
	get root(){
		return this._root;
	}
	get x(){return this.root.x;}
	get y(){return this.root.y;}
	get w(){return this.root.w;}
	get h(){return this.root.h;}
	get local(){
		return {
			x: this.root.x + this.animation.x,
			y: this.root.y + this.animation.y,
			w: this.root.w * this.animation.w,
			h: this.root.h * this.animation.h
		};
	}
	get lastAnimation() {
		if(this._animationQueu.length > 0) {
			return {
				x: this._animationQueu[this._animationQueu.length-1].x,
				y: this._animationQueu[this._animationQueu.length-1].y,
				w: this._animationQueu[this._animationQueu.length-1].w,
				h: this._animationQueu[this._animationQueu.length-1].h
			};
		}
		return this.animation;
	}
	get global() {
		let b = {
			x:this.local.x,
			y:this.local.y,
			w:this.local.w,
			h:this.local.h
		};
		if(this.parentSprite !== undefined) {
			let pg = this.parentSprite.global;
			b.x += pg.x;
			b.y += pg.y;
			b.w *= this.parentSprite.animation.w;
			b.h *= this.parentSprite.animation.h;
		}
		return b;
	}
	get z() {
		if(this.parentSprite !== undefined) {
			return this.parentSprite.subSprites.indexOf(this);
		} else {
			return 0;
		}
	}
	get drawSettings() {
		return this._drawSettings;
	}
	get subSprites() {
		return this._subSprites;
	}
	get parentSprite() {
		return this._parentSprite;
	}
	//----------------------------------------------------------------------------------------------------------- Setter
	set x(newRootX) {
		let old = this.x;
		if(old !== 0 && false){ //don't think root x should move if parent's root gets moved
			for(let sprite of this.subSprites) {
				sprite.x = (newRootX *  sprite.x) / old;
			}
		}
		this.root.x = newRootX;
	}
	set y(newRootY) {
		let old = this.y;
		if(old !== 0 && false){ //don't think root yx should move if parent's root gets moved
			for (let sprite of this.subSprites) {
				sprite.y = (newRootY * sprite.y) / old;
			}
		}
		this.root.y = newRootY;
	}
	set w(newRootW) {
		let old = this.w;
		if(old !== 0) {
			for (let sprite of this.subSprites) {
				sprite.w = (newRootW * sprite.w) / old;
			}
		}
		this.root.w = newRootW;
	}
	set h(newRootH) {
		let old = this.h;
		if(old !== 0) {
			for (let sprite of this.subSprites) {
				sprite.h = (newRootH * sprite.h) / old;
			}
		}
		this.root.h = newRootH;
	}
	set z(newZ) {
		if(this.parentSprite !== undefined) {
			newZ = Math.max(0,Math.min(this.parentSprite.subSprites.length-1,newZ));
			this.parentSprite.subSprites.move(this.z,newZ);
		}
	}
	//---------------------------------------------------------------------------------------------------------- Drawing
	applyTransformations() {
		let x = this._animationTranslation.x;
		let y = this._animationTranslation.y;
		let w = this._animationScale.w;
		let h = this._animationScale.h;
		if(this._animationQueu.length > 0) {
			if(this._animationQueu[0].percentToValue >= 1 ) {
				this._animationTranslation.x = this._animationQueu[0].x;
				this._animationTranslation.y = this._animationQueu[0].y;
				this._animationScale.w = this._animationQueu[0].w;
				this._animationScale.h = this._animationQueu[0].h;
				let cb = this._animationQueu[0].callBack;
				this._animationQueu.splice(0, 1);

				x = this._animationTranslation.x;
				y = this._animationTranslation.y;
				w = this._animationScale.w;
				h = this._animationScale.h;
				this._animation = {x:x,y:y,w:w,h:h};

				if(typeof cb === 'function') {
					let shouldBreak = cb(this);
					if(shouldBreak) {return true;}
				}
			}
			x = this._animationTranslation.x;
			y = this._animationTranslation.y;
			w = this._animationScale.w;
			h = this._animationScale.h;
			if(this._animationQueu.length > 0) {
				let p = this._animationQueu[0].percentToValue;
				x = this._animationQueu[0].x*p+this._animationTranslation.x*(1-p);
				y = this._animationQueu[0].y*p+this._animationTranslation.y*(1-p);
				w = this._animationQueu[0].w*p+this._animationScale.w*(1-p);
				h = this._animationQueu[0].h*p+this._animationScale.h*(1-p);
			}
		}
		translate(this.root.x,this.root.y);
		translate(x,y);
		scale(w,h);
		this._animation = {x:x,y:y,w:w,h:h};
		fill(this.drawSettings.fillColor);
		strokeWeight(this.drawSettings.stroke.weight);
		stroke(this.drawSettings.stroke.color);
		return false;
	}
	debugDraw() {
		push();
		rectMode(CORNER);
		stroke('#00ff00');
		strokeWeight(1);
		noFill();
		rect(0, 0, this.w, this.h);
		fill('#00ff00');
		textSize(12);
		textStyle(NORMAL);
		textAlign(LEFT, TOP);
		let mode = 'g';
		if (mode === 'p') {
			let w = this.parentSprite === undefined ? width : this.parentSprite.w;
			let h = this.parentSprite === undefined ? height : this.parentSprite.h;
			text(`(${((this.local.x) / w).toFixed(2) + '%'},${((this.local.y) / h).toFixed(2) + '%'})`, 0, 0);
			textAlign(CENTER, BOTTOM);
			text(((this.local.w) / w).toFixed(2) + '%', this.root.w / 2, this.root.h);
			textAlign(RIGHT, CENTER);
			text(((this.local.h) / h).toFixed(2) + '%', this.root.w, this.root.h / 2);
		} else if(mode === 'g') {
			let b = this.global;
			text(`(${(b.x).toFixed(2) + 'px'},${(b.y).toFixed(2) + 'px'})`, 0, 0);
			textAlign(CENTER, BOTTOM);
			text((b.w).toFixed(2) + 'px', this.root.w / 2, this.root.h);
			textAlign(RIGHT, CENTER);
			text((b.h).toFixed(2) + 'px', this.root.w, this.root.h / 2);
		}
		pop();
	}
	drawSubSprites() {
		for(let i =  this.subSprites.length-1; i >=0; i--) {
			if(this.subSprites[i] !== undefined) {
				this.subSprites[i].draw();
			} else {
				this.subSprites.splice(i,1);
			}
		}
		if(this.debug) {this.debugDraw();}
	}
	draw(){
		push();
		if(this.applyTransformations()) { //should break is returned
			pop();
			return;
		}
		d = this;
		rect(0,0,this.root.w,this.root.h,10);
		this.drawSubSprites();
		pop();
	}
	//------------------------------------------------------------------------------------------------- User Interaction
	touchEnded() {
		let didTap = ((mouseX >= this.global.x && mouseX <=  this.global.x+this.global.w) &&
			(mouseY >= this.global.y && mouseY <= this.global.y+this.global.h));
		for(let i =  this.subSprites.length-1; i >=0; i--) {
			if(this.subSprites[i] !== undefined) {
				this.subSprites[i].touchEnded();
			}
		}
		return didTap;
	}
	//------------------------------------------------------------------------------------------------------- Animations
	push(animationValue) {
		if(animationValue instanceof AnimationValue) {
			if(this._animationQueu.length > 0) {
				animationValue.startEpoch = this._animationQueu[this._animationQueu.length-1].endEpoch;
			}
			this._animationQueu.push(animationValue);
		}
	}
	flipHorizontally(callBack,time = 0) {
		let dir = -1;
		let x = 1;
		if(this._animationScale.w < 0) {
			x = -1;
			dir = 1;
		}
		this.push(new AnimationValue({
			x:this.animation.x+this.w*x,//Math.abs(this.animation.w)*this.w*x,
			y:this.animation.y,
			w:dir,//Math.abs(this.animation.w)*dir,
			h:this.animation.h,
			callBack:callBack,
			time:time,
		}));
	}
	moveToLocal(x=this.lastAnimation.x,y=this.lastAnimation.y,callBack,time=0){
		this.push(new AnimationValue({
			x:x,
			y:y,
			w:this.lastAnimation.w,
			h:this.lastAnimation.h,
			time:time,
			callBack:callBack
		}));
	}
	moveToGlobal(x=this.global.x,y=this.global.y,callBack,time=0){
		this.push(new AnimationValue({
			x:-this.global.x+x,
			y:-this.global.y+y,
			w:this.lastAnimation.w,
			h:this.lastAnimation.h,
			time:time,
			callBack:callBack
		}));
	}
	moveToSprite(sprite,callBack,time=0) {
		if(sprite !== undefined) {
			this.moveToGlobal(sprite.global.x, sprite.global.y, callBack, time);
		}
	}
	holdAnimation(callBack,time=0) {
		this.push(new AnimationValue({
			x:this.animation.x,
			y:this.animation.y,
			w:this.animation.w,
			h:this.animation.h,
			time:time,
			callBack:callBack
		}));
	}
	shrinkToNothing(time = 200,callBack) {
		this.push(new AnimationValue({
			x:this.local.x + this.w/2,
			y:this.local.y + this.h/2,
			w:0,
			h:0,
			time: time,
			callBack:callBack
		}));
	}
	//------------------------------------------------------------------------------------------------ Sprite Management
	addSubSprite(subSprite) {
		let length = this._subSprites.length;
		this._subSprites.pushIfNotExist(subSprite, function (existingSprite) {
			return subSprite === existingSprite;
		});
		if(this._subSprites.length != length) {
			subSprite._parentSprite = this;
		}
	}
	removeSubSprite(subSprite) {
		let index = this._subSprites.indexOf(subSprite);
		if(index >= 0 ) {
			subSprite._parentSprite = undefined;
			this._subSprites.splice(index,1);
		}
	}
}

