var _ = require('../../support/utils');

var _CAP = 3000,	
	_END_VALUE = 100,
	_defaults = {
		tension: 80,
		friction: 8,
		velocity: 0,
		speed: 1 / 60.0,
		tolerance: 0.1
	};

var _springAccelerationForState = function(state) {
	return -state.tension * state.x - state.friction * state.v;
};

var _springEvaluateState = function(initialState) {
	return {
		dx: initialState.v,
		dv: _springAccelerationForState(initialState)
	};
};

var _springEvaluateStateWithDerivative = function(initialState, dt, derivative) {
	var state = {
		x: initialState.x + derivative.dx * dt,
		v: initialState.v + derivative.dv * dt,
		tension: initialState.tension,
		friction: initialState.friction
	};
	return {
		dx: state.v,
		dv: _springAccelerationForState(state)
	};
};

var _springIntegrateState = function(state, speed) {
	var a = _springEvaluateState(state),
		b = _springEvaluateStateWithDerivative(state, speed * 0.5, a),
		c = _springEvaluateStateWithDerivative(state, speed * 0.5, b),
		d = _springEvaluateStateWithDerivative(state, speed, c),
		dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
		dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);
	state.x = state.x + dxdt * speed;
	state.v = state.v + dvdt * speed;
	return state;
};

var Spring = function(tension, friction, velocity, speed) {
	this.velocity = velocity || _defaults.velocity;
	this.tension = tension || _defaults.tension;
	this.friction = friction || _defaults.friction;
	this.speed = speed || _defaults.speed;
	
	this.tolerance = _defaults.tolerance;
	
	this.startValue = 0;
	this.currentValue = 0;
	this.isMoving = true;
	this.results = [];
};

_.extend(Spring, {
	create: function(tension, friction, velocity, fps) {
		return new Spring(tension, friction, velocity, 1 / fps);
	},

	generate: function(tension, friction, velocity, fps) {
		var spring = new Spring(tension, friction, velocity, 1 / fps);
		return spring.all();
	}
});

Spring.prototype = {
	next: function() {
		var stateBefore = {
				x: this.currentValue - _END_VALUE,
				v: this.velocity,
				tension: this.tension,
				friction: this.friction
			},
			stateAfter = _springIntegrateState(stateBefore, this.speed);

		this.currentValue = _END_VALUE + stateAfter.x;

		var finalVelocity = stateAfter.v,
			netFloat = stateAfter.x,
			net1DVelocity = stateAfter.v,
			netValueIsLow = Math.abs(netFloat) < this.tolerance,
			netVelocityIsLow = Math.abs(net1DVelocity) < this.tolerance;
		
		stopSpring = netValueIsLow && netVelocityIsLow;
		this.isMoving = !stopSpring;

		if (stopSpring) {
			finalVelocity = 0;
			this.currentValue = _END_VALUE;
		}

		this.velocity = finalVelocity;
		return this.currentValue;
	},

	all: function() {
		var count = 0,
			results = this.results;
		while (this.isMoving) {
			count++;
			if (count > _CAP) { throw 'Spring: too many values'; }

			results.push(this.next());
		}

		return results;
	},

	time: function() {
		return this.results.length * this.speed;
	}
};


module.exports = Spring;