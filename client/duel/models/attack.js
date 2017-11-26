class attack {
	constructor(json) {
		json = json === undefined ? attackList[Math.floor(Math.random() * 10)] : json;
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
 		} else if (this.crushing > this.flat && this.crushing > this.piercing)  {
			this.icon = IMG.icon.crushing;
 		} else if (this.piercing > this.flat && this.piercing > this.crushing)  {
			this.icon = IMG.icon.piercing;
 		} else {
			this.icon = IMG.icon.defense;
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
}