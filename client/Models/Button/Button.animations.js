animations.button = {
	lockIn: {
		show: function (button) {
			button.scaleAnimation.appendKeyValue(new KeyValue({
				val:{width:1,height:1},
				endEpoch: frameTime + 400,
				callBack: function () {}
			}));
			button.translationAnimation.appendKeyValue(new KeyValue({
				val:{x:0,y:0},
				endEpoch: frameTime + 400,
				callBack: function () {}
			}));
		},
		hide: function (button) {

		}
	}
}