class Attack extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		this.name = '';
		this.category = 'flat';
		this.power = 0;
		this.speed = 0;
		this.id = json.id;
		this.loadJSON(json);
	}
	loadJSON(json){
		if(this.id !== json.id) {
			animations.attack.swapAttack(this,json);
		} else {
			this.name = json.name === undefined ? '' : json.name;
			this.category = json.category === undefined ? 'flat' : json.category;
			this.power = json.power === undefined ? 0 : json.power;
			this.speed = json.speed === undefined ? 0 : json.speed;
		}
	}


}