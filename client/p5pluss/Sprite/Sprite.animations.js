animations.sprite = {
	holdCurrentAnimation: function (sprite,time,callBack) {
		sprite.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:sprite.translationAnimation.x,y:sprite.translationAnimation.y},
			endEpoch:frameTime+time,
			callBack:callBack
		}))
	}
};