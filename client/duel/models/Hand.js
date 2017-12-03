
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
            card.handDraw();
            pop();
        });
    }
    loopCardsWithCallBack(f) {
        let xi, yi;
        let step = width / this.cards.length;
        if (this.owner === 0) { //TODO make owner a enum or a bool isPlayer
            xi = defaults.hand.player.initialXi;
            yi = defaults.hand.player.initialYi;
        } else {
            xi = defaults.hand.opp.initialXi;
            yi = defaults.hand.opp.initialYi;
        }
        for (let i = 0;i<this.cards.length; i++) {
            let card = this.cards[i];
            card.owner = this.owner; //TODO change to is isPlayer I think
            f(card,xi,yi);
            xi += step;
        }
    }

}