var _ = require('../utils'),

	Easing = require('../Easing');

var Tween = function Tween() {

	var tween = this;
	tween._duration           = 1000;
	tween._repeat             = 0;
	tween._startTime          = 0;
	
	tween._easingFunction     = Easing.Linear.None;

	tween.step = tween.step.bind(tween);

};

Tween.prototype = {

	registerCallbacks: function(obj) {
		
		var tween = this;
		tween._onUpdateCallback   = obj.onUpdate;
		tween._onCompleteCallback = obj.onComplete;
		tween._onReverseCallback  = obj.onReverse;
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

	step: function(time) {

		var tween = this,
			shouldStepAgain,
			elapsedUncapped = (time - tween._startTime) / tween._duration,
			elapsed = elapsedUncapped > 1 ? 1 : elapsedUncapped;
			
		tween._onUpdateCallback(tween._easingFunction(elapsed));

		// We have ellapsed tween loop
		if (elapsed === 1) {

			// Should we repeat?
			if (tween._repeat > 0) {

				// Decrement the repeat counter (if finite, 
				// we may be in an infinite loop)
				if (isFinite(tween._repeat)) { tween._repeat--; }

				tween._onReverseCallback();
				tween._startTime = time;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			tween._onCompleteCallback();

			return (shouldStepAgain = false);

		}

		return (shouldStepAgain = true);

	},

	stop: _.noop
};

module.exports = Tween;