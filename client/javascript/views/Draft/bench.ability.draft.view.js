class BenchAbilityDraftView extends ArchetypeDraftView {
	constructor(json) {
		super(json);
	}

	touchEnded() {
		if(super.touchEnded()) {
			network.draftAbility(this.id);
		}
	}
}