animations.floatingText = {
	shrinkCenter: function (floatingText,callBack) {
		floatingText.scaleAnimation.forceUpdate({width:1,height:1});
		floatingText.translationAnimation.forceUpdate({x:0,y:0});
		floatingText.scaleAnimation.appendKeyValue(new KeyValue({
			val: {width: 0, height: 0},
			endEpoch: frameTime + 1000,
			callBack: callBack
		}));
		floatingText.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:floatingText.bounds.w/2,y:floatingText.bounds.h/2},
			endEpoch:frameTime + 1000,
			callBack: function (floatingText) {

			}}));
	},
	floatAway: function (floatingText,callBack) {
		floatingText.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:(Math.random() - Math.random())*floatingText.bounds.w/2,y:-floatingText.bounds.w/3},
			endEpoch:frameTime + 1000,
			callBack: function (floatingText) {
				if(typeof callBack === 'function') {
					callBack(floatingText);
				}
			}}));
	}
};