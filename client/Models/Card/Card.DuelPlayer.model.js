class CardDuelPlayer extends Card {
	constructor(json) {
		console.log('0')
		json = json === undefined ? {} : json;
		json.strokeWeight = 1;
		json.bounds = json.bounds === undefined ? {x:0,y:0,w:100,h:100} : json.bounds;
		super(json);
		json.bounds = {
			x: this.bounds.w*defaults.card.duel.player.characterScale.x,
			y: this.bounds.h*defaults.card.duel.player.characterScale.y,
			w: this.bounds.h*defaults.card.duel.player.characterScale.h,
			h: this.bounds.h*defaults.card.duel.player.characterScale.h
		};
		json.parentSprite = this;
		this.character = new CardDuelCharacter(json);

		console.log(this.character);
	}
	loadJSON(json) {
		super.loadJSON(json);
		if(this.character !== undefined){this.character.loadJSON(json);}
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyAnimations();
			this.character.draw();
			pop();
		}
	}
}