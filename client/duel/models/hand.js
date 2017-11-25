var defaultHandSize = 5; //TODO factor out into helper class
class hand {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.owner = json.owner === undefined ? 0 : json.owner;
        this.inControl = 1; 
        if(json.cardsInHand === undefined) {
            this.cardsInHand = [];/*
            var defaultHandSize = 5;
            for(var i = 0; i < defaultHandSize; i++) {
                let n = Math.floor(Math.random() * 18);
                let c = cardList[n];
                if(c === undefined) {console.log(n);}
                c.owner = this.owner;
                this.cardsInHand.push(new card(c));
            }*/
        } else {
            this.cardsInHand = [];
            for(var i = 0; i < json.cardsInHand.length; i++) {
                this.cardsInHand.push(new card(json.cardsInHand[i]));
            }
        }
    }
    toJSON() {
        let cardJSON = [];
        for(var i = 0; i < this.cardsInHand.length; i++) {
            cardJSON.push(this.cardsInHand[i].toJSON());
        }
        return {
            owner: this.owner,
            cardsInHand:cardJSON
        }
    }

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
                this.cardsInHand[i].mouseHit = collidePointRect(mouseX,mouseY,xi-27.5,yi-80,110, 160, 3);

                if (this.cardsInHand[i].isSelected && this.inControl == 1) { 
                    
                    console.log(this.cardsInHand[i].toJSON());
                    game.duel.cardSelected = this.cardsInHand[i]; //pass card to duel object
                    //let duelView = new Duel(this.cardsInHand[i].toJSON());
                    this.cardsInHand.splice(i,1);
                    this.inControl = 0;

                }

            } else if (this.cardsInHand[i].mouseHit == true && this.cardsInHand[i].owner == 1) {

                this.cardsInHand[i].mouseHit = collidePointRect(mouseX,mouseY,xi-27.5,yi,110, 160, 3);

            } else {

                this.cardsInHand[i].mouseHit = collidePointRect(mouseX,mouseY,xi,yi,55, 80, 3);
            }
            translate(step,0);
            xi += step;

        }
        pop();
    }
}


function generateHnad(owner) {
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