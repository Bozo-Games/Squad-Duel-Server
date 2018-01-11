const Archetype = require('./Archetype.js');
const Title = require('./Title.js');
const Ability = require('./Ability.js');
const BenchAbility = require('./BenchAbility.js');
const Generator = require('../../Data/Generator.js');
class Character {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.id = Generator.guid();
		this.name = json.name;
		this.archetype = new Archetype(json.archetype);
		this.title = new Title(json.title);
		this.abilities =[];
		for(let a of json.abilities) {
			this.abilities.push(new Ability(a));
		}
		this.benchAbility = new BenchAbility(json.benchAbility);
		this.state = 'new';
	}
	get json() {
		return {
			id:this.id,
			name: this.title.name + ' ' +this.archetype.name,
			state: this.state,
		};
	}
}

module.exports = Character;