class Archetype {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.name = json.name === undefined ? "Knight" : json.name;
	}
	get json() {
		return {
			name: this.name,
		};
	}
}

module.exports = Archetype;