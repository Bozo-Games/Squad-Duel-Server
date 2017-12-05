
class Hand {
    constructor(json) {
        json = json === undefined ? {cards: []} : json;
        this.cards = [];
        for(let i = 0; i < json.cards.length; i++) {

            this.cards.push(new Card(json.cards[i]));
        }
        this.isPlayer = json.isPlayer === undefined ? false : json.isPlayer;

        this.inControl = true; //TODO remove this cause is sloppy
    }
    toJSON(){
        let cardsJSON = [];
        for(let i = 0; i < this.cards.length; i++) {
            cardsJSON.push(this.cards[i].toJSON());
        }
        return {
            cards:cardsJSON
        };
    }
    //mose events
    mouseMoved() {
        this.loopCardsWithCallBack(function (card,xi,yi) {
            card.mouseMoved(xi,yi,true);
        });
    }
    mouseReleased(){
        this.loopCardsWithCallBack(function (card,xi,yi) {
            card.mouseReleased(xi,yi,true);
        });
    }
    draw() {
        this.loopCardsWithCallBack(function (card,xi,yi) {
            push();
                translate(xi,yi);
                card.draw(xi,yi);
            pop();
        });
    }
    loopCardsWithCallBack(f) {
        let xi, yi;
        let step = defaults.drawing.hand.width() / Math.max(1,this.cards.length);
        if (this.isPlayer) {
            xi = defaults.drawing.hand.player.initial.x();
            yi = defaults.drawing.hand.player.initial.y();
        } else {
	        xi = defaults.drawing.hand.opp.initial.x();
	        yi = defaults.drawing.hand.opp.initial.y();
        }
        for (let i = 0;i<this.cards.length; i++) {
            let card = this.cards[i];
            f(card,xi,yi);
            xi += step;
        }
    }

}