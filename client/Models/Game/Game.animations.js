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