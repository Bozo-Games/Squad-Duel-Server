animations.attack = {

	swapAttack: function (attack,json) {
		if(attack instanceof AttackDuelPlayer) {
			if(attack.parentSprite instanceof CardDuelPlayer) {
				attack.hide(function (attack) {
					attack.id = json.id;
					attack.loadJSON(json);
					attack.show(undefined, 1000);
				})
			} else {
				attack.id = json.id;
				attack.loadJSON(json);
			}
		} else {
			attack.id = json.id;
			attack.loadJSON(json);
		}
	},
	attackNameSlide(attack,isLeftRight) {
		let from = {x:-attack.w,y:0};
		let to = {x:attack.w,y:0};
		if(!isLeftRight) {
			from = {x:attack.w,y:0};
			to = {x:-attack.w,y:0};

		}
		attack.moveToGlobal(from.x,from.y,function (attack) {
			attack.moveToGlobal(0,0,function (attack) {
				attack.moveToGlobal(to.x,to.y,function (attack) {

				});
			});
		});
	}
};