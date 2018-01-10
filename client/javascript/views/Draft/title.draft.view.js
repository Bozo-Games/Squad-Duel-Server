class TitleDraftView extends ArchetypeDraftView {
	constructor(json) {
		super(json);
	}

	touchEnded() {
		if(super.touchEnded()) {
			network.draftTitle(this.id);
		}
	}
}