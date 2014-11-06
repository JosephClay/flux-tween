var _ = require('../../utils'),

	easing = require('../../easing');

var Tween = module.exports = function Tween() {

	var tween = this;
	tween._duration           = 1000;
	tween._repeat             = 0;
	tween._startTime          = 0;
	tween._isPaused           = false;
	tween._easingFunction     = easing.linear.none;

	tween.step = tween.step.bind(tween);

};

Tween.create = function() {
	return new Tween();
};

Tween.prototype = {

	registerCallbacks: function(obj) {

		var tween = this;
		tween._updateCallback   = obj.onUpdate;
		tween._completeCallback = obj.onComplete;
		tween._reverseCallback  = obj.onReverse;
		return tween;

	},

	startTime: function(time) {

		var tween = this;
		tween._startTime = time;
		return tween;

	},

	duration: function(duration) {

		var tween = this;
		tween._duration = duration;
		return tween;

	},

	repeat: function(times) {

		var tween = this;
		tween._repeat = times;
		return tween;

	},

	ease: function(easing) {

		var tween = this;
		tween._easingFunction = easing;
		return tween;

	},

	pause: function(time) {

		this._isPaused = true;
		this._pauseTime = time;
		return this;

	},

	resume: function(time) {

		if (!this._isPaused || !this._pauseTime) { return this; }

		var delay = time - this._pauseTime;
		this._startTime += delay;

		this._pauseTime = null;
		this._isPaused = false;

		return this;

	},

	step: function(time) {
		var shouldStepAgain;

		if (this._isPaused) { return (shouldStepAgain = true); }

		var elapsedUncapped = (time - this._startTime) / this._duration,
			elapsed         = elapsedUncapped > 1 ? 1 : elapsedUncapped;

		this._updateCallback(this._easingFunction(elapsed));

		// We have ellapsed tween loop
		if (elapsed === 1) {

			// Should we repeat?
			if (this._repeat > 0) {

				// Decrement the repeat counter (if finite,
				// we may be in an infinite loop)
				if (isFinite(this._repeat)) { this._repeat--; }

				this._reverseCallback();
				this._startTime = time;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			this._completeCallback();

			return (shouldStepAgain = false);

		}

		return (shouldStepAgain = true);

	},

	stop: _.noop
};