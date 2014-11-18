var _ = require('../utils'),

	loop = require('../loop'),

	Animator = require('./Animator'),

	easing = require('../easing'),

	Tween = require('./animations/Tween');

var FluxTween = module.exports = function(obj) {

	Animator.call(this, obj);

	this._animation = Tween.create();

};

FluxTween.create = function(obj) {

	return new FluxTween(obj);

};

_.extend(FluxTween.prototype, Animator.prototype, {

	duration: function(duration) {

		this._animation.duration(+duration);
		return this;

	},

	ease: function(fn) {

		this._animation.ease(fn || easing.linear.none);
		return this;

	},

	_start: function() {

		var self = this;
		this._animation
			.registerCallbacks({

				onUpdate: function(perc) {

					self.obj.update(perc);
					self.matrix.update(perc);

					self.trigger('update', self.obj.base, self);

				},

				onComplete: function() {

					self.stop().trigger('complete');

				},

				onReverse: function() {

					self.obj.reverse();
					self.matrix.reverse();

				}

			})
			.startTime(loop.now);

		self.obj.start();
		self.matrix.start();
		loop.add(self._animation);

	}

});