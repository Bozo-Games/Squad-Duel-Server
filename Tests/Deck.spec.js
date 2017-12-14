"use strict";
const assert = require('assert');
const defaults = require('../server/Helpers/defaults.js');
const logger = require('../server/Helpers/logger.js');
const Deck = require('../server/Models/Deck.js');
describe('Deck Model', function () {
	before(function () {
		logger.on = false;
	});
	it('should exist', function () {
		assert.ok(Deck !== undefined)
	});
	it('should respond to toJSON()', function () {
		let d = new Deck();
		assert.ok(typeof d.toJSON === 'function');
	});
	it('should build a new deck with cards', function () {
		let d = new Deck();
		assert.equal(d.cards.length,defaults.deck.numberOfCards);
	});
	it('should build remove a card when deailing', function () {
		let d = new Deck();
		d.dealCard();
		assert.equal(d.cards.length,defaults.deck.numberOfCards-1);
	});
	it('should have cards json for cards in the deck',function () {
		let d = new Deck();
		let json = d.toJSON();
		assert.equal(json.cards.length, defaults.deck.numberOfCards);
	});
	it('should return undefined when the deck is empty', function () {
		let d = new Deck();
		while(d.cards.length > 0) {
			d.dealCard();
		}
		assert.equal(undefined,d.dealCard());
	});
});