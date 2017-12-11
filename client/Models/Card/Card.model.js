class Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.forceDrawCancel = false;
		this.currentState = json.currentState;
		this.id = json.id;
		this.activeAnimations = [];
		this.attacks = [];
		this.loop = 'idle';
		this.loadJSON(json);
	}
	loadJSON(json) {
		if(this.currentState !== json.currentState) {
			let animation;
			if(animations.card[`${this.currentState}->${json.currentState}`] !== undefined) {
				animation = animations.card[`${this.currentState}->${json.currentState}`](this, function (card) {
					card.currentState = json.currentState;
					card.loadJSON(json);
					card.forceDrawCancel = true;
				});
			}
			if(animation !== undefined) {
				this.activeAnimations = this.activeAnimations.concat(animation);
			} else {
				this.currentState = json.currentState;
				this.loadJSON(json);
			}
		} else {
			this.name = json.name;
			this.health = json.health;
			this.armor = json.armor;
			this.speed = json.speed;
			if(this.attacks.length != json.attacks.length) {
				let attacks = [];
				for(let i = 0; i < json.attacks.length; i++) {
					attacks.push(new Attack(json.attacks[i]));
				}
				this.attacks = attacks;
			} else {
				for(let i = 0; i < json.attacks.length; i++) {
					this.attacks[i].loadJSON(json.attacks[i]);
				}
			}
		}
	}
	draw() {
		push();
		let i = 0;
		while(i < this.activeAnimations.length && i >= 0) {
			if(this.activeAnimations[i].isDone) {
				this.activeAnimations[i].callBack(this); //here look at this we ar missing somthing about scope
				this.activeAnimations.splice(i,1);
				pop();
				if(this.forceDrawCancel) {
					this.forceDrawCancel = false;
					return true;
				}
				push();
				i = 0;
			} else {
				this.activeAnimations[i].applyEffect();
				i++;
			}
		}
		if(this.currentState === 'inHand' || (this.currentState === 'selected' && !currentGame.isPlayerCard(this.id))){
			this._inHandDraw();
		} else if(this.currentState === 'selected') {
			this._selectedDraw();
		}
		pop();
	}
	touchEnded(){
		if(this.currentState === 'inHand') {
			this._inHandTouchEnded();
		}
	}
	//--------------------------------------------------------------------------------------------------------- Selected
	get _selectedRect() {
		return {
			x:0,
			y:0,
			w:defaults.card.selected.size.width(),
			h:defaults.card.selected.size.height()}
	}
	_selectedDraw() {
		push();
		let frame = frameCount % icons.card[this.name][this.loop].length;
		image(icons.card[this.name][this.loop][frame],
			0,
			0,
			this._selectedRect.w,
			this._selectedRect.h);

		let iconRect = {
			w: defaults.card.selected.icon.size.width(),
			h: defaults.card.selected.icon.size.width(),
		};
		fill(colors.card.text);
		textSize(iconRect.h*0.8);
		textAlign(LEFT,TOP);
		//health
		tint(colors.card.health);
		image(icons.card.health,
			0,0,
			iconRect.w,
			iconRect.h);
		text(this.health,
			iconRect.w*1.1,
			0,
			iconRect.w,
			iconRect.h);

		//armor
		tint(colors.card.armor);
		image(icons.card.armor,
			0,
			iconRect.h*1.1,
			iconRect.w,
			iconRect.h);
		text(this.armor,
			iconRect.w*1.1,
			iconRect.h*1.1,
			iconRect.w,
			iconRect.h);

		//speed
		tint(colors.card.speed);
		image(icons.card.speed,
			0,
			iconRect.h*2.2,
			iconRect.w,
			iconRect.h);
		text(this.speed,
			iconRect.w*1.1,
			iconRect.h*2.2,
			iconRect.w,
			iconRect.h);
		//Attacks
		if(this.attacks.length > 0) {
			let rect = {
				x:this._selectedRect.x+this._selectedRect.w*1.05,
				y:this._selectedRect.y+this._selectedRect.h*0.30,
				w:this._selectedRect.w*0.9,
				h:this._selectedRect.h*0.2
			};
			this.attacks[0].duelDraw(rect);
		}
		if(this.attacks.length > 1) {
			let rect = {
				x:this._selectedRect.x+this._selectedRect.w*1.05,
				y:this._selectedRect.y+this._selectedRect.h*0.30,
				w:this._selectedRect.w*0.9,
				h:this._selectedRect.h*0.2
			};
			this.attacks[1].duelDraw(rect);
		}

		pop();
	}
	//----------------------------------------------------------------------------------------------------------- inHand
	get _handRect() {
		return {x:0,
			y:0,
			w:defaults.card.inHand.size.width(),
			h:defaults.card.inHand.size.height()}
	}
	_inHandTouchEnded(){
		pushMouse();
		let didTap = collidePointRect(
			mouseX,mouseY,
			this._handRect.x,this._handRect.y,this._handRect.w,this._handRect.h);
		if(didTap) {
			network.selectCard(this.id);
		}
		popMouse();
	}
	_inHandDraw() {
		push();
		fill(colors.card.inHand.background);
		ellipseMode(CORNER);
		ellipse(this._handRect.x,this._handRect.y,this._handRect.w,this._handRect.h);
		let iconScale = defaults.card.inHand.iconScale;
		image(icons.card.character[this.name],
			this._handRect.x+this._handRect.w*0.05,
			this._handRect.y+this._handRect.h*0.05,
			this._handRect.w*0.9,
			this._handRect.h*0.9);
		//health
		tint(colors.card.health);
		image(icons.card.health,
			this._handRect.x-this._handRect.w*0.05,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*iconScale,
			this._handRect.h*iconScale);
		textAlign(CENTER,CENTER);
		text(this.health,
			this._handRect.x-this._handRect.w*0.05,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*iconScale,
			this._handRect.h*iconScale);
		//armor
		tint(colors.card.armor);
		image(icons.card.armor,
			this._handRect.x+this._handRect.w*0.65,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*iconScale,
			this._handRect.h*iconScale);
		text(this.armor,
			this._handRect.x+this._handRect.w*0.65,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*iconScale,
			this._handRect.h*iconScale);

		if(this.attacks.length > 0) {
			let rect = {
				x:this._handRect.x-this._handRect.w*0.05,
				y:this._handRect.y + this._handRect.w * 0.65,
				w:this._handRect.w*iconScale,
				h:this._handRect.h*iconScale
				};
			this.attacks[0].handDraw(rect);
		}
		if(this.attacks.length > 1) {
			let rect = {
				x:this._handRect.x + this._handRect.w*0.65,
				y:this._handRect.y + this._handRect.w * 0.65,
				w:this._handRect.w*iconScale,
				h:this._handRect.h*iconScale
			};
			this.attacks[1].handDraw(rect);
		}
		pop();
	}
}