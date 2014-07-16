var _END_VALUE = 100,
	_TOLERANCE = 0.001,
	_SPEED     = 1 / 60.0,

	_calcSpringAcceleration = function(tension, x, friction, velocity) {

		return -tension * x - friction * velocity;

	},

	_springCalculateState = function(state, speed) {

		var dt = speed * 0.5,

			a_dx = state.velocity,
			a_dv = _calcSpringAcceleration(state.tension, state.x, state.friction, state.velocity),

			b_dx = state.velocity + a_dv * dt,
			b_end_x = state.x + a_dx * dt,
			b_dv = _calcSpringAcceleration(state.tension, b_end_x, state.friction, b_dx),

			c_dx = state.velocity + b_dv * dt,
			c_end_x = state.x + b_dx * dt,
			c_dv = _calcSpringAcceleration(state.tension, c_end_x, state.friction, c_dx),

			d_dx = state.velocity + c_dv * dt,
			d_end_x = state.x + c_dx * dt,
			d_dv = _calcSpringAcceleration(state.tension, d_end_x, state.friction, d_dx),

			dxdt = (1.0 / 6.0) * (a_dx + 2.0 * (b_dx + c_dx) + d_dx),
			dvdt = (1.0 / 6.0) * (a_dv + 2.0 * (b_dv + c_dv) + d_dv);
			
		state.x        = state.x + dxdt * speed;
		state.velocity = a_dx + dvdt * speed;
		
		return state;

	};

var Spring = function Spring() {

	var spring = this;
	spring._repeat           = 0;
	spring._velocity         = 0;
	spring._originalVelocity = 0;
	spring._tension          = 80;
	spring._originalTension  = 80;
	spring._friction         = 8;
	spring._originalFriction = 8;
	spring._value            = 0;

	// Stores x and velocity to do
	// calculations against so that
	// we can multiple returns values
	// from _springCalculateState
	spring._state = {};

};

Spring.prototype = {

	registerCallbacks: function(obj) {
		
		var spring = this;
		spring._onUpdateCallback   = obj.onUpdate;
		spring._onCompleteCallback = obj.onComplete;
		spring._onReverseCallback  = obj.onReverse;
		return spring;

	},

	repeat: function(times) {

		var spring = this;
		spring._repeat = times;
		return spring;

	},

	set: function(tension, friction, velocity) {

		var spring = this;
		if (velocity !== undefined) { spring._velocity = spring._originalVelocity = velocity; }
		if (tension  !== undefined) { spring._tension  = spring._originalTension  = tension;  }
		if (friction !== undefined) { spring._friction = spring._originalFriction = friction; }
		return spring;

	},

	tension: function(tension) {

		var spring = this;
		spring._tension = spring._originalTension = tension;
		return spring;

	},
	
	friction: function(friction) {

		var spring = this;
		spring._friction = spring._originalFriction = friction;
		return spring;

	},
	
	velocity: function(velocity) {

		var spring = this;
		spring._velocity = spring._originalVelocity = velocity;
		return spring;

	},

	step: function() {

		var spring = this,
			shouldStepAgain,
			stateBefore = spring._state;

		stateBefore.x        = spring._value - _END_VALUE;
		stateBefore.velocity = spring._velocity;
		stateBefore.tension  = spring._tension;
		stateBefore.friction = spring._friction;

		var stateAfter       = _springCalculateState(stateBefore, _SPEED),
			finalVelocity    = stateAfter.velocity,
			netFloat         = stateAfter.x,
			net1DVelocity    = stateAfter.velocity,
			netValueIsLow    = Math.abs(netFloat) < _TOLERANCE,
			netVelocityIsLow = Math.abs(net1DVelocity) < _TOLERANCE,
			shouldSpringStop = netValueIsLow && netVelocityIsLow;

		spring._value = _END_VALUE + stateAfter.x;

		if (shouldSpringStop) {

			spring._velocity = (finalVelocity = 0);
			spring._value = _END_VALUE;

			spring._onUpdateCallback(spring._value / 100);

			// Should we repeat?
			if (spring._repeat > 0) {

				// Decrement the repeat counter (if finite, 
				// we may be in an infinite loop)
				if (isFinite(spring._repeat)) { spring._repeat--; }

				spring._onReverseCallback();
				spring._velocity = spring._originalVelocity;
				spring._tension  = spring._originalTension;
				spring._friction = spring._originalFriction;
				spring._value = 0;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			spring._onCompleteCallback();

			return (shouldStepAgain = false);

		}

		spring._velocity = finalVelocity;
		spring._onUpdateCallback(spring._value / 100);
		return (shouldStepAgain = true);

	},

	stop: function() {

		var spring = this;
		spring._velocity = spring._originalVelocity;
		spring._tension  = spring._originalTension;
		spring._friction = spring._originalFriction;
		spring._value = 0;

	}
};


module.exports = Spring;