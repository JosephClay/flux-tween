var _ = require('../utils'),

	_loop = require('../loop'),

	Animator = require('./Animator'),
	
	SpringAnimation = require('../animations/Spring');

var FluxSpring = function Spring(obj) {

	if (!(this instanceof FluxSpring)) { return new FluxSpring(obj); }

	Animator.call(this, obj);

	this._animation = new SpringAnimation();

};

_.extend(FluxSpring.prototype, Animator.prototype, {

	from: function(obj) {

		this._transformer.from(obj);
		return this;

	},

	set: function(tension, friction, velocity) {

		// It's an object
		if (!_.isNumber(tension)) {
			var temp = tension;
			velocity = temp.velocity;
			friction = temp.friction;
			tension = temp.tension;
		}

		this._animation.set(tension, friction, velocity);
		return this;

	},
	
	tension: function(tension) {

		this._animation.tension(tension);
		return this;

	},

	friction: function(friction) {

		this._animation.friction(friction);
		return this;

	},

	velocity: function(velocity) {

		this._animation.velocity(velocity);
		return this;

	},

	_start: function() {

		var self = this;
		this._animation
			.registerCallbacks({

				onUpdate: function(perc) {

					self._transformer.update(perc);

					self._onUpdateCallback(self._transformer.value());

				},

				onReverse: function() {

					self._transformer.reverse();

				},

				onComplete: function() {

					self._isPlaying = false;

					_loop.remove(self._animation);

					self._onCompleteCallback();

				}

			});

		self._transformer.start();
		_loop.add(self._animation);

	}
});

module.exports = FluxSpring;