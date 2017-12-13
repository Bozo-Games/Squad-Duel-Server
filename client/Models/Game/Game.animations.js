animations.game = {
	"newGame->cardSelectingStage": function (game,json) {
		game.scaleAnimation.appendKeyValue(new KeyValue({
			val: {width: 0.01, height: 0.01},
			endEpoch: frameTime + 400,
			callBack: function (game) {
				game.scaleAnimation.appendKeyValue(new KeyValue({
					val:{width:1,height:1},
					endEpoch: frameTime + 400,
					callBack: function (game) {
						game.currentState = 'cardSelectingStage';
						game.loadJSON(json);
					}}));
			}}));
		game.translationAnimation.appendKeyValue(new KeyValue({
			val: {x: game._bounds.w/2, y:game._bounds.h/2},
			endEpoch: frameTime + 400,
			callBack: function (game) {
				game.translationAnimation.appendKeyValue(new KeyValue({
					val:{x:0,y:0},
					endEpoch: frameTime + 400,
					callBack: function (game) {
						//do nothing scale is responsible fore updating json
					}}));
			}}));
	}
};