animations.attack = {

	swapAttack: function (attack,json) {
		if(attack instanceof AttackDuelPlayer) {
			attack.hide(function (attack) {
				attack.id = json.id;
				attack.loadJSON(json);
				attack.show(undefined,1000);
			})
		} else {
			attack.id = json.id;
			attack.loadJSON(json);
		}
	},
	attackNameSlide(attack,isLeftRight) {
		let from = {x:-attack.bounds.w,y:0};
		let to = {x:attack.bounds.w,y:0};
		if(!isLeftRight) {
			from = {x:attack.bounds.w,y:0};
			to = {x:-attack.bounds.w,y:0};

		}
		attack.translationAnimation.forceUpdate(from);
		attack.translationAnimation.appendKeyValue(new KeyValue({
			val: {x:0,y:0},
			endEpoch: frameTime + 200,
			callBack: function (attack) {
				attack.translationAnimation.appendKeyValue(new KeyValue({
					val: {x:0,y:0},
					endEpoch: frameTime + 800,
					callBack: function (attack) {
						attack.translationAnimation.appendKeyValue(new KeyValue({
							val: to,
							endEpoch: frameTime + 200,
							callBack: function (attack) {

							}
						}));
					}
				}));
			}
		}));
	}
};