const Archetype = require('./Archetype.js');
const Title = require('./Title.js');
const Ability = require('./Ability.js');
const BenchAbility = require('./BenchAbility.js');

class Character {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.name = json.name;
		this.archetype = new Archetype(json.archetype);
		this.title = new Title(json.title);
		this.abilities =[];
		for(let a of json.abilities) {
			this.abilities.push(new Ability(a));
		}
		this.benchAbility = new BenchAbility(json.benchAbility);
	}
	get json() {
		return {

		};
	}
}

module.exports = Character;