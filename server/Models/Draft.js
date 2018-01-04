const Generator = require('../Data/Generator.js');
class Draft {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.state = json.state === undefined ? "new" : json.state;

		if(this.state === 'new') {
			this.enterArchetypeSelect();
		}
	}
	get json() {
		return {
			state:this.state,
			archetype: this.archetype,
			currentOptions:this.currentOptions
		};
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
				console.log(index);
			}
		}
	}
}

module.exports = Draft;