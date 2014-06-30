var _ = require('../utils'),

	_loop = require('../loop'),

	Animator = require('./Animator'),
	
	Easing = require('../Easing'),

	TweenAnimation = require('../animations/Tween');

var FluxTween = function Tween(obj) {

	if (!(this instanceof FluxTween)) { return new FluxTween(obj); }

	Animator.call(this, obj);

	this._animation = new TweenAnimation();

};

_.extend(FluxTween.prototype, Animator.prototype, {

	duration: function(duration) {

		this._animation.duration(+duration);
		return this;

	},

	ease: function(fn) {

		this._animation.ease(fn || Easing.Linear.None);
		return this;

	},

	_start: function() {

		this._isPlaying = true;
		
		var self = this;
		this._animation
			.onUpdate(function(perc) {
				self._transformer.update(perc);

				self._onUpdateCallback(self._transformer.value(), self._transformer.matrix());
			})
			.onComplete(function() {
				self._isPlaying = false;

				_loop.remove(self._animation);

				self._onCompleteCallback();
			})
			.onReverse(function() {
				self._transformer.reverse();
			})
			.startTime(_loop.now);

		self._transformer.start();
		_loop.add(self._animation);

	}
	
});

module.exports = FluxTween;