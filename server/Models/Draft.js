const Generator = require('../Data/Generator.js');
class Draft {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.state = json.state === undefined ? "new" : json.state;
		this.abilites = 0;
		if(this.state === 'new') {
			this.enterArchetypeSelect();
		}
	}
	get json() {
		return {
			state:this.state,
			archetype: this.archetype,
			title:this.title,
			abilities: this.abilites,
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
				this.archetype = this.currentOptions[index];
				this.enterTitleSelect()
			} else if(this.state === 'titleSelect') {
				this.title = this.currentOptions[index];
				this.enterAbilitySelect()
			}
		}
	}
	//------------------------------------------------------------------------------------------------- Archetype Select
	enterArchetypeSelect() {
		this.state = 'archetypeSelect';
		this.currentOptions = [];
		while(this.currentOptions.length < 3) {
			let potential = Generator.archetypes[Math.floor(Math.random()*Generator.archetypes.length)];
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
			let potential = Generator.titles[Math.floor(Math.random()*Generator.titles.length)];
			potential.id = Generator.guid();
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
			let potential = Generator.abilities[Math.floor(Math.random()*Generator.abilities.length)];
			potential.id = Generator.guid();
			let shouldPush = false;
			for(let availible of potential.availability) {
				if(availible === '*') {
					shouldPush = true;
					break;
				} else {
					shouldPush = shouldPush || (this.title.name +' '+ this.archetype.name).includes(availible);
				}
			}
			if(shouldPush) {
				this.currentOptions.pushIfNotExist(potential, function (existing) {
					return potential.name === existing.name;
				});
			}
		}
	}
}

module.exports = Draft;