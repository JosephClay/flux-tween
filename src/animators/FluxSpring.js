var _ = require('../utils'),

	loop = require('../loop'),

	Animator = require('./Animator'),

	Spring = require('./animations/Spring');

var FluxSpring = module.exports =function(obj) {

	Animator.call(this, obj);

	this._animation = Spring.create();

};

FluxSpring.create = function(obj) {

	return new FluxSpring(obj);

};

_.extend(FluxSpring.prototype, Animator.prototype, {

	set: function(tension, friction, velocity) {

		// It's an object
		if (+tension !== tension) {
			var temp = tension;
			velocity = temp.velocity;
			friction = temp.friction;
			tension = temp.tension;
		}

		this._animation.set(tension, friction, velocity);

		return this;

	},

	tension: function(tension) {

		this._animation.tension = +tension;

		return this;

	},

	friction: function(friction) {

		this._animation.friction = +friction;

		return this;

	},

	velocity: function(velocity) {

		this._animation.velocity = +velocity;

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

				onReverse: function() {

					self.obj.reverse();
					self.matrix.reverse();

				},

				onComplete: function() {

					self.stop().trigger('complete');

				}

			});

		self.obj.start();
		self.matrix.start();

		loop.add(self._animation);

	}
});