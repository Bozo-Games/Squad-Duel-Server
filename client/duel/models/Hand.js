
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
            let rect = card.getHandRect(xi,yi);
            card.mouseIsOver = collidePointRect(mouseX,mouseY,rect.x,rect.y,rect.w,rect.h);
        });
    }
    mouseReleased(){
        this.loopCardsWithCallBack(function (card,xi,yi) {
            if(card.mouseIsOver) {
                //duel.cardSelected = card;
                network.selectCard(card.toJSON());
                console.log('clicky click clack');
            }
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