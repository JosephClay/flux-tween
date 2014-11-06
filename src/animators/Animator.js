var _      = require('../utils'),

	loop   = require('../loop'),

	Elem   = require('../Elem'),

	Matrix = require('../transformers/Matrix'),
	Obj    = require('../transformers/Obj');

var Animation = function(obj) {

	var hasElem = _.isElement(obj);
	this.obj         = hasElem ? Obj.create() : Obj.create(obj);
	this._elem        = hasElem ? Elem.create(obj) : null;
	this.elem         = hasElem ? obj : null;
	this.matrix       = Matrix.create();
	this.playing      = false;
	this._startTime   = 0;
	this._delayTime   = 0;
	this._events      = {};

	var self = this;
	this.transform = {
		from: function(from) {

			self.matrix.setFrom(from);

			return self;

		},
		to: function(to) {

			self.matrix.setTo(to);

			return self;

		}
	};
};

Animation.prototype = {

	on: function(name, fn) {

		var arr = this._events[name] || (this._events[name] = []);
		arr.push(fn);
		return this;

	},

	off: function(name, fn) {

		var arr = this._events[name];
		if (!arr || !arr.length) { return this; }

		var idx = arr.indexOf(fn);
		if (idx !== -1) {

			animations.splice(idx, 1);

		}

		return this;

	},

	trigger: function(name, a, b) {

		var arr = this._events[name];
		if (!arr || !arr.length) { return this; }

		var idx = 0, length = arr.length;
		for (; idx < length; idx++) {

			arr[idx](a, b);

		}

		return this;

	},

	delay: function(amount) {

		this._delayTime = amount;
		return this;

	},

	repeat: function(repeat) {

		this._animation.repeat(repeat);
		return this;

	},

	yoyo: function(yoyo) {

		if (!arguments.length) { yoyo = true; }
		this.obj.yoyo = this.matrix.yoyo = !!yoyo;
		return this;

	},

	to: function(to) {

		this.obj.setTo(to);
		return this;

	},

	from: function(from) {

		this.obj.setFrom(from);
		return this;

	},

	start: function(time) {

		this._startTime = time || loop.now;

		var self = this;
		loop.await(function(time) {

			var shouldContinueToWait;

			if (time < (self._startTime + self._delayTime)) {

				return (shouldContinueToWait = true);

			}

			self.trigger('start');

			self.playing = true;

			self._resolveToFrom();

			self._start(time);

			return (shouldContinueToWait = false);

		});

		return this;

	},

	_resolveToFrom: function() {

		if (!this._elem) { return; }

		if (!this.obj.base) {

			this.obj.setFrom(
				this._elem.calcBase(this.obj.to)
			);

		}

		if (this.matrix.to) {

			this.matrix.setMatrix(this._elem.calcMatrix());

		}

	},

	pause: function(time) {

		time = time || loop.now;
		this._animation.pause(time);
		return this;

	},

	resume: function(time) {

		time = time || loop.now;
		this._animation.resume(time);
		return this;

	},

	stop: function() {

		if (!this.playing) { return this; }

		this.playing = false;

		loop.remove(this._animation);

		this._animation.stop();

		this.trigger('stop');

		return this;
	}

	// Implemented by the inheritor
	// _start: function() {}
};

module.exports = Animation;