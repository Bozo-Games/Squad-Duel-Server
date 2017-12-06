"use strict";
const assert = require('assert');
const defaults = require('../client/duel/Helpers/defaults.js');
const logger = require('../server/Helpers/logger.js');
const Game = require('../server/Models/Game.js');
describe('Game Model', function () {
	before(function () {
		logger.on = false;
	});
	it('should exist', function () {
		assert.ok(Game !== undefined)
	});
	it('should respond to toJSON()', function () {
		let g = new Game();
		assert.ok(typeof g.toJSON === 'function');
	});
});