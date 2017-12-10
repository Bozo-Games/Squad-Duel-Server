class Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.currentState = json.currentState;
		this.id = json.id;
		this.activeAnimations = [];
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
		}
	}
	draw() {
		push();
		let i = 0;
		while(i < this.activeAnimations.length && i >= 0) {
			this.activeAnimations[i].applyEffect();
			if(this.activeAnimations[i].isDone) {

				this.activeAnimations[i].callBack(this); //here look at this we ar missing somthing about scope
				this.activeAnimations.splice(i,1);
				i --;
			} else {
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
		return {x:0,
			y:0,
			w:defaults.card.inHand.size.width(),
			h:defaults.card.inHand.size.height()}
	}
	_selectedDraw() {
		push();
		let frame = frameCount % icons.card[this.name][this.loop].length;
		image(icons.card[this.name][this.loop][frame],
			0,
			0,
			this._selectedRect.w,
			this._selectedRect.h);
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
		image(icons.card.character[this.name],
			this._handRect.x+this._handRect.w*0.05,
			this._handRect.y+this._handRect.h*0.05,
			this._handRect.w*0.9,
			this._handRect.h*0.9);
		//health
		tint(colors.card.inHand.health);
		image(icons.card.health,
			this._handRect.x-this._handRect.w*0.05,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*0.4,
			this._handRect.h*0.4);
		textAlign(CENTER,CENTER);
		text(this.health,
			this._handRect.x-this._handRect.w*0.05,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*0.4,
			this._handRect.h*0.4);
		//armor
		tint(colors.card.inHand.armor);
		image(icons.card.armor,
			this._handRect.x+this._handRect.w*0.65,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*0.4,
			this._handRect.h*0.4);
		text(this.armor,
			this._handRect.x+this._handRect.w*0.65,
			this._handRect.y-this._handRect.w*0.05,
			this._handRect.w*0.4,
			this._handRect.h*0.4);
		pop();
	}
}