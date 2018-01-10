class Title {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.name = json.name === undefined ? "Arcane" : json.name;
		this.id = json.id ===  undefined ? -1 : json.id;
		this.health = json.health === undefined ? 10 : json.health;
		this.armor = json.armor === undefined ? 0 : json.armor;
		this.power = json.power === undefined ? 2 : json.power;
		this.speed = json.speed === undefined ? 1 : json.speed;
		this.stamina = json.stamina === undefined ? 5 : json.stamina;
	}
	get json() {
		return {
			id:this.id,
			name: this.name,
			health:this.health,
			armor: this.armor,
			speed: this.speed,
			stamina: this.stamina
		};
	}
}

module.exports = Title;