animations.button = {
	lockIn: {
		show: function (button) {
			button.scaleAnimation.appendKeyValue(new KeyValue({
				val:{width:1,height:1},
				endEpoch: frameTime + 400,
				callBack: function () {}
			}));
			button.translationAnimation.appendKeyValue(new KeyValue({
				val:{x:button.parentSprite.bounds.w*defaults.card.duel.player.attackScale.x,y:0},
				endEpoch: frameTime + 400,
				callBack: function () {}
			}));
		},
		hide: function (button) {
			button.scaleAnimation.appendKeyValue(new KeyValue({
				val:{width:0,height:0},
				endEpoch: frameTime + 400,
				callBack: function () {}
			}));
			button.translationAnimation.appendKeyValue(new KeyValue({
				val:{x:button.bounds.w*1.5,y:button.bounds.h},
				endEpoch: frameTime + 400,
				callBack: function () {}
			}));
		}
	}
}