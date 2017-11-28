var defaultHandSize = 5; //TODO factor out into helper class
class Hand {
    constructor(json) {
        json = json === undefined ? {cards: []} : json;
        this.cards = [];
        for(let i = 0; i < json.cards.length; i++) {
            this.cards.push(new Card(json.cards[i]));
        }
        this.inControl = true;
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

    }
    mouseReleased(){
        for (var i = this.cards.length-1; i >= 0; i--) {
            this.cards[i].mouseReleased();
        }
    }
    //draw Methods
    /*
    draw(width,height) {
        translate( (width / (this.cards.length+1)),0);
        for(let i = 0; i < this.cards.length; i ++) {
            this.cards[i].draw(0.8 * (width / (this.cards.length+1)),height);
            translate( (width / (this.cards.length+1)),0);
        }
    }*/


    draw() {
        var split = width/this.cards.length;
        var counter = this.cards.length;
        var xi, yi;
        var step = width / this.cards.length;
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
        for (var i = this.cards.length-1; i >= 0; i--) {
            this.cards[i].owner = this.owner;
            this.cards[i].draw();

            if (this.cards[i].mouseHit == true && this.cards[i].owner == 0) { // player hand
                this.cards[i].mouseHit = collidePointRect(mouseX,mouseY,xi-this.cards[i].cardWidth/2,yi-this.cards[i].cardHeight,this.cards[i].cardWidth*2, this.cards[i].cardHeight*2, 3);

                if (this.cards[i].isSelected && this.inControl) {
                    
                    console.log(this.cards[i].toJSON());
                    game.duel.cardSelected = this.cards[i]; //pass card to duel object
                    this.cards.splice(i,1);
                    this.inControl = 0;

                } else if (this.cards[i].isSelected && !this.inControl) {
                    
                    console.log(this.cards[i].toJSON());
                    var cardFromDuel = game.duel.cardSelected;
                    game.duel.cardSelected = this.cards[i]; //pass card to duel object
                    this.cards.splice(i,1);
                    this.cards.push(cardFromDuel);

                }

            } else if (this.cards[i].mouseHit == true && this.cards[i].owner == 1) {
                this.cards[i].mouseHit = collidePointRect(mouseX,mouseY,xi-this.cards[i].cardWidth/2,yi,this.cards[i].cardWidth*2, this.cards[i].cardHeight*2, 3);

            } else {
                this.cards[i].mouseHit = collidePointRect(mouseX,mouseY,xi,yi,this.cards[i].cardWidth, this.cards[i].cardHeight, 3);
            }
            translate(step,0);
            xi += step;

        }
        pop();
    } 
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