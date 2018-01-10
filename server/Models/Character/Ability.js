class Ability {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.name = json.name === undefined ? "Slash" : json.name;
		this.power = json.power === undefined ? 1 : json.power;
		this.speed = json.speed === undefined ? 1 : json.speed;
		this.stamina = json.stamina === undefined ? 1 : json.stamina;
		this.id = json.id === undefined ? "-1" : json.id;
	}
	get json() {
		return {
			name: this.name,
			id:this.id,
			speed:this.speed,
			stamina:this.stamina,
			power:this.power
		};
	}
}

module.exports = Ability;