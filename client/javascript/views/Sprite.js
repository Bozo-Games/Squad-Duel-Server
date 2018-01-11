let debugMode = 'g';
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

		//animations
		this.animation = {};//defaults to nothing but filles in the value so no undefineds later
		this.lastAnimationData = {x:0,y:0,w:1,h:1};
		this._isAnimating = false;
		this._animationFinishedCallBacks = [];
		//touch
		this.touchEnabled = true;
		checkJSONValue(this,json,'touchEnabled',['touchEnabled'],false);

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

		//client / data manangment
		SpriteFSM.initialize(this)
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
			x: this.root.x + this.lastAnimationData.x,
			y: this.root.y + this.lastAnimationData.y,
			w: this.root.w * this.lastAnimationData.w,
			h: this.root.h * this.lastAnimationData.h
		};
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
			b.w *= this.parentSprite.lastAnimationData.w;
			b.h *= this.parentSprite.lastAnimationData.h;
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
				sprite.x = (newRootW * sprite.x) / old;
			}
		}
		this.root.w = newRootW;
	}
	set h(newRootH) {
		let old = this.h;
		if(old !== 0) {
			for (let sprite of this.subSprites) {
				sprite.h = (newRootH * sprite.h) / old;
				sprite.y = (newRootH * sprite.y) / old;
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
	//--------------------------------------------------------------------------------------------- Animation Management
	set animation(newAnimation) {
		this._isAnimating = true;
		let la; //last animation value
		if(this.animation !== undefined) {
			if(this._onAnimationEnd !== undefined) {
				this._onAnimationEnd.off();
			}
			la = AnimationFSM.animationData(this.animation);
			AnimationFSM.forceEnd(this.animation);
		}
		newAnimation.sprite = this;
		AnimationFSM.initialize(newAnimation,la);
		this._animation = newAnimation;
		this._onAnimationEnd = AnimationFSM.on("animationDone",function (data) {
			if(data.instance.id === this.animation.id) {
				this._isAnimating = false;
				if(typeof this.animation.callBack === 'function'){
					this.animation.callBack();
				}
				for(let callBack of this._animationFinishedCallBacks) {
					callBack();
				}
				this._animationFinishedCallBacks = [];
			}
		}.bind(this))
	}
	addAnimationDoneCallBack(callBack) { //these will be removed once called
		if(this.isAnimating) {
			callBack();
		} else {
			this._animationFinishedCallBacks.push(callBack);
		}
	}
	//-------------------------------------------------------------------------------------------------- Data Management
	loadJSON(json) {
		SpriteFSM.loadJSON(this,json);
	}
	animate(json) {
		this.animation =  {
			startFrame:{t:500},
			keyFrames:[
				{w:0.8,h:.8,t:250},
				{w:1.2,h:1.2,t:250},
				{w:1,h:1,t:250}
			]};
		return this.animation;
	}
	get isAnimating() {
		let isAnimating = (AnimationFSM.currentState(this.animation) !== 'endFrame');
		for(let sprite of this.subSprites) {
			isAnimating = isAnimating || sprite.isAnimating;
		}
		return isAnimating;
	}
	get animationID() {
		return this.animation.id;
	}
	//---------------------------------------------------------------------------------------------------------- Drawing
	applyTransformations() {
		let ad = {x:0,y:0,w:1,h:1};
		if(this.animation !== undefined) {
			ad = AnimationFSM.animationData(this.animation,this);
		}
		rectMode(CENTER);
		translate(this.root.x,this.root.y);
		translate(ad.x,ad.y);
		scale(ad.w,ad.h);
		this.lastAnimationData = ad;
		fill(this.drawSettings.fillColor);
		strokeWeight(this.drawSettings.stroke.weight);
		stroke(this.drawSettings.stroke.color);
		return false;

	}
	debugDraw() {
		push();
		rectMode(CENTER);
		stroke('#00ff00');
		strokeWeight(1);
		noFill();
		rect(0, 0, this.w, this.h);
		fill('#00ff00');
		textSize(8);
		textStyle(NORMAL);
		textAlign(LEFT, TOP);
		if (debugMode === 'p') {
			let w = this.parentSprite === undefined ? width : this.parentSprite.w;
			let h = this.parentSprite === undefined ? height : this.parentSprite.h;
			textAlign(CENTER, CENTER);
			text(`(${((this.local.x) / w).toFixed(2) + '%'},${((this.local.y) / h).toFixed(2) + '%'})`, 0, 0);
			textAlign(LEFT, CENTER);
			text(((this.local.h) / w).toFixed(2) + '%', this.root.w / 2,0);
			textAlign(CENTER, BOTTOM);
			text(((this.local.w) / h).toFixed(2) + '%', 0, this.root.h / 2);
		} else if(debugMode === 'g') {
			let b = this.global;
			textAlign(CENTER, CENTER);
			text(`(${(b.x).toFixed(2) + 'px'},${(b.y).toFixed(2) + 'px'})`, 0, 0);
			textAlign(LEFT, CENTER);
			text((b.h).toFixed(2) + 'px', this.root.w / 2, 0);
			textAlign(CENTER, BOTTOM);
			text((b.w).toFixed(2) + 'px', 0, this.root.h / 2);
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
		rect(0,0,this.root.w,this.root.h,10);
		this.drawSubSprites();
		pop();
	}
	//------------------------------------------------------------------------------------------------- User Interaction
	touchEnded() {
		if(this.touchEnabled) {
			let didTap = ((mouseX >= this.global.x - this.global.w / 2 && mouseX <= this.global.x + this.global.w / 2) &&
				(mouseY >= this.global.y - this.global.h / 2 && mouseY <= this.global.y + this.global.h / 2));
			for (let i = this.subSprites.length - 1; i >= 0; i--) {
				if (this.subSprites[i] !== undefined) {
					this.subSprites[i].touchEnded();
				}
			}
			return didTap;
		}
		return false;
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

