animations.attack = {
	newAttack: function (attack) {
		attack.translationAnimation.appendKeyValue(new KeyValue({
			val:{
				x:attack.parentSprite.bounds.w*defaults.card.duel.player.attackScale.x,
				y:attack.translationAnimation.y
			},
			endEpoch: frameTime+400,
			callBack:function (attack) {

			}
		}));
	},
	hideAttack: function (attack) {
		if(attack instanceof AttackDuelPlayer) {
			attack.translationAnimation.appendKeyValue(new KeyValue({
				val:{
					x:attack.translationAnimation.x + attack.bounds.w*1.2,
					y:attack.translationAnimation.y
				},
				endEpoch: frameTime+400,
				callBack: function (attack) {}
			}));
		}
	},
	swapAttack: function (attack,json) {
		if(attack.constructor.name === 'AttackDuelPlayer') {
			attack.translationAnimation.appendKeyValue(new KeyValue({
				val:{
					x:attack.translationAnimation.x + attack.bounds.w*1.2,
					y:attack.translationAnimation.y
				},
				endEpoch: frameTime+400,
				callBack: function (attack) {
					attack.id = json.id;
					attack.loadJSON(json);
				}
			}));
			attack.translationAnimation.appendKeyValue(new KeyValue({
				val:{
					x:attack.translationAnimation.x + attack.bounds.w*1.2,
					y:attack.translationAnimation.y
				},
				endEpoch: frameTime+1500,
				callBack:function (attack) {
					animations.attack.newAttack(attack);
				}
			}));
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
					endEpoch: frameTime + 400,
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