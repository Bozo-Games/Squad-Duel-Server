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
	}
};