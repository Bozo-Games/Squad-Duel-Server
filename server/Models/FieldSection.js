class FieldSection {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.biome = json.biome ===  undefined ? 'grass' : json.biome;
	}
	get json() {
		return  {
			biome: this.biome
		}
	}
}
module.exports = FieldSection;