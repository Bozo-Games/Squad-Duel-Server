const Generator = require('../Data/Generator.js');
const Title = require('./Character/Title.js');
const Archetype = require('./Character/Archetype.js');
const Ability = require('./Character/Ability.js');
const BenchAbility = require('./Character/BenchAbility.js');

class Draft {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.state = json.state === undefined ? "new" : json.state;
		this.abilites = [];
		this.currentOptions = [];
		if(this.state === 'new') {
			this.enterArchetypeSelect();
		} else if(this.state === 'archetypeSelect') {
			for(let co of json.currentOptions) {
				this.currentOptions.push(new Archetype(co));
			}
		} else if(this.state === 'titleSelect') {
			this.archetype = new Archetype(json.archetype);
			for (let co of json.currentOptions) {
				this.currentOptions.push(new Title(co));
			}
		} else if(this.state ===  'abilitySelect') {
			this.archetype = new Archetype(json.archetype);
			this.title = new Title(json.title);
			for (let a of json.abilities) {
				this.abilites.push(new Ability(a));
			}
			for (let co of json.currentOptions) {
				this.currentOptions.push(new Ability(co));
			}
		} else if(this.state === 'benchAbilitySelect') {
			this.archetype = new Archetype(json.archetype);
			this.title = new Title(json.title);
			for (let a of json.abilities) {
				this.abilites.push(new Ability(a));
			}
			for (let co of json.currentOptions) {
				this.currentOptions.push(new BenchAbility(co));
			}
		} else {
			this.archetype = new Archetype(json.archetype);
			this.title = new Title(json.title);
			for (let a of json.abilities) {
				this.abilites.push(new Ability(a));
			}
			this.benchAbility = new BenchAbility(json.benchAbility);
		}
	}
	get json() {
		return {
			state:this.state,
			archetype: this.archetype === undefined ? undefined : this.archetype.json,
			title:this.title === undefined ? undefined : this.title.json,
			abilities: this.abilites.toBozoJSON(),
			benchAbility: this.benchAbility === undefined ? undefined : this.benchAbility.json,
			currentOptions:this.currentOptions
		};
	}
	selectOption(optionID) {
		let index = 0;
		if(this.currentOptions.inArray(function (option) {
				if(option.id === optionID) {
					return true;
				}
				index++;
				return false;})) {
			if(this.state === 'archetypeSelect') {
				this.archetype = new Archetype( this.currentOptions[index]);
				this.enterTitleSelect()
			} else if(this.state === 'titleSelect') {
				this.title = new Title(this.currentOptions[index]);
				this.enterAbilitySelect()
			}else if(this.state === 'abilitySelect') {
				this.abilites.push(new Ability(this.currentOptions[index]));
				if(this.abilites.length < 2) {
					this.enterAbilitySelect()
				} else  {
					this.enterBenchAbilitySelect();
				}
			} else if(this.state === 'benchAbilitySelect') {
				this.benchAbility = new BenchAbility(this.currentOptions[index]);
				this.enterFinished();
			}
		}
	}
	//------------------------------------------------------------------------------------------------- Archetype Select
	enterArchetypeSelect() {
		this.state = 'archetypeSelect';
		this.currentOptions = [];
		while(this.currentOptions.length < 3) {
			let potential = Generator.archetype();
			potential.id = Generator.guid();
			this.currentOptions.pushIfNotExist(potential,function (existing) {
				return potential.name === existing.name;
			});
		}
	}
	//----------------------------------------------------------------------------------------------------- Title Select
	enterTitleSelect() {
		this.state = 'titleSelect';
		this.currentOptions = [];
		while(this.currentOptions.length < 3) {
			let potential = Generator.title();
			potential.id = potential.id === undefined ? Generator.guid() : potential.id;
			this.currentOptions.pushIfNotExist(potential,function (existing) {
				return potential.name === existing.name;
			});
		}
	}
	//--------------------------------------------------------------------------------------------------- Ability Select
	enterAbilitySelect() {
		this.state = 'abilitySelect';
		this.currentOptions = [];
		while(this.currentOptions.length < 3) {
			let potential = Generator.ability();
			potential.id = potential.id === undefined ? Generator.guid() : potential.id;
			let shouldPush = false;
			for(let availible of potential.availability) {
				if(availible === '*') {
					shouldPush = true;
					break;
				} else {
					shouldPush = shouldPush || (this.title.name +' '+ this.archetype.name).includes(availible);
				}
			}
			for(let a of this.abilites) {
				shouldPush = shouldPush && a.name !== potential.name;
			}
			if(shouldPush) {
				this.currentOptions.pushIfNotExist(potential, function (existing) {
					return potential.name === existing.name;
				});
			}
		}
	}
	//----------------------------------------------------------------------------------------------Bench Ability Select
	enterBenchAbilitySelect() {
		this.state = 'benchAbilitySelect';
		this.currentOptions = [];
		while(this.currentOptions.length < 3) {
			let potential = Generator.benchAbility();
			potential.id = potential.id === undefined ? Generator.guid() : potential.id;
			let shouldPush = false;
			for(let availible of potential.availability) {
				if(availible === '*') {
					shouldPush = true;
					break;
				} else {
					shouldPush = shouldPush || (this.title.name +' '+ this.archetype.name).includes(availible);
				}
			}
			for(let a of this.abilites) {
				shouldPush = shouldPush || a.name !== potential.name;
			}
			if(shouldPush) {
				this.currentOptions.pushIfNotExist(potential, function (existing) {
					return potential.name === existing.name;
				});
			}
		}
	}
	//------------------------------------------------------------------------------------------------------------ final
	enterFinished() {
		this.state = 'finished';
		this.currentOptions = [];
	}
}

module.exports = Draft;