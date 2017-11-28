var defaultHandSize = 5; //TODO factor out into helper class
class Hand {
    constructor(json) {
        json = json === undefined ? {cards: []} : json;
        this.cards = [];
        for(let i = 0; i < json.cards.length; i++) {
            this.cards.push(new Card(json.cards[i]));
        }
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
    mouseMoved(width,height) {

    }
    mouseReleased(width,height){

    }
    //draw Methods
    draw(width,height) {
        translate( (width / (this.cards.length+1)),0);
        for(let i = 0; i < this.cards.length; i ++) {
            this.cards[i].draw(0.8 * (width / (this.cards.length+1)),height);
            translate( (width / (this.cards.length+1)),0);
        }
    }


    /* old draw code
    draw() {
        var split = width/this.cardsInHand.length;
        var counter = this.cardsInHand.length;
        var xi, yi;
        var step = width / this.cardsInHand.length;
        push();
        if (this.owner == 0) {
            translate(50,500);
            xi = 50;
            yi = 500;
        }
        else {
            xi = 50;
            yi = 20;
            translate(50,20);
        }
        for (var i = this.cardsInHand.length-1; i >= 0; i--) {
            this.cardsInHand[i].draw();

            if (this.cardsInHand[i].mouseHit == true && this.cardsInHand[i].owner == 0) { // player hand
                this.cardsInHand[i].mouseHit = collidePointRect(mouseX,mouseY,xi-this.cardsInHand[i].cardWidth/2,yi-this.cardsInHand[i].cardHeight,this.cardsInHand[i].cardWidth*2, this.cardsInHand[i].cardHeight*2, 3);

                if (this.cardsInHand[i].isSelected && this.inControl == 1) { 
                    
                    console.log(this.cardsInHand[i].toJSON());
                    game.duel.cardSelected = this.cardsInHand[i]; //pass card to duel object
                    this.cardsInHand.splice(i,1);
                    this.inControl = 0;

                } else if (this.cardsInHand[i].isSelected && this.inControl == 0) { 
                    
                    console.log(this.cardsInHand[i].toJSON());
                    var cardFromDuel = game.duel.cardSelected;
                    game.duel.cardSelected = this.cardsInHand[i]; //pass card to duel object
                    this.cardsInHand.splice(i,1);
                    this.cardsInHand.push(cardFromDuel);

                }

            } else if (this.cardsInHand[i].mouseHit == true && this.cardsInHand[i].owner == 1) {

                this.cardsInHand[i].mouseHit = collidePointRect(mouseX,mouseY,xi-this.cardsInHand[i].cardWidth/2,yi,this.cardsInHand[i].cardWidth*2, this.cardsInHand[i].cardHeight*2, 3);

            } else {

                this.cardsInHand[i].mouseHit = collidePointRect(mouseX,mouseY,xi,yi,this.cardsInHand[i].cardWidth, this.cardsInHand[i].cardHeight, 3);
            }
            translate(step,0);
            xi += step;

        }
        pop();
    } */
}


function generateHnad(owner) {
    console.log('warning using old code in Hand.js');
    "use strict";
    let cih = [];
    var defaultHandSize = 5;
    for(var i = 0; i < defaultHandSize; i++) {
        let n = Math.floor(Math.random() * 18);
        let c = cardList[n];
        if(c === undefined) {console.log(n);}
        c.owner = owner;
        cih.push(new card(c));
    }

}