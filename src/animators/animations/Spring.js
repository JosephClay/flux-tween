var END_VALUE = 100,
	TOLERANCE = 0.01,
	SPEED     = 1 / 60,

	calcSpringAcceleration = function(tension, x, friction, velocity) {

		return -tension * x - friction * velocity;

	},

	springCalculateState = function(state, speed) {

		var dt = speed * 0.5,
			velocity = state.velocity,
			tension  = state.tension,
			friction = state.friction,

			a_dx = velocity,
			a_dv = calcSpringAcceleration(tension, state.x, friction, velocity),

			b_dx = velocity + a_dv * dt,
			b_end_x = state.x + a_dx * dt,
			b_dv = calcSpringAcceleration(tension, b_end_x, friction, b_dx),

			c_dx = velocity + b_dv * dt,
			c_end_x = state.x + b_dx * dt,
			c_dv = calcSpringAcceleration(tension, c_end_x, friction, c_dx),

			d_dx = velocity + c_dv * dt,
			d_end_x = state.x + c_dx * dt,
			d_dv = calcSpringAcceleration(tension, d_end_x, friction, d_dx),

			dxdt = (1 / 6) * (a_dx + 2 * (b_dx + c_dx) + d_dx),
			dvdt = (1 / 6) * (a_dv + 2 * (b_dv + c_dv) + d_dv);

		state.x        = state.x + dxdt * speed;
		state.velocity = a_dx + dvdt * speed;

		return state;

	};

var Spring = module.exports = function Spring() {

	var spring = this;
	spring._repeat           = 0;
	spring.velocity          = 0;
	spring._originalVelocity = 0;
	spring.tension           = 80;
	spring._originalTension  = 80;
	spring.friction          = 8;
	spring._originalFriction = 8;
	spring._value            = 0;

	spring._isPaused         = false;

	// Stores x and velocity to do
	// calculations against so that
	// we can have multiple return
	// values from springCalculateState
	spring._state = {};

};

Spring.create = function() {
	return new Spring();
};

Spring.prototype = {

	registerCallbacks: function(obj) {

		var spring = this;
		spring._updateCallback   = obj.onUpdate;
		spring._completeCallback = obj.onComplete;
		spring._reverseCallback  = obj.onReverse;
		return spring;

	},

	repeat: function(times) {

		var spring = this;
		spring._repeat = times;
		return spring;

	},

	set: function(tension, friction, velocity) {

		var spring = this;
		if (velocity !== undefined) { spring.velocity = spring._originalVelocity = velocity; }
		if (tension  !== undefined) { spring.tension  = spring._originalTension  = tension;  }
		if (friction !== undefined) { spring.friction = spring._originalFriction = friction; }
		return spring;

	},

	tension: function(tension) {

		var spring = this;
		spring.tension = spring._originalTension = tension;
		return spring;

	},

	friction: function(friction) {

		var spring = this;
		spring.friction = spring._originalFriction = friction;
		return spring;

	},

	velocity: function(velocity) {

		var spring = this;
		spring.velocity = spring._originalVelocity = velocity;
		return spring;

	},

	pause: function() {

		this._isPaused = true;
		return this;

	},

	resume: function() {

		this._isPaused = false;
		return this;

	},

	step: function() {
		var shouldStepAgain;

		if (this._isPaused) { return (shouldStepAgain = true); }

		var spring = this,
			stateBefore = spring._state;

		stateBefore.x        = spring._value - END_VALUE;
		stateBefore.velocity = spring.velocity;
		stateBefore.tension  = spring.tension;
		stateBefore.friction = spring.friction;

		var stateAfter       = springCalculateState(stateBefore, SPEED),
			finalVelocity    = stateAfter.velocity,
			netFloat         = stateAfter.x,
			net1DVelocity    = stateAfter.velocity,
			netValueIsLow    = Math.abs(netFloat) < TOLERANCE,
			netVelocityIsLow = Math.abs(net1DVelocity) < TOLERANCE,
			shouldSpringStop = netValueIsLow || netVelocityIsLow;

		spring._value = END_VALUE + stateAfter.x;

		if (shouldSpringStop) {

			spring.velocity = finalVelocity = 0;
			spring._value = END_VALUE;

			spring._updateCallback(spring._value / 100);

			// Should we repeat?
			if (spring._repeat > 0) {

				// Decrement the repeat counter (if finite,
				// we may be in an infinite loop)
				if (isFinite(spring._repeat)) { spring._repeat--; }

				spring._reverseCallback();
				spring.velocity = spring._originalVelocity;
				spring.tension  = spring._originalTension;
				spring.friction = spring._originalFriction;
				spring._value = 0;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			spring._completeCallback();

			return (shouldStepAgain = false);

		}

		spring.velocity = finalVelocity;
		spring._updateCallback(spring._value / 100);
		return (shouldStepAgain = true);

	},

	stop: function() {

		var spring = this;
		spring.velocity = spring._originalVelocity;
		spring.tension  = spring._originalTension;
		spring.friction = spring._originalFriction;
		spring._value = 0;

	}
};