var _ = require('./utils'),
	_waiting = [],
	_animations = [];

var loop = {
	now: 0,

	await: function(fn) {

		_waiting.push(fn);

	},

	add: function(fn) {

		_animations.push(fn);

	},

	remove: function(fn) {

		var idx = _.indexOf(_animations, fn);
		if (idx !== -1) {

			_animations.splice(idx, 1);

		}

	},

	update: function(time) {

		time = time || _.now();
		loop.now = time;

		if (_waiting.length === 0 && _animations.length === 0) { return; }

		var idx = 0;
		while (idx < _waiting.length) {

			if (_waiting[idx](time)) {

				idx++;

			} else {

				_waiting.splice(idx, 1);

			}

		}

		idx = 0;
		while (idx < _animations.length) {

			if (_animations[idx].step(time)) {

				idx++;

			} else {

				_animations.splice(idx, 1);

			}

		}

	}
};

module.exports = loop;