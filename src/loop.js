var _          = require('./utils'),
	waiting    = [],
	animations = [];

var loop = module.exports = {
	now: Date.now(),

	await: function(fn) {

		waiting.push(fn);

	},

	add: function(fn) {

		animations.push(fn);

	},

	remove: function(fn) {

		var idx = animations.indexOf(fn);
		if (idx !== -1) {

			animations.splice(idx, 1);

		}

	},

	update: function(time) {

		time = loop.now = time || Date.now();

		if (waiting.length === 0 && animations.length === 0) { return; }

		var idx = 0;
		while (idx < waiting.length) {

			if (waiting[idx](time)) {

				idx++;

			} else {

				waiting.splice(idx, 1);

			}

		}

		idx = 0;
		while (idx < animations.length) {

			animations[idx].step(time);
			idx++;

		}

	}
};