class CharacterView extends Sprite {
	constructor(json) {
		super(json);
		this.name = json.name === undefined ? '' : json.name;
	}
	animate(json) {
		this.id = json.id;
		this.name = json.name;
		if(json.state === 'new' && this.constructor.name !== 'WanderCharacterView'){
			console.log(this.constructor.name);
			let newView = new WanderCharacterView({
				x: this.root.x,
				y: this.root.y,
				w: this.root.w,
				h: this.root.h,
			});
			this.parentSprite.swapSprite(this, newView);
			newView.loadJSON(json);
		}

		this.state = json.state;
	}
}