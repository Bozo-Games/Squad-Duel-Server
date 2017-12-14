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
	},
	"attackSelectStage->readyToDuel": function (game, json) {
		let countDownText = new FloatingText({
			bounds: {
				x:0,
				y:0,
				w: game.bounds.w,
				h: game.bounds.h
			},
			fillColor:'#ff0000',
			text:'3'
		});
		animations.floatingText.shrinkCenter(countDownText,function (floatingText) {
			floatingText.text = '2';
			floatingText.filColor = '#ff8400';
			animations.floatingText.shrinkCenter(countDownText,function (floatingText) {
				floatingText.text = '1';
				floatingText.filColor = '#448400';
				animations.floatingText.shrinkCenter(countDownText,function (floatingText) {
					floatingText.text = 'DUEL!';
					floatingText.filColor = '#00ff45';
					animations.floatingText.shrinkCenter(countDownText,function (floatingText) {
						game.removeSubSprite(floatingText);
						network.processDuel();
					});
				});
			});
		});
		game.addSubSprite(countDownText);
		game.currentState = json.currentState;
		game.loadJSON(json)
	}
};