const Archetype = require('./Archetype.js');
class Character {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.name = json.name;
		this.archetype = new Archetype(json.archetype);
	}
	get json() {
		return {};
	}
}

module.exports = Character;