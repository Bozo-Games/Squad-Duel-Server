"use strict";
const assert = require('assert');
const defaults = require('../client/duel/Helpers/defaults.js');
const logger = require('../server/Helpers/logger.js');
const Hand = require('../server/Models/Hand.js');
describe('Hand Model', function () {
	before(function () {
		logger.on = false;
	});
	it('should exist', function () {
		assert.ok(Hand !== undefined)
	});
	it('should respond to toJSON()', function () {
		let h = new Hand();
		assert.ok(typeof h.toJSON === 'function');
	});
	it('should accept cards argument', function () {
		let h = new Hand({cards:[{}]});
		assert.equal(h.cards.length, 1);
	});
	it('should be able to find card by id', function () {
		let h = new Hand({cards:[{id:'abc123'}]});
		let c =  h.getCardByID('abc123');
		assert.equal(c.id, 'abc123');
	});
});