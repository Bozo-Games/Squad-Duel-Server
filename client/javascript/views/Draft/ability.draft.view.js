class AbilityDraftView extends ArchetypeDraftView {
	constructor(json) {
		super(json);
	}

	touchEnded() {
		if(super.touchEnded()) {
			network.draftBenchAbility(this.id);
		}
	}
}