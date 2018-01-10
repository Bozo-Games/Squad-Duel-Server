class PlayerBenchCharacterView extends CharacterView {
	constructor(json) {
		super(json);
	}

	draw() {
		push();
		super.applyTransformations();

		pop();
	}
}