class Sprite {
	constructor() {
		this.activeAnimations = [];
		this.floatingText = [];
		this.bounds = {
			x:0,
			y:0,
			w:100,
			h:100
		}
	}
	applyActiveAnimations() {
		let i = 0;
		while(i < this.activeAnimations.length && i >= 0) {
			if(this.activeAnimations[i].isDone) {
				this.activeAnimations[i].callBack(this); //here look at this we ar missing somthing about scope
				this.activeAnimations.splice(i,1);
				pop();
				if(this.forceDrawCancel) {
					this.forceDrawCancel = false;
					return true;
				}
				push();
				i = 0;
			} else {
				this.activeAnimations[i].applyEffect();
				i++;
			}
		}
		return false;
	}
	drawFloatingText() {
		push();
		for(let i=this.floatingText.length-1; i >=0; i--) {
			let shouldRemove = this.floatingText[i].draw();
			if(shouldRemove) {
				this.floatingText.splice(i,1);
			}
		}
		pop();
	}
}