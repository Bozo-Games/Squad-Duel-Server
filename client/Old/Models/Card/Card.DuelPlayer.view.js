class CardDuelPlayer extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);

		json.x = this.w*defaults.card.duel.player.characterScale.x;
		json.y = this.h*defaults.card.duel.player.characterScale.y;
		json.w = this.h*defaults.card.duel.player.characterScale.h;
		json.h = this.h*defaults.card.duel.player.characterScale.h;
		json.animation = {
			x: -json.x-json.w,
			y: json.h,
		};
		json.parentSprite = this;
		this.character = new CardDuelCharacter(json);

		json.x = this.w*defaults.card.duel.player.statBoxScale.x;
		json.y = this.h*defaults.card.duel.player.statBoxScale.y;
		json.w = this.w*defaults.card.duel.player.statBoxScale.w;
		json.h = this.h*defaults.card.duel.player.statBoxScale.h;
		json.animation = {
			x: -json.w-json.x,
			y: 0,
		};
		this.statsBox = new CardDuelStats(json);

		this.attacks = [];
		let h = this.h / (json.attacks.length+1); //1 for space,2 for lock in
		let spacing = h / (json.attacks.length+1);
		for(let i = 0; i < json.attacks.length; i++) {
			let attackJSON = json.attacks[i];
			let yy = spacing*(i+1) + h*(i);
			attackJSON.x = this.w*defaults.card.duel.player.attackScale.x;
			attackJSON.y = yy;
			attackJSON.w = this.w*defaults.card.duel.player.attackScale.w;
			attackJSON.h = h;
			attackJSON.animation = {
				x: this.w - (attackJSON.w-attackJSON.x ) ,
				y: 0,
			};
			attackJSON.parentSprite = this;
			let a = new AttackDuelPlayer(attackJSON);
			this.attacks.push(a);
			a.show();
		}
	}

	loadJSON(json) {
		let didLoad = super.loadJSON(json);
		if(didLoad) {
			if (this.character !== undefined) {
				this.character.loadJSON(json);
			}
			if(this.statsBox !== undefined) {
				this.statsBox.loadJSON(json);
			}
		}
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyTransformations();
			this.character.draw();
			this.statsBox.draw();
			this.attacks.forEach(function (attack) {
				attack.draw();
			});

			for(let sprite of this.subSprites) {
				if(sprite instanceof FloatingText) {
					sprite.draw();
				} else if(sprite instanceof CardDuelStats) {
					if(sprite !== this.statsBox){
						sprite.draw();
					}
				}
			}
			if(this.debug) {this.debugDraw()}
			pop();
		}
	}
	touchEnded() {
		let didTap = super.touchEnded();
	}
	//-------------------------------------------------------------------------- animations
	stateChangeAnimation(from,to,json) {
		return super.stateChangeAnimation(from, to, json);
	}

	hideUI() {
		this.attacks.forEach(function (attack) {
			attack.hide();
		});
		this.statsBox.hide();
	}
	showUI() {
		this.attacks.forEach(function (attack) {
			attack.show();
			animations.attack.showAttack(attack);
		});
		this.statsBox.show();
	}
}