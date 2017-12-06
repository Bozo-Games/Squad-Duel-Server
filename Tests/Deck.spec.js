"use strict";
const assert = require('assert');
const defaults = require('../client/duel/Helpers/defaults.js');
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
		assert.equal(d.cards.length,defaults.server.deck.numberOfCards);
	});
	it('should build remove a card when deailing', function () {
		let d = new Deck();
		d.dealCard();
		assert.equal(d.cards.length,defaults.server.deck.numberOfCards-1);
	});
	it('should have card json for cards',function () {
		let d = new Deck();
		let json = d.toJSON();
		assert.equal(json.cards.length, defaults.server.deck.numberOfCards);
	});
});