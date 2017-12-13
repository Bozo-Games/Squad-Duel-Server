class Card extends Sprite {
	constructor(json) {
		super({
			bounds:{
				x:0,
				y:0,
				w:100,
				h:100
			}
		});
		json = json === undefined ? {} : json;
		this.health = 0;
		this.armor = 0;
		this.currentState = json.currentState;
		this.id = json.id;
		this.attacks = [];
		this.loop = 'idle';
		this.loadJSON(json);
	}
	loadJSON(json) {
		if(this.currentState !== json.currentState) {
			if(animations.game[this.currentState + '->'+json.currentState] !== undefined) {
				animations.game[this.currentState + '->'+json.currentState](this,json);
			} else {
				console.log('Unknown Card state has changed '+this.currentState + '->'+json.currentState);
				this.currentState = json.currentState;
				this.loadJSON(json);
			}
		} else {
			this.name = json.name === undefined ? 'Adventuring_Barbarian' : json.name;
		}
	}

}