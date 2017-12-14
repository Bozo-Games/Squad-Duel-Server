class Card extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.bounds = json.bounds === undefined ? {x:0,y:0,w:100,h:100} : json.bounds;
		super(json);
		this.health = 20;
		this.armor = 10;
		this.currentState = 'inHand';
		this.id = json.id;
		this.attacks = [];
		this.name = json.name === undefined ? 'Adventuring_Barbarian' : json.name;
		this.loop = 'idle';
		this.loadJSON(json);
	}
	loadJSON(json) {
		if(this.id !== json.id) {
			animations.card.swapCard(this,json);
		} else {
			if (this.currentState !== json.currentState) {
				if (animations.card[this.currentState + '->' + json.currentState] !== undefined) {
					animations.card[this.currentState + '->' + json.currentState](this, json);
				} else {
					this.currentState = json.currentState;
					this.loadJSON(json);
				}
			} else {
				this.name = json.name === undefined ? 'Adventuring_Barbarian' : json.name;
				this.armor = json.armor === undefined ? 1 : json.armor;
				this.health = json.health === undefined ? 1 : json.health;
				for(let i = 0; i < json.attacks.length; i++) {
					if(this.attacks[i] === undefined) {
						this.attacks[i] = new Attack(json.attacks[i]);
					} else {
						this.attacks[i].loadJSON(json.attacks[i]);
					}
				}
			}
		}
	}
	hasAttack(attackID) {
		for(let i =0; i < this.attacks.length; i++) {
			if(this.attacks[i].id === attackID) {
				return true;
			}
		}
		return false;
	}

}