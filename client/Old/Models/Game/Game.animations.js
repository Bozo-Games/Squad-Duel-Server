animations.game = {
	"newGame->cardSelectingStage": function (game,json) {
		game.push(new AnimationValue({
			width:0,
			height:0,
			x:game.w/2,
			y:game.h/2,
			time:200,
			callBack: function (game) {
				game.push(new AnimationValue({
					width:1,
					height:1,
					x:0,
					y:0,
					time:200,
					callBack: function (game) {
						game.currentState = 'cardSelectingStage';
						game.loadJSON(json);
					}}));
			}}));
	},
	"attackSelectStage->readyToDuel": function (game, json) {
		let countDownText = new FloatingText({
			x:0,
			y:0,
			w: game.global.w,
			h: game.global.h,
			fillColor:'#ff0000',
			text:'3',
			parentSprite:game
		});
		countDownText.shrinkCenter(function (floatingText) {
			floatingText.text = '2';
			floatingText.drawSettings.filColor = '#ff8400';
			floatingText.shrinkCenter(function (floatingText) {
				floatingText.text = '1';
				floatingText.drawSettings.filColor = '#448400';
				floatingText.shrinkCenter(function (floatingText) {
					floatingText.text = 'DUEL!';
					floatingText.drawSettings.filColor = '#00ff45';
					floatingText.shrinkCenter(function (floatingText) {
						game.removeSubSprite(floatingText);
						network.processDuel();
					});
				});
			});
		});
		game.currentState = json.currentState;
		game.loadJSON(json)
	}
};