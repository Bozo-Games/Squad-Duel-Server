const FieldSection = require('./FieldSection.js');

class Field {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.benchA = new FieldSection(json.benchA);
		this.sideA = new FieldSection(json.sideA);
		this.middle = new FieldSection(json.middle);
		this.sideB = new FieldSection(json.sideB);
		this.benchB = new FieldSection(json.sideB);
	}
	get json() {
		return {
			benchA: this.benchA.json,
			benchB: this.benchB.json,
			sideA: this.sideA.json,
			sideB: this.sideB.json,
			middle: this.middle.json
		};
	}
}

module.exports = Field;