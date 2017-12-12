class Card extends Sprite {
	constructor(json) {
		super();
		json = json === undefined ? {} : json;
		this.health = 0;
		this.armor = 0;
		this.forceDrawCancel = false;
		this.currentState = json.currentState;
		this.id = json.id;
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
			if(this.health !== json.health && (this.currentState === 'dueling' || this.currentState === 'lockedIn')) {
				this.addFloatingHealth(this.health,json.health);
			} else  {
				this.health = json.health;
			}
			if(this.armor !== json.armor && (this.currentState === 'dueling' || this.currentState === 'lockedIn')) {
				this.addFloatingArmor(this.armor,json.armor);
			} else {
				this.armor = json.armor;
			}
			this.speed = json.speed;
			if(this.attacks.length !== json.attacks.length) {
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
		let shouldExitDraw = super.applyActiveAnimations();
		if(shouldExitDraw) {
			pop();
			return true;
		}
		if(this.shouldDrawHand){
			this._inHandDraw();
		} else if(this.shouldDrawSelected) {
			this._selectedDraw();
		} else if(this.shouldDrawLockedIn) {
			this._lockedInDraw();
		} else if(this.shouldDrawDuel){
			this._duelDraw();
		} else if(this.shouldDrawOpp) {
			this._oppDraw();
		} else if(this.shouldDrawDueling) {
			this._duelingDraw();
		} else if(this.shouldDrawResults) {
			this._resultsDraw();
		}
		super.drawFloatingText();
		pop();
	}
	touchEnded(){
		if(this.shouldDrawHand){
			this._inHandTouchEnded();
		} else if(this.shouldDrawSelected) {
			this._selectedTouchEnded();
		} else if(this.shouldDrawLockedIn) {
			this._lockedInTouchEnded();
		} else if(this.shouldDrawDuel){
			this._selectAttackTouchEnded();
		}
	}
	get shouldDrawHand() {
		if(this.currentState === 'inHand') {
			return true;
		} else if(currentGame.currentState === 'cardSelectingStage') {
			if(currentGame.isOppCard(this.id)) {
				return true;
			} else {

			}
		}
		return false;
	}
	get shouldDrawSelected() {
		return this.currentState === 'selected' && currentGame.isPlayerCard(this.id);
	}
	get shouldDrawLockedIn() {
		return this.currentState === 'lockedIn' && currentGame.currentState === 'cardSelectingStage' && currentGame.isPlayerCard(this.id);
	}
	get shouldDrawDuel() {
		return this.currentState === 'lockedIn' && currentGame.currentState === 'attackSelectStage' && currentGame.isPlayerCard(this.id);
	}
	get shouldDrawOpp() {
		return this.currentState === 'lockedIn' && currentGame.currentState === 'attackSelectStage' && currentGame.isOppCard(this.id);
	}
	get shouldDrawDueling() {
		return (this.currentState === 'dueling' || this.currentState === 'lockedIn') && currentGame.currentState !== 'showingDuelResults';
	}
	get shouldDrawResults() {
		return (this.currentState === 'dueling' || this.currentState === 'lockedIn') && currentGame.currentState === 'showingDuelResults';
	}
	//------------------------------------------------------------------------------------------------add floating heath
	addFloatingHealth(oldHealthVale,newHealthValue) {
		let heathLoss = new FloatingText({
			text: `${newHealthValue - oldHealthVale}`,
			color:colors.card.health,
			size:20,
			halfLife: 1200
		});
		let card = this;
		heathLoss.activeAnimations = heathLoss.activeAnimations.concat(
			new TranslationAnimation(
				this._duelRect.w/2,
				0,
				this._duelRect.w/2+(Math.random()-Math.random())*this._duelRect.w/2,
				-this._duelRect.h/2,
				1000,function (text) {
				card.health = newHealthValue;
			})
		);
		this.floatingText = this.floatingText.concat(heathLoss);
	}
	addFloatingArmor(oldArmorVale,newArmorValue) {
		let armorLoss = new FloatingText({
			text: `${newArmorValue - oldArmorVale}`,
			color:colors.card.armor,
			size:20,
			halfLife: 1200
		});
		let card = this;
		armorLoss.activeAnimations = armorLoss.activeAnimations.concat(
			new TranslationAnimation(
				this._duelRect.w,
				this._duelRect.h/2,
				this._duelRect.w/2+(Math.random()-Math.random())*this._duelRect.w/2,
				-this._duelRect.h/2,
				1000,function (text) {
					card.armor = newArmorValue;
				})
		);
		this.floatingText = this.floatingText.concat(armorLoss);
	}
	//---------------------------------------------------------------------------------------------------- Results Stats
	_resultsDraw() {
		let statXoff = this._duelRect.w*1.1;
		push();
		if(currentGame.isOppCard(this.id)) {
			translate(this._duelRect.w,0);
			scale(-1,1);
			statXoff = -statXoff;
		}
		if(this.currentState === 'dead') {
			image(icons.card[this.name].dead,
				0,
				0,
				this._duelRect.w,
				this._duelRect.h);
		} else {
			this._dudeDraw();
		}
		pop();
		//current State
		push();
		translate(statXoff,(this._duelRect.h-defaults.card.selected.icon.size.height()*3.6) /2);
		this._duelStatsBoxDraw(savePlayerCardStartJSON);
		translate(defaults.card.selected.icon.size.width()*2.7,0);
		fill(colors.card.text);
		text("->",0,defaults.card.selected.icon.size.height()*3.6/2);
		translate(textWidth(" -> "),0);
		this._duelStatsBoxDraw(this);
		pop();
	}
	//----------------------------------------------------------------------------------------------------- dueling Draw
	_duelingDraw() {
		if(currentGame.isPlayerCard(this.id)) {
			this._dudeDraw();
		} else  {
			push();
				translate(this._duelRect.w,0);
				scale(-1,1);
				this._dudeDraw();
			pop();
		}
	}
	//---------------------------------------------------------------------------------------------------- select attack
	_selectAttackTouchEnded() {
		pushMouse();
		if(this.attacks.length > 0) {
			let didTap = collidePointRect(
				mouseX,mouseY,
				this._duelAttack0Bounds.x,this._duelAttack0Bounds.y,this._duelAttack0Bounds.w,this._duelAttack0Bounds.h);
			if(didTap) {
				network.selectAttack(this.attacks[0].id);
				popMouse();
				return true;
			}
		}
		if(this.attacks.length > 1) {
			let didTap = collidePointRect(
				mouseX,mouseY,
				this._duelAttack1Bounds.x,this._duelAttack1Bounds.y,this._duelAttack1Bounds.w,this._duelAttack1Bounds.h);
			if(didTap) {
				network.selectAttack(this.attacks[1].id);
				popMouse();
				return true;
			}
		}

		popMouse();

	}
	//--------------------------------------------------------------------------------------------------------- opp
	get _oppRect() {
		return this._duelRect;
	}
	get _oppAttack0Bounds() {
		return {
			x:this._oppRect.x - (1.05*this._duelAttack0Bounds.w),
			y:this._duelAttack0Bounds.y,
			w:this._duelAttack0Bounds.w,
			h:this._duelAttack0Bounds.h
		};
	}
	get _oppAttack1Bounds() {
		return {
			x:this._oppRect.x - (1.05*this._duelAttack1Bounds.w),
			y:this._duelAttack1Bounds.y,
			w:this._duelAttack1Bounds.w,
			h:this._duelAttack1Bounds.h
		};
	}
	_oppDraw() {
		push();
			translate(this._duelRect.w,0);
			scale(-1,1);
			this._dudeDraw();
		pop();
		push();
			translate(this._duelRect.w*0.75,0);
			this._duelStatsBoxDraw(this);
		pop();
		//Attacks
		if(this.attacks.length > 0) {
			this.attacks[0].duelDraw(this._oppAttack0Bounds);
		}
		if(this.attacks.length > 1) {
			this.attacks[1].duelDraw(this._oppAttack1Bounds);
		}
	}
	//--------------------------------------------------------------------------------------------------------- Duel
	get _duelRect() {
		return {
			x:0,
			y:0,
			w:defaults.card.selected.size.width(),
			h:defaults.card.selected.size.height()}
	}
	get _duelAttack0Bounds() {
		return {
			x:this._selectedLockInBounds.x,
			y:this._duelRect.y+this._duelRect.h*0.33,
			w:this._selectedLockInBounds.w,
			h:this._selectedLockInBounds.h
		};
	}
	get _duelAttack1Bounds() {
		return {
			x:this._selectedLockInBounds.x,
			y:this._duelRect.y+this._duelRect.h*0.66,
			w:this._selectedLockInBounds.w,
			h:this._selectedLockInBounds.h
		};
	}
	_dudeDraw() {
		push();
		let frame = frameCount % icons.card[this.name][this.loop].length;
		image(icons.card[this.name][this.loop][frame],
			0,
			0,
			this._duelRect.w,
			this._duelRect.h);
		pop();
	}
	_duelStatsBoxDraw(data) {
		let iconRect = {
			w: defaults.card.selected.icon.size.width(),
			h: defaults.card.selected.icon.size.width(),
		};
		fill(colors.card.inHand.background);
		rect(
			-iconRect.w*0.2,
			-iconRect.h*0.2,
			iconRect.w*2.5,
			iconRect.h*3.6,
			4);
		fill(colors.card.text);
		textSize(iconRect.h*0.8);
		textAlign(LEFT,TOP);
		//health
		tint(colors.card.health);
		image(icons.card.health,
			0,0,
			iconRect.w,
			iconRect.h);
		text(data.health,
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
		text(data.armor,
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
		text(data.speed,
			iconRect.w*1.1,
			iconRect.h*2.2,
			iconRect.w,
			iconRect.h);
	}
	_duelDraw() {
		push();
		this._dudeDraw();
		this._duelStatsBoxDraw(this);
		//Attacks
		if(this.attacks.length > 0) {
			this.attacks[0].duelDraw(this._duelAttack0Bounds);
		}
		if(this.attacks.length > 1) {
			this.attacks[1].duelDraw(this._duelAttack1Bounds);
		}
		pop();
	}
	//-------------------------------------------------------------------------------------------------------- Locked In
	get _selectedLockedInBounds() {
		return this._selectedLockInBounds;
	}
	_lockedInTouchEnded() {
		pushMouse();

		popMouse();
	}
	_lockedInDraw(){
		push();
		this._duelDraw();
		//locked in statment
		fill(colors.card.selected.lockedIn);
		let bounds =this._selectedLockInBounds;
		rect(bounds.x,bounds.y,bounds.w,bounds.h,4);
		textAlign(CENTER,CENTER);
		fill(colors.card.text)
		textSize(bounds.h*0.8);
		text(strings.card.selected.lockedIn,
			bounds.x,bounds.y,bounds.w,bounds.h);
		pop();
	}
	//--------------------------------------------------------------------------------------------------------- Selected
	get _selectedLockInBounds() {
		return {
			x:this._duelRect.x+this._duelRect.w*1.05,
			y:this._duelRect.y+this._duelRect.h*0.0,
			w:this._duelRect.w*1.2,
			h:this._duelRect.h*0.3
		};
	}
	_selectedTouchEnded() {
		pushMouse();
		let didTap = collidePointRect(
			mouseX,mouseY,
			this._selectedLockInBounds.x,this._selectedLockInBounds.y,this._selectedLockInBounds.w,this._selectedLockInBounds.h);
		if(didTap) {
			network.lockIn(this.id);
		}
		popMouse();
	}
	_selectedDraw() {
		push();
		this._duelDraw();
		//locked in statment
		fill(colors.card.selected.lockIn);
		let bounds =this._selectedLockInBounds;
		rect(bounds.x,bounds.y,bounds.w,bounds.h,4);
		textAlign(CENTER,CENTER);
		fill(colors.card.text)
		textSize(bounds.h*0.8);
		text(strings.card.selected.lockIn,
			bounds.x,bounds.y,bounds.w,bounds.h);
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
			let bounds = {
				x:this._handRect.x-this._handRect.w*0.05,
				y:this._handRect.y + this._handRect.w * 0.65,
				w:this._handRect.w*iconScale,
				h:this._handRect.h*iconScale
				};
			this.attacks[0].handDraw(bounds);
		}
		if(this.attacks.length > 1) {
			let bounds = {
				x:this._handRect.x + this._handRect.w*0.65,
				y:this._handRect.y + this._handRect.w * 0.65,
				w:this._handRect.w*iconScale,
				h:this._handRect.h*iconScale
			};
			this.attacks[1].handDraw(bounds);
		}
		pop();
	}
}