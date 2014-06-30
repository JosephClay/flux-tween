var _ = require('../utils'),

	_END_VALUE = 100,
	_TOLERANCE = 0.1,
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
	this._repeat           = 0;
	this._velocity         = 0;
	this._originalVelocity = 0;
	this._tension          = 80;
	this._originalTension  = 80;
	this._friction         = 8;
	this._originalFriction = 8;
	this._value            = 0;

	// Stores x and velocity to do
	// calculations against so that
	// we can multiple returns values
	// from _springCalculateState
	this._state = {};

	this._onUpdateCallback   = _.noop;
	this._onCompleteCallback = _.noop;
	this._onReverseCallback  = _.noop;
};

Spring.prototype = {
	repeat: function(times) {
		this._repeat = times;
		return this;
	},

	set: function(tension, friction, velocity) {
		if (velocity !== undefined) { this._velocity = this._originalVelocity = velocity; }
		if (tension  !== undefined) { this._tension  = this._originalTension  = tension;  }
		if (friction !== undefined) { this._friction = this._originalFriction = friction; }
		return this;
	},

	tension: function(tension) {
		this._tension = this._originalTension = tension;
		return this;
	},
	
	friction: function(friction) {
		this._friction = this._originalFriction = friction;
		return this;
	},
	
	velocity: function(velocity) {
		this._velocity = this._originalVelocity = velocity;
		return this;
	},

	step: function() {
		var shouldStepAgain,
			stateBefore = this._state;

		stateBefore.x        = this._value - _END_VALUE;
		stateBefore.velocity = this._velocity;
		stateBefore.tension  = this._tension;
		stateBefore.friction = this._friction;

		var stateAfter       = _springCalculateState(stateBefore, _SPEED),
			finalVelocity    = stateAfter.velocity,
			netFloat         = stateAfter.x,
			net1DVelocity    = stateAfter.velocity,
			netValueIsLow    = Math.abs(netFloat) < _TOLERANCE,
			netVelocityIsLow = Math.abs(net1DVelocity) < _TOLERANCE,
			shouldSpringStop = netValueIsLow && netVelocityIsLow;

		this._value = _END_VALUE + stateAfter.x;

		if (shouldSpringStop) {
			this._velocity = (finalVelocity = 0);
			this._value = _END_VALUE;

			this._onUpdateCallback(this._value / 100);

			// Should we repeat?
			if (this._repeat > 0) {

				// Decrement the repeat counter (if finite, 
				// we may be in an infinite loop)
				if (isFinite(this._repeat)) { this._repeat--; }

				this._onReverseCallback();
				this._velocity = this._originalVelocity;
				this._tension  = this._originalTension;
				this._friction = this._originalFriction;
				this._value = 0;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			this._onCompleteCallback();

			return (shouldStepAgain = false);
		}

		this._velocity = finalVelocity;
		this._onUpdateCallback(this._value / 100);
		return (shouldStepAgain = true);
	},

	stop: function() {
		this._velocity = this._originalVelocity;
		this._tension  = this._originalTension;
		this._friction = this._originalFriction;
		this._value = 0;
	},

	onReverse: function(callback) {
		this._onReverseCallback = callback;
		return this;
	},

	onUpdate: function(onUpdate) {
		var spring = this;
		spring._onUpdateCallback = onUpdate;
		return spring;
	},

	onComplete: function(onComplete) {
		var spring = this;
		spring._onCompleteCallback = onComplete;
		return spring;
	}
};


module.exports = Spring;