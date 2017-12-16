animations.attack = {
	hideAttack: function (attack,callBack) {
		if(attack instanceof AttackDuelPlayer) {
			attack.translationAnimation.appendKeyValue(new KeyValue({
				val:{
					x:attack.bounds.w*1.2,
					y:0
				},
				endEpoch: frameTime+400,
				callBack: callBack
			}));
		}
	},
	showAttack: function (attack,callBack) {
		if(attack instanceof AttackDuelPlayer) {
			attack.translationAnimation.appendKeyValue(new KeyValue({
				val:{
					x:0,
					y:0
				},
				endEpoch: frameTime+400,
				callBack: function (attack) {callBack(attack);}
			}));
		}
	},
	swapAttack: function (attack,json) {
		if(attack.constructor.name === 'AttackDuelPlayer') {
			animations.attack.hideAttack(attack,function (attack) {
				attack.id = json.id;
				attack.loadJSON(json);
				animations.sprite.holdCurrentAnimation(attack,1500,function (attack) {
					animations.attack.showAttack(attack,function (attack) {
						
					});
				});
			});
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