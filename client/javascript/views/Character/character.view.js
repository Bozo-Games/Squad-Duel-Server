class CharacterView extends Sprite {
	constructor(json) {
		super(json);
		this.name = json.name === undefined ? '' : json.name;
	}
	animate(json) {
		this.id = json.id;
		this.name = json.name;
	}
}