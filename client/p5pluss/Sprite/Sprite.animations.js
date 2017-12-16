animations.sprite = {
	holdCurrentAnimation: function (sprite,time,callBack) {
		sprite.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:sprite.translationAnimation.x,y:sprite.translationAnimation.y},
			endEpoch:frameTime+time,
			callBack:callBack
		}))
	},
	shrinkToNothing: function (sprite,time=200,callBack) {
		sprite.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:sprite.bounds.w/2,y:sprite.bounds.h/2},
			endEpoch:frameTime+time,
			callBack:undefined
		}));
		sprite.scaleAnimation.appendKeyValue(new KeyValue({
			val:{width:0,height:0},
			endEpoch:frameTime+time,
			callBack:callBack
		}))
	}
};