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
});