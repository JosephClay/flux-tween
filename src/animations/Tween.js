var _ = require('../utils'),

	Easing = require('../Easing');

var Tween = function Tween() {

	this._duration           = 1000;
	this._repeat             = 0;
	this._startTime          = 0;
	
	this._easingFunction     = Easing.Linear.None;

	this.step = this.step.bind(this);

};

Tween.prototype = {

	registerCallbacks: function(obj) {
		
		this._onUpdateCallback   = obj.onUpdate;
		this._onCompleteCallback = obj.onComplete;
		this._onReverseCallback  = obj.onReverse;
		return this;

	},

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

	},

	stop: _.noop
};

module.exports = Tween;