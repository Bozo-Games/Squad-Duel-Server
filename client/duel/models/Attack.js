class Attack {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.attackId = json.attackId === undefined ? 0 : json.attackId;
		this.flat = json.flat === undefined ? 0 : json.flat; 
		this.crushing = json.crushing === undefined ? 0 : json.crushing; 
		this.piercing = json.piercing === undefined ? 0 : json.piercing; 
		this.defense = json.defense === undefined ? 0 : json.defense; 
		this.speed = json.speed === undefined ? 0 : json.speed;
		this.power = json.power === undefined ? 0 : json.power;

		this.attackName = json.attackName === undefined ? 'unknown' : json.attackName;

		if (this.flat > this.crushing && this.flat > this.piercing) {
			this.icon = IMG.icon.flat;
			this.power = this.flat;
 		} else if (this.crushing > this.flat && this.crushing > this.piercing)  {
			this.icon = IMG.icon.crushing;
			this.power = this.crushing;
 		} else if (this.piercing > this.flat && this.piercing > this.crushing)  {
			this.icon = IMG.icon.piercing;
			this.power = this.piercing;
 		} else {
			this.icon = IMG.icon.armor;
			this.power = this.defense;
 		}
	}
	toJSON(){
		return {
			attackIdId: this.attackId,
			flat:this.flat,
			crushing:this.crushing,
			piercing:this.piercing,
			defense:this.defense,
			speed:this.speed,
			power:this.power,
			attackName:this.attackName
		};
	}
	handDraw(cardWidth,cardHeight) {
        push();
			textSize(cardHeight*0.1);
			translate(cardWidth *.1,0);
			rect(0, 0, cardWidth *.8, cardHeight*0.1+8, 2);
			tint(colors.power);
			image(this.icon, 4, 4,cardHeight*0.1,cardHeight*0.1); // render icon
        	fill(colors.iconText);
        	textAlign(LEFT,TOP);
        	let size = Math.floor(cardHeight*0.1);
			textSize(size);
        	while(textWidth(this.attackName) > cardWidth *.8 - cardHeight*0.1 - 12) {
        		size --;
                textSize(size);
        		if(size < 10) {
        			break;
				}
			}
			text(this.attackName,cardHeight*0.1+8,4);
        pop();
	}
	duelDraw(cardWidth,cardHeight,card) {
		push();
			rect(cardWidth*0.05,0,cardWidth*0.5,cardHeight*0.4,5);
			push();//icons
				translate(cardWidth*0.05,0);
				push(); //power
					translate(cardWidth*0.075,cardHeight*0.02);
					tint(colors.power);
					image(this.icon,0,0,cardHeight*0.2,cardHeight*0.2);
					fill(colors.iconText);
					textAlign(CENTER,CENTER);
					text(this.speed+card.speed,cardHeight*0.1,cardHeight*0.1);
				pop(); //power
				push(); //Speed
					translate(cardWidth*0.15+cardHeight*0.2 ,cardHeight*0.02);
					tint(colors.power);
					image(IMG.icon.speed,0,0,cardHeight*0.2,cardHeight*0.2);
					fill(colors.iconText);
					textAlign(CENTER,CENTER);
					text(this.speed+card.speed,cardHeight*0.1,cardHeight*0.1);
				pop(); //Speed
			pop();//icons
			push(); //name
				translate(cardWidth*0.1,cardHeight*0.35);
				text(this.attackName,0,0);
			pop();//name
		pop();//attack
		/*
        textSize('9');
        translate(this.cardWidth*0.05, this.cardWidth*.075);
        rect(0, 0, this.cardWidth *.92, this.cardHeight*.4, 2);
        text(statAttack,5,10);
        image(this.attacks[0].icon, 10, 16,this.attacks[0].icon.width/7,this.attacks[0].icon.height/7); // render icon

        textSize('14')
        text(statAttackDamage,5,26);
        image(IMG.icon.speed, 36, 14,this.attacks[0].icon.width/7,this.attacks[0].icon.height/7); // render icon
        text(statAttackSpeed, 42, 32); // health value
*/
	}
}