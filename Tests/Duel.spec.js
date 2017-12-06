"use strict";
const assert = require('assert');
const defaults = require('../client/duel/Helpers/defaults.js');
const logger = require('../server/Helpers/logger.js');
const Duel = require('../server/Models/Duel.js');
describe('Duel Model', function () {
	before(function () {
		logger.on = false;
	});
	it('should exist', function () {
		assert.ok(Duel !== undefined)
	});
	it('should respond to toJSON()', function () {
		let d = new Duel();
		assert.ok(typeof d.toJSON === 'function');
	});
});