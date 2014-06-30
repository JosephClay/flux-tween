var _ = require('../utils'),

	Easing = require('../Easing');

var Tween = function() {
	this._duration              = 1000;
	this._repeat                = 0;
	this._startTime             = 0;
	
	this._easingFunction        = Easing.Linear.None;
	
	this._onUpdateCallback      = _.noop;
	this._onCompleteCallback    = _.noop;
	this._onReverseCallback     = _.noop;

	this.step = this.step.bind(this);
};

Tween.prototype = {

	startTime: function(time) {
		this._startTime = time;
		return this;
	},

	duration: function(duration) {
		this._duration = duration;
		return this;
	},

	repeat: function(times) {
		this._repeat = times;
		return this;
	},

	ease: function(easing) {
		this._easingFunction = easing;
		return this;
	},

	onUpdate: function(callback) {
		this._onUpdateCallback = callback;
		return this;
	},

	onComplete: function(callback) {
		this._onCompleteCallback = callback;
		return this;
	},

	onReverse: function(callback) {
		this._onReverseCallback = callback;
		return this;
	},

	step: function(time) {
		var shouldStepAgain,
			elapsedUncapped = (time - this._startTime) / this._duration,
			elapsed = elapsedUncapped > 1 ? 1 : elapsedUncapped;
			
		this._onUpdateCallback(this._easingFunction(elapsed));

		// We have ellapsed this loop
		if (elapsed === 1) {

			// Should we repeat?
			if (this._repeat > 0) {

				// Decrement the repeat counter (if finite, 
				// we may be in an infinite loop)
				if (isFinite(this._repeat)) { this._repeat--; }

				this._onReverseCallback();
				this._startTime = time;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			this._onCompleteCallback();

			return (shouldStepAgain = false);

		}

		return (shouldStepAgain = true);
	}
};

module.exports = Tween;