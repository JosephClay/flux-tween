(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// from the amazing sole
// https://github.com/sole/tween.js/
var Easing = {

	Linear: {

		None: function(k) {

			return k;

		}

	},

	Quadratic: {

		In: function(k) {

			return k * k;

		},

		Out: function(k) {

			return k * (2 - k);

		},

		InOut: function(k) {

			if ((k *= 2) < 1) { return 0.5 * k * k; }
			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function(k) {

			return k * k * k;

		},

		Out: function(k) {

			return --k * k * k + 1;

		},

		InOut: function(k) {

			if ((k *= 2) < 1) { return 0.5 * k * k * k; }
			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function(k) {

			return k * k * k * k;

		},

		Out: function(k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function(k) {

			if ((k *= 2) < 1) { return 0.5 * k * k * k * k; }
			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function(k) {

			return k * k * k * k * k;

		},

		Out: function(k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function(k) {

			if ((k *= 2) < 1) { return 0.5 * k * k * k * k * k; }
			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function(k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function(k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function(k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function(k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function(k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function(k) {

			if (k === 0) { return 0; }
			if (k === 1) { return 1; }
			if ((k *= 2) < 1) { return 0.5 * Math.pow(1024, k - 1); }
			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function(k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function(k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function(k) {

			if ((k *= 2) < 1) { return - 0.5 * (Math.sqrt(1 - k * k) - 1); }
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function(k) {

			var s, a = 0.1, p = 0.4;
			if (k === 0) { return 0; }
			if (k === 1) { return 1; }
			if (!a || a < 1) {
				a = 1; s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));

		},

		Out: function(k) {

			var s, a = 0.1, p = 0.4;
			if (k === 0) { return 0; }
			if (k === 1) { return 1; }
			if (!a || a < 1) {
				a = 1; s = p / 4;
			} else {
				 s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);

		},

		InOut: function(k) {

			var s, a = 0.1, p = 0.4;
			if (k === 0) { return 0; }
			if (k === 1) { return 1; }
			if (!a || a < 1) {
				a = 1; s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			if ((k *= 2) < 1) { return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p)); }
			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

		}

	},

	Back: {

		In: function(k) {

			var s = 1.70158;
			return k * k * ((s + 1) * k - s);

		},

		Out: function(k) {

			var s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function(k) {

			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) { return 0.5 * (k * k * ((s + 1) * k - s)); }
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function(k) {

			return 1 - Easing.Bounce.Out(1 - k);

		},

		Out: function(k) {

			if (k < (1 / 2.75)) {

				return 7.5625 * k * k;

			} else if (k < (2 / 2.75)) {

				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;

			} else if (k < (2.5 / 2.75)) {

				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;

			} else {

				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;

			}

		},

		InOut: function(k) {

			if (k < 0.5) { return Easing.Bounce.In(k * 2) * 0.5; }
			return Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

module.exports = Easing;
},{}],2:[function(require,module,exports){
module.exports = window.FLUX = {
	Tween: require('./animators/FluxTween'),
	Spring: require('./animators/FluxSpring'),
	
	Easing: require('./Easing'),
	update: require('./loop').update
};
},{"./Easing":1,"./animators/FluxSpring":7,"./animators/FluxTween":8,"./loop":9}],3:[function(require,module,exports){
var WebMatrix = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : require('./polyfills/XCSSMatrix'),

	_emptyMatrix = new WebMatrix(),

	_EMPTY_MATRIX_DEFAULTS = {
		x:         0,
		y:         0,
		z:         0,
		scaleX:    0,
		scaleY:    0,
		scaleZ:    0,
		rotationX: 0,
		rotationY: 0,
		rotationZ: 0
	},

	_decomposeObject = function(obj) {
		obj = _.extend({}, _EMPTY_MATRIX_DEFAULTS, obj);
		var matrix = _emptyMatrix;
		matrix = matrix.translate(obj.x, obj.y, obj.z);
		matrix = matrix.rotate(obj.rotationX, obj.rotationY, obj.rotationZ);
		matrix = matrix.scale(obj.scaleX, obj.scaleY, obj.scaleZ);
		return matrix;
	},

	_decomposeWebMatrix = function(m) {
		var result = {};
		result.translation = {
			x: m.m41,
			y: m.m42,
			z: m.m43
		};
		result.scale = {
			x: Math.sqrt(m.m11 * m.m11 + m.m12 * m.m12 + m.m13 * m.m13),
			y: Math.sqrt(m.m21 * m.m21 + m.m22 * m.m22 + m.m23 * m.m23),
			z: Math.sqrt(m.m31 * m.m31 + m.m32 * m.m32 + m.m33 * m.m33)
		};
		result.rotation = {
			x: -Math.atan2(m.m32 / result.scale.z, m.m33 / result.scale.z),
			y: Math.asin(m.m31 / result.scale.z),
			z: -Math.atan2(m.m21 / result.scale.y, m.m11 / result.scale.x)
		};
		return result;
	};

var Matrix = function(matrix) {
	if (matrix instanceof WebMatrix) {
		
		// Webmatrix
		this.from(_decomposeWebMatrix(matrix));

	} else if (matrix) {

		// Plain object
		this.from(_decomposeWebMatrix(_decomposeObject(matrix)));
	
	}
};

Matrix.prototype = {
	from: function(matrix) {
		this.x = matrix.translation.x;
		this.y = matrix.translation.y;
		this.z = matrix.translation.z;
		this.scaleX = matrix.scale.x;
		this.scaleY = matrix.scale.y;
		this.scaleZ = matrix.scale.z;
		this.rotationX = matrix.rotation.x / Math.PI * 180;
		this.rotationY = matrix.rotation.y / Math.PI * 180;
		this.rotationZ = matrix.rotation.z / Math.PI * 180;
	},

	update: function() {
		var matrix = _emptyMatrix;
		matrix = matrix.translate(this._x, this._y, this._z);
		matrix = matrix.rotate(this._rotationX, this._rotationY, this._rotationZ);
		matrix = matrix.scale(this._scaleX, this._scaleY, this._scaleZ);
		return matrix;
	}
};

Matrix.define = function(prop, desc) {
	Object.defineProperty(Matrix.prototype, prop, desc);
};

Matrix.define('x', {
	get: function() {
		return this._x || 0;
	},
	set: function(value) {
		return (this._x = (value || 0));
	}
});

Matrix.define('y', {
	get: function() {
		return this._y || 0;
	},
	set: function(value) {
		return (this._y = (value || 0));
	}
});

Matrix.define('z', {
	get: function() {
		return this._z || 0;
	},
	set: function(value) {
		return (this._z = (value || 0));
	}
});

Matrix.define('scaleX', {
	get: function() {
		return this._scaleX || 1;
	},
	set: function(value) {
		return (this._scaleX = (value || 0));
	}
});

Matrix.define('scaleY', {
	get: function() {
		return this._scaleY || 1;
	},
	set: function(value) {
		return (this._scaleY = (value || 0));
	}
});

Matrix.define('scaleZ', {
	get: function() {
		return this._scaleZ || 1;
	},
	set: function(value) {
		return (this._scaleZ = (value || 0));
	}
});

Matrix.define('scale', {
	get: function() {
		return (this._scaleX + this._scaleY) / 2.0;
	},
	set: function(value) {
		return (this._scaleX = this._scaleY = (value || 0));
	}
});

Matrix.define('rotationX', {
	get: function() {
		return this._rotationX || 0;
	},
	set: function(value) {
		return (this._rotationX = (value || 0));
	}
});

Matrix.define('rotationY', {
	get: function() {
		return (this._rotationY || 0);
	},
	set: function(value) {
		return (this._rotationY = (value || 0));
	}
});

Matrix.define('rotationZ', {
	get: function() {
		return this._rotationZ || 0;
	},
	set: function(value) {
		return (this._rotationZ = (value || 0));
	}
});

Matrix.define('rotation', {
	get: function() {
		return this.rotationZ;
	},
	set: function(value) {
		return (this.rotationZ = (value || 0));
	}
});

module.exports = Matrix;
},{"./polyfills/XCSSMatrix":10}],4:[function(require,module,exports){
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

var Spring = function() {
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
				this._tension  = this._originalTension ;
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
},{"../utils":16}],5:[function(require,module,exports){
var _ = require('../utils'),

	Easing = require('../Easing');

var Tween = function() {
	this._duration              = 1000;
	this._repeat                = 0;
	this._startTime             = 0;
	
	this._easingFunction        = Easing.Linear.None;
	
	this._onUpdateCallback      = _.noop;
	this._onCompleteCallback    = _.noop;
	this._onReverseCallback     = _.noop;

	this.step = this.step.bind(this);
};

Tween.prototype = {

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

	onUpdate: function(callback) {
		this._onUpdateCallback = callback;
		return this;
	},

	onComplete: function(callback) {
		this._onCompleteCallback = callback;
		return this;
	},

	onReverse: function(callback) {
		this._onReverseCallback = callback;
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
	}
};

module.exports = Tween;
},{"../Easing":1,"../utils":16}],6:[function(require,module,exports){
var _ = require('../utils'),

	_loop = require('../loop'),

	TransformObj = require('../transformers/Obj'),
	TransformElem = require('../transformers/Elem'),
	TransformCollection = require('../transformers/Collection');

var Animation = function(obj) {
	this._transformer = _.isArrayLike(obj) ?
		new TransformCollection(obj) :
		_.isElement(obj) ?
			new TransformElem(obj) :
			new TransformObj(obj);

	this._startTime = 0;
	this._delayTime = 0;
	this._isPlaying = false;

	this._onStartCallback    = _.noop;
	this._onUpdateCallback   = _.noop;
	this._onReverseCallback  = _.noop;
	this._onCompleteCallback = _.noop;
	this._onStopCallback     = _.noop;
};

Animation.prototype = {
	isPlaying: function() {
		return this._isPlaying;
	},

	onStart: function(callback) {
		this._onStartCallback = callback;
		return this;
	},

	onUpdate: function(callback) {
		this._onUpdateCallback = callback;
		return this;
	},

	onComplete: function(callback) {
		this._onCompleteCallback = callback;
		return this;
	},

	onReverse: function(callback) {
		this._onReverseCallback = callback;
		return this;
	},

	onStop: function(callback) {
		this._onStopCallback = callback;
		return this;
	},

	delay: function(amount) {
		this._delayTime = amount;
		return this;
	},

	repeat: function(repeat) {
		this._animation.repeat(repeat);
		return this;
	},

	yoyo: function(yoyo) {
		this._transformer.yoyo(yoyo);
		return this;
	},

	to: function(goTo) {
		this._transformer.to(goTo);
		return this;
	},

	start: function(time) {
		this._startTime = time || _.now();

		var self = this;
		_loop.await(function(time) {
			var shouldContinueToWait;

			if (time < (self._startTime + self._delayTime)) {
				return (shouldContinueToWait = true);
			}

			self._onStartCallback();

			self._start(time);

			return (shouldContinueToWait = false);
		});
	},

	stop: function() {
		if (!this._isPlaying) { return this; }

		this._isPlaying = false;

		_loop.remove(this._animation.step);

		this._transformer.stop();
		this._animation.stop();

		this._onStopCallback();
	},

	// _start: function() {},
};

module.exports = Animation;
},{"../loop":9,"../transformers/Collection":13,"../transformers/Elem":14,"../transformers/Obj":15,"../utils":16}],7:[function(require,module,exports){
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
		this._isPlaying = true;

		var self = this;
		this._animation
			.onUpdate(function(perc) {
				self._transformer.update(perc);

				self._onUpdateCallback(self._transformer.value(), self._transformer.matrix());
			})
			.onReverse(function() {
				self._transformer.reverse();

				self.start();
			})
			.onComplete(function() {
				self._isPlaying = false;

				_loop.remove(self._animation);

				self._onCompleteCallback();
			});

		self._transformer.start();
		_loop.add(self._animation);
	}
});

module.exports = FluxSpring;
},{"../animations/Spring":4,"../loop":9,"../utils":16,"./Animator":6}],8:[function(require,module,exports){
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
			.startTime(_.now());

		self._transformer.start();
		_loop.add(self._animation);
	}
});

module.exports = FluxTween;
},{"../Easing":1,"../animations/Tween":5,"../loop":9,"../utils":16,"./Animator":6}],9:[function(require,module,exports){
var _waiting = [],
	_animations = [];

module.exports = {
	await: function(fn) {
		_waiting.push(fn);
	},

	add: function(fn) {
		_animations.push(fn);
	},

	remove: function(fn) {
		var idx = _animations.indexOf(fn);
		if (idx !== -1) {
			_animations.splice(idx, 1);
		}
	},

	update: function(time) {
		if (_waiting.length === 0 && _animations.length === 0) { return; }

		var idx = 0;
		while (idx < _waiting.length) {
			if (_waiting[idx](time)) {
				idx++;
			} else {
				_waiting.splice(idx, 1);
			}
		}

		idx = 0;
		while (idx < _animations.length) {
			if (_animations[idx].step(time)) {
				idx++;
			} else {
				_animations.splice(idx, 1);
			}
		}
	}
};

},{}],10:[function(require,module,exports){
(function (global){
// XCSSMatrix polyfill
// https://github.com/jfsiii/XCSSMatrix
(function(e){if("function"==typeof bootstrap)bootstrap("xcssmatrix",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeXCSSMatrix=e}else"undefined"!=typeof window?window.XCSSMatrix=e():global.XCSSMatrix=e()})(function(){var e,t,n,r,i;return function(e,t,n){function r(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(i)return i(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var i=e[n][1][t];return r(i?i:t)},u,u.exports)}return t[n].exports}var i=typeof require=="function"&&require;for(var s=0;s<n.length;s++)r(n[s]);return r}({1:[function(e,t,n){var r=e("./lib/XCSSMatrix.js");t.exports=r},{"./lib/XCSSMatrix.js":2}],2:[function(e,t,n){function i(e){this.m11=this.m22=this.m33=this.m44=1;this.m12=this.m13=this.m14=this.m21=this.m23=this.m24=this.m31=this.m32=this.m34=this.m41=this.m42=this.m43=0;if(typeof e==="string"){this.setMatrixValue(e)}}function u(e){return String.fromCharCode(e+97)}function a(e){return"m"+(Math.floor(e/4)+1)+(e%4+1)}function l(e){return e.value}function c(e){return f[e]}function h(e){if(e.units==="rad"){e.value=r.angles.rad2deg(e.value);e.units="deg"}else if(e.units==="grad"){e.value=r.angles.grad2deg(e.value);e.units="deg"}return e}function p(e,t){t.value=t.value.map(h);var n=c(t.key);var r=n(e,t);return r||e}function d(e){var t=r.transp.stringToStatements(e);if(t.length===1&&/^matrix/.test(e)){return e}var n=r.funcs.onlyFirstArg(r.transp.statementToObject);var s=t.map(n);var o=new i;var u=s.reduce(p,o);var a=u.toString();return a}var r={angles:e("./utils/angle"),matrix:e("./utils/matrix"),transp:e("./utils/cssTransformString"),funcs:{onlyFirstArg:function(e,t){t=t||this;return function(n){return e.call(t,n)}}}};i.displayName="XCSSMatrix";var s=["a","b","c","d","e","f"];var o=["m11","m12","m13","m14","m21","m22","m23","m24","m31","m32","m33","m34","m41","m42","m43","m44"];[["m11","a"],["m12","b"],["m21","c"],["m22","d"],["m41","e"],["m42","f"]].forEach(function(e){var t=e[0],n=e[1];Object.defineProperty(i.prototype,n,{set:function(e){this[t]=e},get:function(){return this[t]},enumerable:true,configurable:true})});i.prototype.multiply=function(e){return r.matrix.multiply(this,e)};i.prototype.inverse=function(){return r.matrix.inverse(this)};i.prototype.rotate=function(e,t,n){if(typeof e!=="number"||isNaN(e))e=0;if((typeof t!=="number"||isNaN(t))&&(typeof n!=="number"||isNaN(n))){n=e;e=0;t=0}if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;e=r.angles.deg2rad(e);t=r.angles.deg2rad(t);n=r.angles.deg2rad(n);var s=new i,o=new i,u=new i,a,f,l;n/=2;a=Math.sin(n);f=Math.cos(n);l=a*a;u.m11=u.m22=1-2*l;u.m12=u.m21=2*a*f;u.m21*=-1;t/=2;a=Math.sin(t);f=Math.cos(t);l=a*a;o.m11=o.m33=1-2*l;o.m13=o.m31=2*a*f;o.m13*=-1;e/=2;a=Math.sin(e);f=Math.cos(e);l=a*a;s.m22=s.m33=1-2*l;s.m23=s.m32=2*a*f;s.m32*=-1;var c=new i;var h=this.toString()===c.toString();var p=h?u.multiply(o).multiply(s):this.multiply(s).multiply(o).multiply(u);return p};i.prototype.rotateAxisAngle=function(e,t,n,s){if(typeof e!=="number"||isNaN(e))e=0;if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;if(typeof s!=="number"||isNaN(s))s=0;if(e===0&&t===0&&n===0)n=1;s=(r.angles.deg2rad(s)||0)/2;var o=new i,u=Math.sqrt(e*e+t*t+n*n),a=Math.cos(s),f=Math.sin(s),l=f*f,c=f*a,h=function(e){return parseFloat(e.toFixed(6))},p,d,v;if(u===0){e=0;t=0;n=1}else if(u!==1){e/=u;t/=u;n/=u}if(e===1&&t===0&&n===0){o.m22=o.m33=1-2*l;o.m23=o.m32=2*c;o.m32*=-1}else if(e===0&&t===1&&n===0){o.m11=o.m33=1-2*l;o.m13=o.m31=2*c;o.m13*=-1}else if(e===0&&t===0&&n===1){o.m11=o.m22=1-2*l;o.m12=o.m21=2*c;o.m21*=-1}else{p=e*e;d=t*t;v=n*n;o.m11=h(1-2*(d+v)*l);o.m12=h(2*(e*t*l+n*c));o.m13=h(2*(e*n*l-t*c));o.m21=h(2*(e*t*l-n*c));o.m22=h(1-2*(p+v)*l);o.m23=h(2*(t*n*l+e*c));o.m31=h(2*(e*n*l+t*c));o.m32=h(2*(t*n*l-e*c));o.m33=h(1-2*(p+d)*l)}return this.multiply(o)};i.prototype.scale=function(e,t,n){var r=new i;if(typeof e!=="number"||isNaN(e))e=1;if(typeof t!=="number"||isNaN(t))t=e;if(typeof n!=="number"||isNaN(n))n=1;r.m11=e;r.m22=t;r.m33=n;return this.multiply(r)};i.prototype.skewX=function(e){var t=r.angles.deg2rad(e);var n=new i;n.c=Math.tan(t);return this.multiply(n)};i.prototype.skewY=function(e){var t=r.angles.deg2rad(e);var n=new i;n.b=Math.tan(t);return this.multiply(n)};i.prototype.translate=function(e,t,n){var r=new i;if(typeof e!=="number"||isNaN(e))e=0;if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;r.m41=e;r.m42=t;r.m43=n;return this.multiply(r)};i.prototype.setMatrixValue=function(e){var t=d(e.trim());var n=r.transp.statementToObject(t);if(!n)return;var i=n.key===r.transp.matrixFn3d;var s=i?a:u;var o=n.value;var f=o.length;if(i&&f!==16||!(i||f===6))return;o.forEach(function(e,t){var n=s(t);this[n]=e.value},this)};i.prototype.toString=function(){var e,t;if(r.matrix.isAffine(this)){t=r.transp.matrixFn2d;e=s}else{t=r.transp.matrixFn3d;e=o}return t+"("+e.map(function(e){return this[e].toFixed(6)},this).join(", ")+")"};var f={matrix:function(e,t){var n=new i(t.unparsed);return e.multiply(n)},matrix3d:function(e,t){var n=new i(t.unparsed);return e.multiply(n)},perspective:function(e,t){var n=new i;n.m34-=1/t.value[0].value;return e.multiply(n)},rotate:function(e,t){return e.rotate.apply(e,t.value.map(l))},rotate3d:function(e,t){return e.rotateAxisAngle.apply(e,t.value.map(l))},rotateX:function(e,t){return e.rotate.apply(e,[t.value[0].value,0,0])},rotateY:function(e,t){return e.rotate.apply(e,[0,t.value[0].value,0])},rotateZ:function(e,t){return e.rotate.apply(e,[0,0,t.value[0].value])},scale:function(e,t){return e.scale.apply(e,t.value.map(l))},scale3d:function(e,t){return e.scale.apply(e,t.value.map(l))},scaleX:function(e,t){return e.scale.apply(e,t.value.map(l))},scaleY:function(e,t){return e.scale.apply(e,[0,t.value[0].value,0])},scaleZ:function(e,t){return e.scale.apply(e,[0,0,t.value[0].value])},skew:function(e,t){var n=new i("skewX("+t.value[0].unparsed+")");var r=new i("skewY("+(t.value[1]&&t.value[1].unparsed||0)+")");var s="matrix(1.00000, "+r.b+", "+n.c+", 1.000000, 0.000000, 0.000000)";var o=new i(s);return e.multiply(o)},skewX:function(e,t){return e.skewX.apply(e,[t.value[0].value])},skewY:function(e,t){return e.skewY.apply(e,[t.value[0].value])},translate:function(e,t){return e.translate.apply(e,t.value.map(l))},translate3d:function(e,t){return e.translate.apply(e,t.value.map(l))},translateX:function(e,t){return e.translate.apply(e,[t.value[0].value,0,0])},translateY:function(e,t){return e.translate.apply(e,[0,t.value[0].value,0])},translateZ:function(e,t){return e.translate.apply(e,[0,0,t.value[0].value])}};t.exports=i},{"./utils/angle":3,"./utils/matrix":4,"./utils/cssTransformString":5}],4:[function(e,t,n){function r(e,t,n,r){return e*r-t*n}function i(e,t,n,i,s,o,u,a,f){return e*r(s,o,a,f)-i*r(t,n,a,f)+u*r(t,n,s,o)}function s(e){var t=e,n=t.m11,r=t.m21,s=t.m31,o=t.m41,u=t.m12,a=t.m22,f=t.m32,l=t.m42,c=t.m13,h=t.m23,p=t.m33,d=t.m43,v=t.m14,m=t.m24,g=t.m34,y=t.m44;return n*i(a,h,m,f,p,g,l,d,y)-r*i(u,c,v,f,p,g,l,d,y)+s*i(u,c,v,a,h,m,l,d,y)-o*i(u,c,v,a,h,m,f,p,g)}function o(e){return e.m13===0&&e.m14===0&&e.m23===0&&e.m24===0&&e.m31===0&&e.m32===0&&e.m33===1&&e.m34===0&&e.m43===0&&e.m44===1}function u(e){var t=e;return t.m11===1&&t.m12===0&&t.m13===0&&t.m14===0&&t.m21===0&&t.m22===1&&t.m23===0&&t.m24===0&&t.m31===0&&t.m31===0&&t.m33===1&&t.m34===0&&t.m44===1}function a(e){var t=e,n=new e.constructor,r=t.m11,s=t.m12,o=t.m13,u=t.m14,a=t.m21,f=t.m22,l=t.m23,c=t.m24,h=t.m31,p=t.m32,d=t.m33,v=t.m34,m=t.m41,g=t.m42,y=t.m43,b=t.m44;n.m11=i(f,p,g,l,d,y,c,v,b);n.m21=-i(a,h,m,l,d,y,c,v,b);n.m31=i(a,h,m,f,p,g,c,v,b);n.m41=-i(a,h,m,f,p,g,l,d,y);n.m12=-i(s,p,g,o,d,y,u,v,b);n.m22=i(r,h,m,o,d,y,u,v,b);n.m32=-i(r,h,m,s,p,g,u,v,b);n.m42=i(r,h,m,s,p,g,o,d,y);n.m13=i(s,f,g,o,l,y,u,c,b);n.m23=-i(r,a,m,o,l,y,u,c,b);n.m33=i(r,a,m,s,f,g,u,c,b);n.m43=-i(r,a,m,s,f,g,o,l,y);n.m14=-i(s,f,p,o,l,d,u,c,v);n.m24=i(r,a,h,o,l,d,u,c,v);n.m34=-i(r,a,h,s,f,p,u,c,v);n.m44=i(r,a,h,s,f,p,o,l,d);return n}function f(e){var t;if(u(e)){t=new e.constructor;if(!(e.m41===0&&e.m42===0&&e.m43===0)){t.m41=-e.m41;t.m42=-e.m42;t.m43=-e.m43}return t}var n=a(e);var r=s(e);if(Math.abs(r)<1e-8)return null;for(var i=1;i<5;i++){for(var o=1;o<5;o++){n["m"+i+o]/=r}}return n}function l(e,t){if(!t)return null;var n=t,r=e,i=new e.constructor;i.m11=n.m11*r.m11+n.m12*r.m21+n.m13*r.m31+n.m14*r.m41;i.m12=n.m11*r.m12+n.m12*r.m22+n.m13*r.m32+n.m14*r.m42;i.m13=n.m11*r.m13+n.m12*r.m23+n.m13*r.m33+n.m14*r.m43;i.m14=n.m11*r.m14+n.m12*r.m24+n.m13*r.m34+n.m14*r.m44;i.m21=n.m21*r.m11+n.m22*r.m21+n.m23*r.m31+n.m24*r.m41;i.m22=n.m21*r.m12+n.m22*r.m22+n.m23*r.m32+n.m24*r.m42;i.m23=n.m21*r.m13+n.m22*r.m23+n.m23*r.m33+n.m24*r.m43;i.m24=n.m21*r.m14+n.m22*r.m24+n.m23*r.m34+n.m24*r.m44;i.m31=n.m31*r.m11+n.m32*r.m21+n.m33*r.m31+n.m34*r.m41;i.m32=n.m31*r.m12+n.m32*r.m22+n.m33*r.m32+n.m34*r.m42;i.m33=n.m31*r.m13+n.m32*r.m23+n.m33*r.m33+n.m34*r.m43;i.m34=n.m31*r.m14+n.m32*r.m24+n.m33*r.m34+n.m34*r.m44;i.m41=n.m41*r.m11+n.m42*r.m21+n.m43*r.m31+n.m44*r.m41;i.m42=n.m41*r.m12+n.m42*r.m22+n.m43*r.m32+n.m44*r.m42;i.m43=n.m41*r.m13+n.m42*r.m23+n.m43*r.m33+n.m44*r.m43;i.m44=n.m41*r.m14+n.m42*r.m24+n.m43*r.m34+n.m44*r.m44;return i}function c(e){var t=new e.constructor;var n=4,r=4;var i=r,s;while(i){s=n;while(s){t["m"+i+s]=e["m"+s+i];s--}i--}return t}t.exports={determinant2x2:r,determinant3x3:i,determinant4x4:s,isAffine:o,isIdentityOrTranslation:u,adjoint:a,inverse:f,multiply:l}},{}],3:[function(e,t,n){function r(e){return e*Math.PI/180}function i(e){return e*(180/Math.PI)}function s(e){return e/(400/360)}t.exports={deg2rad:r,rad2deg:i,grad2deg:s}},{}],5:[function(e,t,n){function r(e){var t=/([\-\+]?[0-9]+[\.0-9]*)(deg|rad|grad|px|%)*/;var n=e.match(t)||[];return{value:parseFloat(n[1]),units:n[2],unparsed:e}}function i(e,t){var n=/(\w+)\(([^\)]+)\)/i;var i=e.toString().match(n).slice(1);var s=i[0];var o=i[1].split(/, ?/);var u=!t&&o.map(r);return{key:s,value:u||o,unparsed:e}}function s(e){var t=/(\w+)\([^\)]+\)/ig;var n=e.match(t)||[];return n}t.exports={matrixFn2d:"matrix",matrixFn3d:"matrix3d",valueToObject:r,statementToObject:i,stringToStatements:s}},{}]},{},[1])(1)});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
module.exports = [
	'x',
	'y',
	'z',
	'scaleX',
	'scaleY',
	'scaleZ',
	'rotationX',
	'rotationY',
	'rotationZ'
];
},{}],12:[function(require,module,exports){
var _div = document.createElement('div'),

	_testProps = function(arr) {
		var idx = arr.length;
		while (idx--) {
			if (_div.style[arr[idx]] !== undefined) {
				return arr[idx];
			}
		}

		return '';
	};

module.exports = {
	transform: _testProps([
		'transform',
		'msTransform',
		'oTransform',
		'mozTransform',
		'webkitTransform'
	])
};

_div = null;
},{}],13:[function(require,module,exports){
var _ = require('../utils'),

	Elem = require('./Elem'),
	Obj = require('./Obj');

var Elems = function(arr) {
	this._arr = _.map(arr, function(obj) {
		return _.isElement(obj) ? new Elem(obj) : new Obj(obj);
	});

	this._matrixArr = [];
};

Elems.prototype = {
	value: function() {
		return this;
	},

	each: function(iterator) {
		var idx = 0, length = this._arr.length;
		for (; idx < length; idx++) {
			iterator(this._arr[idx], idx);
		}
		return this;
	},

	matrix: function() {
		return _.fastmap(this._arr, function(elem) {
			return elem.matrix();
		}, this._matrixArr);
	},

	from: function(obj) {
		var idx = this._arr.length;
		while (idx--) {
			this._arr[idx].from(obj);
		}
		return this;
	},

	to: function(obj) {
		var idx = this._arr.length;
		while (idx--) {
			this._arr[idx].to(obj);
		}
		return this;
	},

	yoyo: function(yoyo) {
		var idx = this._arr.length;
		while (idx--) {
			this._arr[idx].yoyo(yoyo);
		}
		return this;
	},

	update: function(perc) {
		var idx = 0, length = this._arr.length;
		for (; idx < length; idx++) {
			this._arr[idx].update(perc);
		}
		return this;
	},

	reverse: function() {
		var idx = this._arr.length;
		while (idx--) {
			this._arr[idx].reverse();
		}
		return this;
	},

	start: function() {
		var idx = 0, length = this._arr.length;
		for (; idx < length; idx++) {
			this._arr[idx].start();
		}
		return this;
	}
};

module.exports = Elems;
},{"../utils":16,"./Elem":14,"./Obj":15}],14:[function(require,module,exports){
var _ = require('../utils'),

	_props = require('../styles/props'),
	
	WebMatrix = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : require('../polyfills/XCSSMatrix'),
	
	Matrix = require('../Matrix'),

	Obj = require('./Obj');

var _getComputedMatrix = function(computedStyles) {
		return new WebMatrix(computedStyles[_props.transform]);
	},

	_getComputedStyle = function(elem) {
		return document.defaultView.getComputedStyle(elem);
	};

var Elem = function(elem) {
	this._elem = elem;

	this._obj = new Obj();
};

Elem.prototype = {
	value: function() {
		return this._elem;
	},

	matrix: function() {
		return this._obj.matrix();
	},

	from: function(obj) {
		this._obj.from(obj);
	},

	to: function(obj) {
		this._obj.to(obj);
		return this;
	},

	yoyo: function(yoyo) {
		this._obj.yoyo(yoyo);
		return this;
	},

	update: function(perc) {
		this._obj.update(perc);
		return this;
	},

	applyMatrix: function(matrix) {
		if (!matrix) { return; }
		this._elem.style[_props.transform] = matrix.toString();
	},

	reverse: function() {
		this._obj.reverse();
		return this;
	},

	start: function() {
		var computedStyles;
		// If from hasn't been set on the object
		if (!_.hasSize(this._obj.value())) {

			computedStyles = _getComputedStyle(this._elem);

			var from = {},
				to = this._obj.getTo();
			for (var property in to) {
				from[property] = computedStyles[property];
			}

			this._obj.from(from);

		}

		// start the object...
		this._obj.start();

		// ...so that we can check if it has a matrix set.
		// If it does, make sure we set a starting point
		// for the matrix based off of the element's current
		// transformation
		var objectMatrix = this._obj.hasMatrix();
		if (objectMatrix) {
			this._obj.setMatrixStart(
				new Matrix(
					// reuse the computed matrix if we can
					_getComputedMatrix(computedStyles || _getComputedStyle(this._elem))
				)
			);
		}
	}
};

module.exports = Elem;
},{"../Matrix":3,"../polyfills/XCSSMatrix":10,"../styles/props":12,"../utils":16,"./Obj":15}],15:[function(require,module,exports){
var _ = require('../utils'),
	
	_matrixAnimatables = require('../styles/matrix-animatables'),
	
	Matrix = require('../Matrix'),

	_expandShorthand = function(obj) {
		if (obj.scale !== undefined) {
			obj.scaleX = obj.scale;
			obj.scaleY = obj.scale;
		}
		if (obj.rotation !== undefined) {
			obj.rotationZ = to.rotation;
		}
		return obj;
	};

var Obj = function(obj) {
	this._object = obj ? _expandShorthand(obj) : {};

	this._valuesStart       = {};
	this._valuesEnd         = {};
	this._valuesStartRepeat = {};
	this._yoyo              = false;

	// Matrix stuffs are only created if
	// there are matrix transformations	
	// this._matrix             = new Matrix();
	// this._currentMatrixState = matrix;
	// this._matrixStart        = {};
	// this._matrixEnd          = {};
};

Obj.prototype = {
	// Used by Elem -----
	setMatrixStart: function(matrix) {
		this._matrixStart = matrix;
		return this;
	},
	hasMatrix: function() {
		return !!this._matrix;
	},
	getTo: function() {
		return this._valuesEnd;
	},
	// -------------------

	value: function() {
		return this._object;
	},

	from: function(obj) {
		this._object = _expandShorthand(obj);
		return this;
	},

	matrix: function() {
		return this._currentMatrixState;
	},

	to: function(obj) {
		this._valuesEnd = _expandShorthand(obj);
		return this;
	},

	yoyo: function(yoyo) {
		this._yoyo = yoyo;
		return this;
	},

	update: function(perc) {
		for (var property in this._valuesEnd) {

			var start = this._valuesStart[property] || 0,
				end = this._valuesEnd[property];

			// Parses relative end values with start as base (e.g.: +10, -3)
			if (_.isString(end)) {
				end = start + parseFloat(end, 10);
			}

			// protect against non numeric properties.
			if (end === +end) {
				this._object[property] = start + (end - start) * perc;
			}
		}

		if (this._matrix) {
			for (property in this._matrixEnd) {

				var matrixStart = this._matrixStart[property],
					matrixEnd = this._matrixEnd[property];

				this._matrix[property] = matrixStart + (matrixEnd - matrixStart) * perc;

				this._currentMatrixState = this._matrix.update();

				this._object[property] = this._matrix[property];
			}
		}

		return this;
	},

	reverse: function() {
		var tmp;
		// reassign starting values
		for (var property in this._valuesStartRepeat) {

			if (_.isString(this._valuesEnd[property])) {
				this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property], 10);
			}

			if (this._yoyo) {
				tmp = this._valuesStartRepeat[property];
				this._valuesStartRepeat[property] = this._valuesEnd[property];
				this._valuesEnd[property] = tmp;
			}

			this._valuesStart[property] = this._valuesStartRepeat[property];

		}

		if (this._matrix) {
			for (property in this._matrixStartRepeat) {

				if (_.isString(this._matrixEnd[property])) {
					this._matrixStartRepeat[property] = this._matrixStartRepeat[property] + parseFloat(this._matrixEnd[property], 10);
				}

				if (this._yoyo) {
					tmp = this._matrixStartRepeat[property];
					this._matrixStartRepeat[property] = this._matrixEnd[property];
					this._matrixEnd[property] = tmp;
				}

				this._matrixStart[property] = this._matrixStartRepeat[property];

			}
		}

		return this;
	},

	start: function() {
		for (var property in this._valuesEnd) {

			// omit unchanged properties
			if (this._valuesEnd[property] === this._object[property]) {
				delete this._valuesEnd[property];
				continue;
			}

			this._valuesStart[property] = this._object[property];

			this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			
			this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
		}


		// translate matrix values over to _matrixStart
		var matrixEnd,
			idx = _matrixAnimatables.length,
			animatable;
		while (idx--) {
			animatable = _matrixAnimatables[idx];
			
			if (this._valuesEnd[animatable] !== undefined) {

				matrixEnd = (matrixEnd || {});

				matrixEnd[animatable] = this._valuesEnd[animatable];

				// remove from _valuesStart and _valuesEnd so that we don't
				// perform calculations on them
				delete this._valuesEnd[animatable];
			}
		}

		// requires a matrix
		if (matrixEnd) {
			this._matrix = new Matrix();

			this._matrixEnd = matrixEnd;

			this._matrixStart = this._matrixStart || {};
			this._matrixStartRepeat = {};

			for (property in this._matrixEnd) {

				this._matrixStart[property] = this._matrixStart[property] || this._valuesStart[property] || 0;

				this._matrixStart[property] *= 1.0; // Ensures we're using numbers, not strings

				this._matrixStartRepeat[property] = this._matrixStart[property] || 0;

			}

		}

		return this;
	}

};

module.exports = Obj;
},{"../Matrix":3,"../styles/matrix-animatables":11,"../utils":16}],16:[function(require,module,exports){
var _toString = Object.prototype.toString;

module.exports = {
	noop: function() {},
	
	isArrayLike: function(obj) {
		return (!!obj && obj.length === +obj.length);
	},

	isElement: function(obj) {
		return !!(obj && obj.nodeType === 1);
	},

	isString: function(obj) {
		return _toString.call(obj) === '[object String]';
	},

	isNumber: function(obj) {
		return _toString.call(obj) === '[object Number]';
	},

	exists: function(obj) {
		return (obj !== null && obj !== undefined);
	},

	map: function(arr, iterator) {
		var result = [],
			idx = 0, length = arr.length;
		for (; idx < length; idx++) {
			result[idx] = iterator(arr[idx], idx);
		}
		return result;
	},

	fastmap: function(arr, iterator, result) {
		var idx = 0, length = arr.length;
		for (; idx < length; idx++) {
			result[idx] = iterator(arr[idx], idx);
		}
		return result;
	},

	hasSize: function(obj) {
		if (!obj) { return false; }
		for (var key in obj) { return true; }
		return false;
	},

	extend: function() {
		var args = arguments,
			obj = args[0],
			idx = 1, length = args.length;

		if (!obj) { return obj; }

		for (; idx < length; idx++) {
			var source = args[idx];
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		}

		return obj;
	},

	now: (window.performance !== undefined && window.performance.now !== undefined) ?
		// Wrap in function to avoid illegal reference errors
		function() { return window.performance.now(); } :
		// Fallback to now
		Date.now ? Date.now : function() { return new Date().getTime(); }
};
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcX0RldlxcQW5pbUpTXFxub2RlX21vZHVsZXNcXGdydW50LWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovX0Rldi9BbmltSlMvc3JjL0Vhc2luZy5qcyIsIkM6L19EZXYvQW5pbUpTL3NyYy9GTFVYLmpzIiwiQzovX0Rldi9BbmltSlMvc3JjL01hdHJpeC5qcyIsIkM6L19EZXYvQW5pbUpTL3NyYy9hbmltYXRpb25zL1NwcmluZy5qcyIsIkM6L19EZXYvQW5pbUpTL3NyYy9hbmltYXRpb25zL1R3ZWVuLmpzIiwiQzovX0Rldi9BbmltSlMvc3JjL2FuaW1hdG9ycy9BbmltYXRvci5qcyIsIkM6L19EZXYvQW5pbUpTL3NyYy9hbmltYXRvcnMvRmx1eFNwcmluZy5qcyIsIkM6L19EZXYvQW5pbUpTL3NyYy9hbmltYXRvcnMvRmx1eFR3ZWVuLmpzIiwiQzovX0Rldi9BbmltSlMvc3JjL2xvb3AuanMiLCJDOi9fRGV2L0FuaW1KUy9zcmMvcG9seWZpbGxzL1hDU1NNYXRyaXguanMiLCJDOi9fRGV2L0FuaW1KUy9zcmMvc3R5bGVzL21hdHJpeC1hbmltYXRhYmxlcy5qcyIsIkM6L19EZXYvQW5pbUpTL3NyYy9zdHlsZXMvcHJvcHMuanMiLCJDOi9fRGV2L0FuaW1KUy9zcmMvdHJhbnNmb3JtZXJzL0NvbGxlY3Rpb24uanMiLCJDOi9fRGV2L0FuaW1KUy9zcmMvdHJhbnNmb3JtZXJzL0VsZW0uanMiLCJDOi9fRGV2L0FuaW1KUy9zcmMvdHJhbnNmb3JtZXJzL09iai5qcyIsIkM6L19EZXYvQW5pbUpTL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gZnJvbSB0aGUgYW1hemluZyBzb2xlXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zb2xlL3R3ZWVuLmpzL1xyXG52YXIgRWFzaW5nID0ge1xyXG5cclxuXHRMaW5lYXI6IHtcclxuXHJcblx0XHROb25lOiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gaztcclxuXHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblxyXG5cdFF1YWRyYXRpYzoge1xyXG5cclxuXHRcdEluOiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gayAqIGs7XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRPdXQ6IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHJldHVybiBrICogKDIgLSBrKTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdEluT3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7IHJldHVybiAwLjUgKiBrICogazsgfVxyXG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoLS1rICogKGsgLSAyKSAtIDEpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0Q3ViaWM6IHtcclxuXHJcblx0XHRJbjogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIGsgKiBrICogaztcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdE91dDogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICsgMTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdEluT3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7IHJldHVybiAwLjUgKiBrICogayAqIGs7IH1cclxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICsgMik7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHRRdWFydGljOiB7XHJcblxyXG5cdFx0SW46IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0T3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gMSAtICgtLWsgKiBrICogayAqIGspO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHsgcmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGs7IH1cclxuXHRcdFx0cmV0dXJuIC0gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrIC0gMik7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHRRdWludGljOiB7XHJcblxyXG5cdFx0SW46IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrICogaztcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdE91dDogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHsgcmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGsgKiBrOyB9XHJcblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogayAqIGsgKiBrICsgMik7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHRTaW51c29pZGFsOiB7XHJcblxyXG5cdFx0SW46IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHJldHVybiAxIC0gTWF0aC5jb3MoayAqIE1hdGguUEkgLyAyKTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdE91dDogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIE1hdGguc2luKGsgKiBNYXRoLlBJIC8gMik7XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRJbk91dDogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGspKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblxyXG5cdEV4cG9uZW50aWFsOiB7XHJcblxyXG5cdFx0SW46IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHJldHVybiBrID09PSAwID8gMCA6IE1hdGgucG93KDEwMjQsIGsgLSAxKTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdE91dDogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KDIsIC0gMTAgKiBrKTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdEluT3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRpZiAoayA9PT0gMCkgeyByZXR1cm4gMDsgfVxyXG5cdFx0XHRpZiAoayA9PT0gMSkgeyByZXR1cm4gMTsgfVxyXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7IHJldHVybiAwLjUgKiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7IH1cclxuXHRcdFx0cmV0dXJuIDAuNSAqICgtIE1hdGgucG93KDIsIC0gMTAgKiAoayAtIDEpKSArIDIpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0Q2lyY3VsYXI6IHtcclxuXHJcblx0XHRJbjogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoMSAtIGsgKiBrKTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdE91dDogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gKC0tayAqIGspKTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdEluT3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7IHJldHVybiAtIDAuNSAqIChNYXRoLnNxcnQoMSAtIGsgKiBrKSAtIDEpOyB9XHJcblx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAoayAtPSAyKSAqIGspICsgMSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHRFbGFzdGljOiB7XHJcblxyXG5cdFx0SW46IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHZhciBzLCBhID0gMC4xLCBwID0gMC40O1xyXG5cdFx0XHRpZiAoayA9PT0gMCkgeyByZXR1cm4gMDsgfVxyXG5cdFx0XHRpZiAoayA9PT0gMSkgeyByZXR1cm4gMTsgfVxyXG5cdFx0XHRpZiAoIWEgfHwgYSA8IDEpIHtcclxuXHRcdFx0XHRhID0gMTsgcyA9IHAgLyA0O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHMgPSBwICogTWF0aC5hc2luKDEgLyBhKSAvICgyICogTWF0aC5QSSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIC0gKGEgKiBNYXRoLnBvdygyLCAxMCAqIChrIC09IDEpKSAqIE1hdGguc2luKChrIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0T3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHR2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcclxuXHRcdFx0aWYgKGsgPT09IDApIHsgcmV0dXJuIDA7IH1cclxuXHRcdFx0aWYgKGsgPT09IDEpIHsgcmV0dXJuIDE7IH1cclxuXHRcdFx0aWYgKCFhIHx8IGEgPCAxKSB7XHJcblx0XHRcdFx0YSA9IDE7IHMgPSBwIC8gNDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQgcyA9IHAgKiBNYXRoLmFzaW4oMSAvIGEpIC8gKDIgKiBNYXRoLlBJKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gKGEgKiBNYXRoLnBvdygyLCAtIDEwICogaykgKiBNYXRoLnNpbigoayAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICsgMSk7XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRJbk91dDogZnVuY3Rpb24oaykge1xyXG5cclxuXHRcdFx0dmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XHJcblx0XHRcdGlmIChrID09PSAwKSB7IHJldHVybiAwOyB9XHJcblx0XHRcdGlmIChrID09PSAxKSB7IHJldHVybiAxOyB9XHJcblx0XHRcdGlmICghYSB8fCBhIDwgMSkge1xyXG5cdFx0XHRcdGEgPSAxOyBzID0gcCAvIDQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cyA9IHAgKiBNYXRoLmFzaW4oMSAvIGEpIC8gKDIgKiBNYXRoLlBJKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7IHJldHVybiAtIDAuNSAqIChhICogTWF0aC5wb3coMiwgMTAgKiAoayAtPSAxKSkgKiBNYXRoLnNpbigoayAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKTsgfVxyXG5cdFx0XHRyZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqIChrIC09IDEpKSAqIE1hdGguc2luKChrIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKiAwLjUgKyAxO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0QmFjazoge1xyXG5cclxuXHRcdEluOiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XHJcblx0XHRcdHJldHVybiBrICogayAqICgocyArIDEpICogayAtIHMpO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0T3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XHJcblx0XHRcdHJldHVybiAtLWsgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAxO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xyXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7IHJldHVybiAwLjUgKiAoayAqIGsgKiAoKHMgKyAxKSAqIGsgLSBzKSk7IH1cclxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiAoKHMgKyAxKSAqIGsgKyBzKSArIDIpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0Qm91bmNlOiB7XHJcblxyXG5cdFx0SW46IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdHJldHVybiAxIC0gRWFzaW5nLkJvdW5jZS5PdXQoMSAtIGspO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0T3V0OiBmdW5jdGlvbihrKSB7XHJcblxyXG5cdFx0XHRpZiAoayA8ICgxIC8gMi43NSkpIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChrIDwgKDIgLyAyLjc1KSkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDEuNSAvIDIuNzUpKSAqIGsgKyAwLjc1O1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChrIDwgKDIuNSAvIDIuNzUpKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMi4yNSAvIDIuNzUpKSAqIGsgKyAwLjkzNzU7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDIuNjI1IC8gMi43NSkpICogayArIDAuOTg0Mzc1O1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uKGspIHtcclxuXHJcblx0XHRcdGlmIChrIDwgMC41KSB7IHJldHVybiBFYXNpbmcuQm91bmNlLkluKGsgKiAyKSAqIDAuNTsgfVxyXG5cdFx0XHRyZXR1cm4gRWFzaW5nLkJvdW5jZS5PdXQoayAqIDIgLSAxKSAqIDAuNSArIDAuNTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVhc2luZzsiLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5GTFVYID0ge1xyXG5cdFR3ZWVuOiByZXF1aXJlKCcuL2FuaW1hdG9ycy9GbHV4VHdlZW4nKSxcclxuXHRTcHJpbmc6IHJlcXVpcmUoJy4vYW5pbWF0b3JzL0ZsdXhTcHJpbmcnKSxcclxuXHRcclxuXHRFYXNpbmc6IHJlcXVpcmUoJy4vRWFzaW5nJyksXHJcblx0dXBkYXRlOiByZXF1aXJlKCcuL2xvb3AnKS51cGRhdGVcclxufTsiLCJ2YXIgV2ViTWF0cml4ID0gd2luZG93LldlYktpdENTU01hdHJpeCA/IHdpbmRvdy5XZWJLaXRDU1NNYXRyaXggOiByZXF1aXJlKCcuL3BvbHlmaWxscy9YQ1NTTWF0cml4JyksXHJcblxyXG5cdF9lbXB0eU1hdHJpeCA9IG5ldyBXZWJNYXRyaXgoKSxcclxuXHJcblx0X0VNUFRZX01BVFJJWF9ERUZBVUxUUyA9IHtcclxuXHRcdHg6ICAgICAgICAgMCxcclxuXHRcdHk6ICAgICAgICAgMCxcclxuXHRcdHo6ICAgICAgICAgMCxcclxuXHRcdHNjYWxlWDogICAgMCxcclxuXHRcdHNjYWxlWTogICAgMCxcclxuXHRcdHNjYWxlWjogICAgMCxcclxuXHRcdHJvdGF0aW9uWDogMCxcclxuXHRcdHJvdGF0aW9uWTogMCxcclxuXHRcdHJvdGF0aW9uWjogMFxyXG5cdH0sXHJcblxyXG5cdF9kZWNvbXBvc2VPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcclxuXHRcdG9iaiA9IF8uZXh0ZW5kKHt9LCBfRU1QVFlfTUFUUklYX0RFRkFVTFRTLCBvYmopO1xyXG5cdFx0dmFyIG1hdHJpeCA9IF9lbXB0eU1hdHJpeDtcclxuXHRcdG1hdHJpeCA9IG1hdHJpeC50cmFuc2xhdGUob2JqLngsIG9iai55LCBvYmoueik7XHJcblx0XHRtYXRyaXggPSBtYXRyaXgucm90YXRlKG9iai5yb3RhdGlvblgsIG9iai5yb3RhdGlvblksIG9iai5yb3RhdGlvblopO1xyXG5cdFx0bWF0cml4ID0gbWF0cml4LnNjYWxlKG9iai5zY2FsZVgsIG9iai5zY2FsZVksIG9iai5zY2FsZVopO1xyXG5cdFx0cmV0dXJuIG1hdHJpeDtcclxuXHR9LFxyXG5cclxuXHRfZGVjb21wb3NlV2ViTWF0cml4ID0gZnVuY3Rpb24obSkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cdFx0cmVzdWx0LnRyYW5zbGF0aW9uID0ge1xyXG5cdFx0XHR4OiBtLm00MSxcclxuXHRcdFx0eTogbS5tNDIsXHJcblx0XHRcdHo6IG0ubTQzXHJcblx0XHR9O1xyXG5cdFx0cmVzdWx0LnNjYWxlID0ge1xyXG5cdFx0XHR4OiBNYXRoLnNxcnQobS5tMTEgKiBtLm0xMSArIG0ubTEyICogbS5tMTIgKyBtLm0xMyAqIG0ubTEzKSxcclxuXHRcdFx0eTogTWF0aC5zcXJ0KG0ubTIxICogbS5tMjEgKyBtLm0yMiAqIG0ubTIyICsgbS5tMjMgKiBtLm0yMyksXHJcblx0XHRcdHo6IE1hdGguc3FydChtLm0zMSAqIG0ubTMxICsgbS5tMzIgKiBtLm0zMiArIG0ubTMzICogbS5tMzMpXHJcblx0XHR9O1xyXG5cdFx0cmVzdWx0LnJvdGF0aW9uID0ge1xyXG5cdFx0XHR4OiAtTWF0aC5hdGFuMihtLm0zMiAvIHJlc3VsdC5zY2FsZS56LCBtLm0zMyAvIHJlc3VsdC5zY2FsZS56KSxcclxuXHRcdFx0eTogTWF0aC5hc2luKG0ubTMxIC8gcmVzdWx0LnNjYWxlLnopLFxyXG5cdFx0XHR6OiAtTWF0aC5hdGFuMihtLm0yMSAvIHJlc3VsdC5zY2FsZS55LCBtLm0xMSAvIHJlc3VsdC5zY2FsZS54KVxyXG5cdFx0fTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fTtcclxuXHJcbnZhciBNYXRyaXggPSBmdW5jdGlvbihtYXRyaXgpIHtcclxuXHRpZiAobWF0cml4IGluc3RhbmNlb2YgV2ViTWF0cml4KSB7XHJcblx0XHRcclxuXHRcdC8vIFdlYm1hdHJpeFxyXG5cdFx0dGhpcy5mcm9tKF9kZWNvbXBvc2VXZWJNYXRyaXgobWF0cml4KSk7XHJcblxyXG5cdH0gZWxzZSBpZiAobWF0cml4KSB7XHJcblxyXG5cdFx0Ly8gUGxhaW4gb2JqZWN0XHJcblx0XHR0aGlzLmZyb20oX2RlY29tcG9zZVdlYk1hdHJpeChfZGVjb21wb3NlT2JqZWN0KG1hdHJpeCkpKTtcclxuXHRcclxuXHR9XHJcbn07XHJcblxyXG5NYXRyaXgucHJvdG90eXBlID0ge1xyXG5cdGZyb206IGZ1bmN0aW9uKG1hdHJpeCkge1xyXG5cdFx0dGhpcy54ID0gbWF0cml4LnRyYW5zbGF0aW9uLng7XHJcblx0XHR0aGlzLnkgPSBtYXRyaXgudHJhbnNsYXRpb24ueTtcclxuXHRcdHRoaXMueiA9IG1hdHJpeC50cmFuc2xhdGlvbi56O1xyXG5cdFx0dGhpcy5zY2FsZVggPSBtYXRyaXguc2NhbGUueDtcclxuXHRcdHRoaXMuc2NhbGVZID0gbWF0cml4LnNjYWxlLnk7XHJcblx0XHR0aGlzLnNjYWxlWiA9IG1hdHJpeC5zY2FsZS56O1xyXG5cdFx0dGhpcy5yb3RhdGlvblggPSBtYXRyaXgucm90YXRpb24ueCAvIE1hdGguUEkgKiAxODA7XHJcblx0XHR0aGlzLnJvdGF0aW9uWSA9IG1hdHJpeC5yb3RhdGlvbi55IC8gTWF0aC5QSSAqIDE4MDtcclxuXHRcdHRoaXMucm90YXRpb25aID0gbWF0cml4LnJvdGF0aW9uLnogLyBNYXRoLlBJICogMTgwO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWF0cml4ID0gX2VtcHR5TWF0cml4O1xyXG5cdFx0bWF0cml4ID0gbWF0cml4LnRyYW5zbGF0ZSh0aGlzLl94LCB0aGlzLl95LCB0aGlzLl96KTtcclxuXHRcdG1hdHJpeCA9IG1hdHJpeC5yb3RhdGUodGhpcy5fcm90YXRpb25YLCB0aGlzLl9yb3RhdGlvblksIHRoaXMuX3JvdGF0aW9uWik7XHJcblx0XHRtYXRyaXggPSBtYXRyaXguc2NhbGUodGhpcy5fc2NhbGVYLCB0aGlzLl9zY2FsZVksIHRoaXMuX3NjYWxlWik7XHJcblx0XHRyZXR1cm4gbWF0cml4O1xyXG5cdH1cclxufTtcclxuXHJcbk1hdHJpeC5kZWZpbmUgPSBmdW5jdGlvbihwcm9wLCBkZXNjKSB7XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeC5wcm90b3R5cGUsIHByb3AsIGRlc2MpO1xyXG59O1xyXG5cclxuTWF0cml4LmRlZmluZSgneCcsIHtcclxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ggfHwgMDtcclxuXHR9LFxyXG5cdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiAodGhpcy5feCA9ICh2YWx1ZSB8fCAwKSk7XHJcblx0fVxyXG59KTtcclxuXHJcbk1hdHJpeC5kZWZpbmUoJ3knLCB7XHJcblx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl95IHx8IDA7XHJcblx0fSxcclxuXHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuX3kgPSAodmFsdWUgfHwgMCkpO1xyXG5cdH1cclxufSk7XHJcblxyXG5NYXRyaXguZGVmaW5lKCd6Jywge1xyXG5cdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5feiB8fCAwO1xyXG5cdH0sXHJcblx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl96ID0gKHZhbHVlIHx8IDApKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTWF0cml4LmRlZmluZSgnc2NhbGVYJywge1xyXG5cdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2NhbGVYIHx8IDE7XHJcblx0fSxcclxuXHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuX3NjYWxlWCA9ICh2YWx1ZSB8fCAwKSk7XHJcblx0fVxyXG59KTtcclxuXHJcbk1hdHJpeC5kZWZpbmUoJ3NjYWxlWScsIHtcclxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NjYWxlWSB8fCAxO1xyXG5cdH0sXHJcblx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9zY2FsZVkgPSAodmFsdWUgfHwgMCkpO1xyXG5cdH1cclxufSk7XHJcblxyXG5NYXRyaXguZGVmaW5lKCdzY2FsZVonLCB7XHJcblx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9zY2FsZVogfHwgMTtcclxuXHR9LFxyXG5cdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiAodGhpcy5fc2NhbGVaID0gKHZhbHVlIHx8IDApKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTWF0cml4LmRlZmluZSgnc2NhbGUnLCB7XHJcblx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAodGhpcy5fc2NhbGVYICsgdGhpcy5fc2NhbGVZKSAvIDIuMDtcclxuXHR9LFxyXG5cdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiAodGhpcy5fc2NhbGVYID0gdGhpcy5fc2NhbGVZID0gKHZhbHVlIHx8IDApKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTWF0cml4LmRlZmluZSgncm90YXRpb25YJywge1xyXG5cdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcm90YXRpb25YIHx8IDA7XHJcblx0fSxcclxuXHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuX3JvdGF0aW9uWCA9ICh2YWx1ZSB8fCAwKSk7XHJcblx0fVxyXG59KTtcclxuXHJcbk1hdHJpeC5kZWZpbmUoJ3JvdGF0aW9uWScsIHtcclxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9yb3RhdGlvblkgfHwgMCk7XHJcblx0fSxcclxuXHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuX3JvdGF0aW9uWSA9ICh2YWx1ZSB8fCAwKSk7XHJcblx0fVxyXG59KTtcclxuXHJcbk1hdHJpeC5kZWZpbmUoJ3JvdGF0aW9uWicsIHtcclxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JvdGF0aW9uWiB8fCAwO1xyXG5cdH0sXHJcblx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9yb3RhdGlvblogPSAodmFsdWUgfHwgMCkpO1xyXG5cdH1cclxufSk7XHJcblxyXG5NYXRyaXguZGVmaW5lKCdyb3RhdGlvbicsIHtcclxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucm90YXRpb25aO1xyXG5cdH0sXHJcblx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLnJvdGF0aW9uWiA9ICh2YWx1ZSB8fCAwKSk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4OyIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcclxuXHJcblx0X0VORF9WQUxVRSA9IDEwMCxcclxuXHRfVE9MRVJBTkNFID0gMC4xLFxyXG5cdF9TUEVFRCAgICAgPSAxIC8gNjAuMCxcclxuXHJcblx0X2NhbGNTcHJpbmdBY2NlbGVyYXRpb24gPSBmdW5jdGlvbih0ZW5zaW9uLCB4LCBmcmljdGlvbiwgdmVsb2NpdHkpIHtcclxuXHRcdHJldHVybiAtdGVuc2lvbiAqIHggLSBmcmljdGlvbiAqIHZlbG9jaXR5O1xyXG5cdH0sXHJcblxyXG5cdF9zcHJpbmdDYWxjdWxhdGVTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlLCBzcGVlZCkge1xyXG5cdFx0dmFyIGR0ID0gc3BlZWQgKiAwLjUsXHJcblxyXG5cdFx0XHRhX2R4ID0gc3RhdGUudmVsb2NpdHksXHJcblx0XHRcdGFfZHYgPSBfY2FsY1NwcmluZ0FjY2VsZXJhdGlvbihzdGF0ZS50ZW5zaW9uLCBzdGF0ZS54LCBzdGF0ZS5mcmljdGlvbiwgc3RhdGUudmVsb2NpdHkpLFxyXG5cclxuXHRcdFx0Yl9keCA9IHN0YXRlLnZlbG9jaXR5ICsgYV9kdiAqIGR0LFxyXG5cdFx0XHRiX2VuZF94ID0gc3RhdGUueCArIGFfZHggKiBkdCxcclxuXHRcdFx0Yl9kdiA9IF9jYWxjU3ByaW5nQWNjZWxlcmF0aW9uKHN0YXRlLnRlbnNpb24sIGJfZW5kX3gsIHN0YXRlLmZyaWN0aW9uLCBiX2R4KSxcclxuXHJcblx0XHRcdGNfZHggPSBzdGF0ZS52ZWxvY2l0eSArIGJfZHYgKiBkdCxcclxuXHRcdFx0Y19lbmRfeCA9IHN0YXRlLnggKyBiX2R4ICogZHQsXHJcblx0XHRcdGNfZHYgPSBfY2FsY1NwcmluZ0FjY2VsZXJhdGlvbihzdGF0ZS50ZW5zaW9uLCBjX2VuZF94LCBzdGF0ZS5mcmljdGlvbiwgY19keCksXHJcblxyXG5cdFx0XHRkX2R4ID0gc3RhdGUudmVsb2NpdHkgKyBjX2R2ICogZHQsXHJcblx0XHRcdGRfZW5kX3ggPSBzdGF0ZS54ICsgY19keCAqIGR0LFxyXG5cdFx0XHRkX2R2ID0gX2NhbGNTcHJpbmdBY2NlbGVyYXRpb24oc3RhdGUudGVuc2lvbiwgZF9lbmRfeCwgc3RhdGUuZnJpY3Rpb24sIGRfZHgpLFxyXG5cclxuXHRcdFx0ZHhkdCA9ICgxLjAgLyA2LjApICogKGFfZHggKyAyLjAgKiAoYl9keCArIGNfZHgpICsgZF9keCksXHJcblx0XHRcdGR2ZHQgPSAoMS4wIC8gNi4wKSAqIChhX2R2ICsgMi4wICogKGJfZHYgKyBjX2R2KSArIGRfZHYpO1xyXG5cdFx0XHRcclxuXHRcdHN0YXRlLnggICAgICAgID0gc3RhdGUueCArIGR4ZHQgKiBzcGVlZDtcclxuXHRcdHN0YXRlLnZlbG9jaXR5ID0gYV9keCArIGR2ZHQgKiBzcGVlZDtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHN0YXRlO1xyXG5cdH07XHJcblxyXG52YXIgU3ByaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fcmVwZWF0ICAgICAgICAgICA9IDA7XHJcblx0dGhpcy5fdmVsb2NpdHkgICAgICAgICA9IDA7XHJcblx0dGhpcy5fb3JpZ2luYWxWZWxvY2l0eSA9IDA7XHJcblx0dGhpcy5fdGVuc2lvbiAgICAgICAgICA9IDgwO1xyXG5cdHRoaXMuX29yaWdpbmFsVGVuc2lvbiAgPSA4MDtcclxuXHR0aGlzLl9mcmljdGlvbiAgICAgICAgID0gODtcclxuXHR0aGlzLl9vcmlnaW5hbEZyaWN0aW9uID0gODtcclxuXHR0aGlzLl92YWx1ZSAgICAgICAgICAgID0gMDtcclxuXHJcblx0Ly8gU3RvcmVzIHggYW5kIHZlbG9jaXR5IHRvIGRvXHJcblx0Ly8gY2FsY3VsYXRpb25zIGFnYWluc3Qgc28gdGhhdFxyXG5cdC8vIHdlIGNhbiBtdWx0aXBsZSByZXR1cm5zIHZhbHVlc1xyXG5cdC8vIGZyb20gX3NwcmluZ0NhbGN1bGF0ZVN0YXRlXHJcblx0dGhpcy5fc3RhdGUgPSB7fTtcclxuXHJcblx0dGhpcy5fb25VcGRhdGVDYWxsYmFjayAgID0gXy5ub29wO1xyXG5cdHRoaXMuX29uQ29tcGxldGVDYWxsYmFjayA9IF8ubm9vcDtcclxuXHR0aGlzLl9vblJldmVyc2VDYWxsYmFjayAgPSBfLm5vb3A7XHJcbn07XHJcblxyXG5TcHJpbmcucHJvdG90eXBlID0ge1xyXG5cdHJlcGVhdDogZnVuY3Rpb24odGltZXMpIHtcclxuXHRcdHRoaXMuX3JlcGVhdCA9IHRpbWVzO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0c2V0OiBmdW5jdGlvbih0ZW5zaW9uLCBmcmljdGlvbiwgdmVsb2NpdHkpIHtcclxuXHRcdGlmICh2ZWxvY2l0eSAhPT0gdW5kZWZpbmVkKSB7IHRoaXMuX3ZlbG9jaXR5ID0gdGhpcy5fb3JpZ2luYWxWZWxvY2l0eSA9IHZlbG9jaXR5OyB9XHJcblx0XHRpZiAodGVuc2lvbiAgIT09IHVuZGVmaW5lZCkgeyB0aGlzLl90ZW5zaW9uICA9IHRoaXMuX29yaWdpbmFsVGVuc2lvbiAgPSB0ZW5zaW9uOyAgfVxyXG5cdFx0aWYgKGZyaWN0aW9uICE9PSB1bmRlZmluZWQpIHsgdGhpcy5fZnJpY3Rpb24gPSB0aGlzLl9vcmlnaW5hbEZyaWN0aW9uID0gZnJpY3Rpb247IH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHRlbnNpb246IGZ1bmN0aW9uKHRlbnNpb24pIHtcclxuXHRcdHRoaXMuX3RlbnNpb24gPSB0aGlzLl9vcmlnaW5hbFRlbnNpb24gPSB0ZW5zaW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHRmcmljdGlvbjogZnVuY3Rpb24oZnJpY3Rpb24pIHtcclxuXHRcdHRoaXMuX2ZyaWN0aW9uID0gdGhpcy5fb3JpZ2luYWxGcmljdGlvbiA9IGZyaWN0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHR2ZWxvY2l0eTogZnVuY3Rpb24odmVsb2NpdHkpIHtcclxuXHRcdHRoaXMuX3ZlbG9jaXR5ID0gdGhpcy5fb3JpZ2luYWxWZWxvY2l0eSA9IHZlbG9jaXR5O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0c3RlcDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2hvdWxkU3RlcEFnYWluLFxyXG5cdFx0XHRzdGF0ZUJlZm9yZSA9IHRoaXMuX3N0YXRlO1xyXG5cclxuXHRcdHN0YXRlQmVmb3JlLnggICAgICAgID0gdGhpcy5fdmFsdWUgLSBfRU5EX1ZBTFVFO1xyXG5cdFx0c3RhdGVCZWZvcmUudmVsb2NpdHkgPSB0aGlzLl92ZWxvY2l0eTtcclxuXHRcdHN0YXRlQmVmb3JlLnRlbnNpb24gID0gdGhpcy5fdGVuc2lvbjtcclxuXHRcdHN0YXRlQmVmb3JlLmZyaWN0aW9uID0gdGhpcy5fZnJpY3Rpb247XHJcblxyXG5cdFx0dmFyIHN0YXRlQWZ0ZXIgICAgICAgPSBfc3ByaW5nQ2FsY3VsYXRlU3RhdGUoc3RhdGVCZWZvcmUsIF9TUEVFRCksXHJcblx0XHRcdGZpbmFsVmVsb2NpdHkgICAgPSBzdGF0ZUFmdGVyLnZlbG9jaXR5LFxyXG5cdFx0XHRuZXRGbG9hdCAgICAgICAgID0gc3RhdGVBZnRlci54LFxyXG5cdFx0XHRuZXQxRFZlbG9jaXR5ICAgID0gc3RhdGVBZnRlci52ZWxvY2l0eSxcclxuXHRcdFx0bmV0VmFsdWVJc0xvdyAgICA9IE1hdGguYWJzKG5ldEZsb2F0KSA8IF9UT0xFUkFOQ0UsXHJcblx0XHRcdG5ldFZlbG9jaXR5SXNMb3cgPSBNYXRoLmFicyhuZXQxRFZlbG9jaXR5KSA8IF9UT0xFUkFOQ0UsXHJcblx0XHRcdHNob3VsZFNwcmluZ1N0b3AgPSBuZXRWYWx1ZUlzTG93ICYmIG5ldFZlbG9jaXR5SXNMb3c7XHJcblxyXG5cdFx0dGhpcy5fdmFsdWUgPSBfRU5EX1ZBTFVFICsgc3RhdGVBZnRlci54O1xyXG5cclxuXHRcdGlmIChzaG91bGRTcHJpbmdTdG9wKSB7XHJcblx0XHRcdHRoaXMuX3ZlbG9jaXR5ID0gKGZpbmFsVmVsb2NpdHkgPSAwKTtcclxuXHRcdFx0dGhpcy5fdmFsdWUgPSBfRU5EX1ZBTFVFO1xyXG5cclxuXHRcdFx0dGhpcy5fb25VcGRhdGVDYWxsYmFjayh0aGlzLl92YWx1ZSAvIDEwMCk7XHJcblxyXG5cdFx0XHQvLyBTaG91bGQgd2UgcmVwZWF0P1xyXG5cdFx0XHRpZiAodGhpcy5fcmVwZWF0ID4gMCkge1xyXG5cclxuXHRcdFx0XHQvLyBEZWNyZW1lbnQgdGhlIHJlcGVhdCBjb3VudGVyIChpZiBmaW5pdGUsIFxyXG5cdFx0XHRcdC8vIHdlIG1heSBiZSBpbiBhbiBpbmZpbml0ZSBsb29wKVxyXG5cdFx0XHRcdGlmIChpc0Zpbml0ZSh0aGlzLl9yZXBlYXQpKSB7IHRoaXMuX3JlcGVhdC0tOyB9XHJcblxyXG5cdFx0XHRcdHRoaXMuX29uUmV2ZXJzZUNhbGxiYWNrKCk7XHJcblx0XHRcdFx0dGhpcy5fdmVsb2NpdHkgPSB0aGlzLl9vcmlnaW5hbFZlbG9jaXR5O1xyXG5cdFx0XHRcdHRoaXMuX3RlbnNpb24gID0gdGhpcy5fb3JpZ2luYWxUZW5zaW9uIDtcclxuXHRcdFx0XHR0aGlzLl9mcmljdGlvbiA9IHRoaXMuX29yaWdpbmFsRnJpY3Rpb247XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUgPSAwO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gKHNob3VsZFN0ZXBBZ2FpbiA9IHRydWUpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gT3RoZXJ3aXNlLCB3ZSdyZSBkb25lIHJlcGVhdGluZ1xyXG5cdFx0XHR0aGlzLl9vbkNvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHJcblx0XHRcdHJldHVybiAoc2hvdWxkU3RlcEFnYWluID0gZmFsc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3ZlbG9jaXR5ID0gZmluYWxWZWxvY2l0eTtcclxuXHRcdHRoaXMuX29uVXBkYXRlQ2FsbGJhY2sodGhpcy5fdmFsdWUgLyAxMDApO1xyXG5cdFx0cmV0dXJuIChzaG91bGRTdGVwQWdhaW4gPSB0cnVlKTtcclxuXHR9LFxyXG5cclxuXHRvblJldmVyc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLl9vblJldmVyc2VDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0b25VcGRhdGU6IGZ1bmN0aW9uKG9uVXBkYXRlKSB7XHJcblx0XHR2YXIgc3ByaW5nID0gdGhpcztcclxuXHRcdHNwcmluZy5fb25VcGRhdGVDYWxsYmFjayA9IG9uVXBkYXRlO1xyXG5cdFx0cmV0dXJuIHNwcmluZztcclxuXHR9LFxyXG5cclxuXHRvbkNvbXBsZXRlOiBmdW5jdGlvbihvbkNvbXBsZXRlKSB7XHJcblx0XHR2YXIgc3ByaW5nID0gdGhpcztcclxuXHRcdHNwcmluZy5fb25Db21wbGV0ZUNhbGxiYWNrID0gb25Db21wbGV0ZTtcclxuXHRcdHJldHVybiBzcHJpbmc7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3ByaW5nOyIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcclxuXHJcblx0RWFzaW5nID0gcmVxdWlyZSgnLi4vRWFzaW5nJyk7XHJcblxyXG52YXIgVHdlZW4gPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kdXJhdGlvbiAgICAgICAgICAgICAgPSAxMDAwO1xyXG5cdHRoaXMuX3JlcGVhdCAgICAgICAgICAgICAgICA9IDA7XHJcblx0dGhpcy5fc3RhcnRUaW1lICAgICAgICAgICAgID0gMDtcclxuXHRcclxuXHR0aGlzLl9lYXNpbmdGdW5jdGlvbiAgICAgICAgPSBFYXNpbmcuTGluZWFyLk5vbmU7XHJcblx0XHJcblx0dGhpcy5fb25VcGRhdGVDYWxsYmFjayAgICAgID0gXy5ub29wO1xyXG5cdHRoaXMuX29uQ29tcGxldGVDYWxsYmFjayAgICA9IF8ubm9vcDtcclxuXHR0aGlzLl9vblJldmVyc2VDYWxsYmFjayAgICAgPSBfLm5vb3A7XHJcblxyXG5cdHRoaXMuc3RlcCA9IHRoaXMuc3RlcC5iaW5kKHRoaXMpO1xyXG59O1xyXG5cclxuVHdlZW4ucHJvdG90eXBlID0ge1xyXG5cclxuXHRzdGFydFRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcclxuXHRcdHRoaXMuX3N0YXJ0VGltZSA9IHRpbWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRkdXJhdGlvbjogZnVuY3Rpb24oZHVyYXRpb24pIHtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZXBlYXQ6IGZ1bmN0aW9uKHRpbWVzKSB7XHJcblx0XHR0aGlzLl9yZXBlYXQgPSB0aW1lcztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGVhc2U6IGZ1bmN0aW9uKGVhc2luZykge1xyXG5cdFx0dGhpcy5fZWFzaW5nRnVuY3Rpb24gPSBlYXNpbmc7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRvblVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMuX29uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uUmV2ZXJzZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMuX29uUmV2ZXJzZUNhbGxiYWNrID0gY2FsbGJhY2s7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRzdGVwOiBmdW5jdGlvbih0aW1lKSB7XHJcblx0XHR2YXIgc2hvdWxkU3RlcEFnYWluLFxyXG5cdFx0XHRlbGFwc2VkVW5jYXBwZWQgPSAodGltZSAtIHRoaXMuX3N0YXJ0VGltZSkgLyB0aGlzLl9kdXJhdGlvbixcclxuXHRcdFx0ZWxhcHNlZCA9IGVsYXBzZWRVbmNhcHBlZCA+IDEgPyAxIDogZWxhcHNlZFVuY2FwcGVkO1xyXG5cdFx0XHRcclxuXHRcdHRoaXMuX29uVXBkYXRlQ2FsbGJhY2sodGhpcy5fZWFzaW5nRnVuY3Rpb24oZWxhcHNlZCkpO1xyXG5cclxuXHRcdC8vIFdlIGhhdmUgZWxsYXBzZWQgdGhpcyBsb29wXHJcblx0XHRpZiAoZWxhcHNlZCA9PT0gMSkge1xyXG5cclxuXHRcdFx0Ly8gU2hvdWxkIHdlIHJlcGVhdD9cclxuXHRcdFx0aWYgKHRoaXMuX3JlcGVhdCA+IDApIHtcclxuXHJcblx0XHRcdFx0Ly8gRGVjcmVtZW50IHRoZSByZXBlYXQgY291bnRlciAoaWYgZmluaXRlLCBcclxuXHRcdFx0XHQvLyB3ZSBtYXkgYmUgaW4gYW4gaW5maW5pdGUgbG9vcClcclxuXHRcdFx0XHRpZiAoaXNGaW5pdGUodGhpcy5fcmVwZWF0KSkgeyB0aGlzLl9yZXBlYXQtLTsgfVxyXG5cclxuXHRcdFx0XHR0aGlzLl9vblJldmVyc2VDYWxsYmFjaygpO1xyXG5cdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSA9IHRpbWU7XHJcblxyXG5cdFx0XHRcdHJldHVybiAoc2hvdWxkU3RlcEFnYWluID0gdHJ1ZSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBPdGhlcndpc2UsIHdlJ3JlIGRvbmUgcmVwZWF0aW5nXHJcblx0XHRcdHRoaXMuX29uQ29tcGxldGVDYWxsYmFjaygpO1xyXG5cclxuXHRcdFx0cmV0dXJuIChzaG91bGRTdGVwQWdhaW4gPSBmYWxzZSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoc2hvdWxkU3RlcEFnYWluID0gdHJ1ZSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUd2VlbjsiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxzJyksXHJcblxyXG5cdF9sb29wID0gcmVxdWlyZSgnLi4vbG9vcCcpLFxyXG5cclxuXHRUcmFuc2Zvcm1PYmogPSByZXF1aXJlKCcuLi90cmFuc2Zvcm1lcnMvT2JqJyksXHJcblx0VHJhbnNmb3JtRWxlbSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybWVycy9FbGVtJyksXHJcblx0VHJhbnNmb3JtQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybWVycy9Db2xsZWN0aW9uJyk7XHJcblxyXG52YXIgQW5pbWF0aW9uID0gZnVuY3Rpb24ob2JqKSB7XHJcblx0dGhpcy5fdHJhbnNmb3JtZXIgPSBfLmlzQXJyYXlMaWtlKG9iaikgP1xyXG5cdFx0bmV3IFRyYW5zZm9ybUNvbGxlY3Rpb24ob2JqKSA6XHJcblx0XHRfLmlzRWxlbWVudChvYmopID9cclxuXHRcdFx0bmV3IFRyYW5zZm9ybUVsZW0ob2JqKSA6XHJcblx0XHRcdG5ldyBUcmFuc2Zvcm1PYmoob2JqKTtcclxuXHJcblx0dGhpcy5fc3RhcnRUaW1lID0gMDtcclxuXHR0aGlzLl9kZWxheVRpbWUgPSAwO1xyXG5cdHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xyXG5cclxuXHR0aGlzLl9vblN0YXJ0Q2FsbGJhY2sgICAgPSBfLm5vb3A7XHJcblx0dGhpcy5fb25VcGRhdGVDYWxsYmFjayAgID0gXy5ub29wO1xyXG5cdHRoaXMuX29uUmV2ZXJzZUNhbGxiYWNrICA9IF8ubm9vcDtcclxuXHR0aGlzLl9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBfLm5vb3A7XHJcblx0dGhpcy5fb25TdG9wQ2FsbGJhY2sgICAgID0gXy5ub29wO1xyXG59O1xyXG5cclxuQW5pbWF0aW9uLnByb3RvdHlwZSA9IHtcclxuXHRpc1BsYXlpbmc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzUGxheWluZztcclxuXHR9LFxyXG5cclxuXHRvblN0YXJ0OiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5fb25TdGFydENhbGxiYWNrID0gY2FsbGJhY2s7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRvblVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMuX29uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uQ29tcGxldGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uUmV2ZXJzZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMuX29uUmV2ZXJzZUNhbGxiYWNrID0gY2FsbGJhY2s7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRvblN0b3A6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLl9vblN0b3BDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0ZGVsYXk6IGZ1bmN0aW9uKGFtb3VudCkge1xyXG5cdFx0dGhpcy5fZGVsYXlUaW1lID0gYW1vdW50O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0cmVwZWF0OiBmdW5jdGlvbihyZXBlYXQpIHtcclxuXHRcdHRoaXMuX2FuaW1hdGlvbi5yZXBlYXQocmVwZWF0KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHlveW86IGZ1bmN0aW9uKHlveW8pIHtcclxuXHRcdHRoaXMuX3RyYW5zZm9ybWVyLnlveW8oeW95byk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHR0bzogZnVuY3Rpb24oZ29Ubykge1xyXG5cdFx0dGhpcy5fdHJhbnNmb3JtZXIudG8oZ29Ubyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRzdGFydDogZnVuY3Rpb24odGltZSkge1xyXG5cdFx0dGhpcy5fc3RhcnRUaW1lID0gdGltZSB8fCBfLm5vdygpO1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdF9sb29wLmF3YWl0KGZ1bmN0aW9uKHRpbWUpIHtcclxuXHRcdFx0dmFyIHNob3VsZENvbnRpbnVlVG9XYWl0O1xyXG5cclxuXHRcdFx0aWYgKHRpbWUgPCAoc2VsZi5fc3RhcnRUaW1lICsgc2VsZi5fZGVsYXlUaW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAoc2hvdWxkQ29udGludWVUb1dhaXQgPSB0cnVlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZi5fb25TdGFydENhbGxiYWNrKCk7XHJcblxyXG5cdFx0XHRzZWxmLl9zdGFydCh0aW1lKTtcclxuXHJcblx0XHRcdHJldHVybiAoc2hvdWxkQ29udGludWVUb1dhaXQgPSBmYWxzZSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRzdG9wOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmICghdGhpcy5faXNQbGF5aW5nKSB7IHJldHVybiB0aGlzOyB9XHJcblxyXG5cdFx0dGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XHJcblxyXG5cdFx0X2xvb3AucmVtb3ZlKHRoaXMuX2FuaW1hdGlvbi5zdGVwKTtcclxuXHJcblx0XHR0aGlzLl90cmFuc2Zvcm1lci5zdG9wKCk7XHJcblx0XHR0aGlzLl9hbmltYXRpb24uc3RvcCgpO1xyXG5cclxuXHRcdHRoaXMuX29uU3RvcENhbGxiYWNrKCk7XHJcblx0fSxcclxuXHJcblx0Ly8gX3N0YXJ0OiBmdW5jdGlvbigpIHt9LFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb247IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlscycpLFxyXG5cclxuXHRfbG9vcCA9IHJlcXVpcmUoJy4uL2xvb3AnKSxcclxuXHJcblx0QW5pbWF0b3IgPSByZXF1aXJlKCcuL0FuaW1hdG9yJyksXHJcblx0XHJcblx0U3ByaW5nQW5pbWF0aW9uID0gcmVxdWlyZSgnLi4vYW5pbWF0aW9ucy9TcHJpbmcnKTtcclxuXHJcbnZhciBGbHV4U3ByaW5nID0gZnVuY3Rpb24gU3ByaW5nKG9iaikge1xyXG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBGbHV4U3ByaW5nKSkgeyByZXR1cm4gbmV3IEZsdXhTcHJpbmcob2JqKTsgfVxyXG5cclxuXHRBbmltYXRvci5jYWxsKHRoaXMsIG9iaik7XHJcblxyXG5cdHRoaXMuX2FuaW1hdGlvbiA9IG5ldyBTcHJpbmdBbmltYXRpb24oKTtcclxufTtcclxuXHJcbl8uZXh0ZW5kKEZsdXhTcHJpbmcucHJvdG90eXBlLCBBbmltYXRvci5wcm90b3R5cGUsIHtcclxuXHRmcm9tOiBmdW5jdGlvbihvYmopIHtcclxuXHRcdHRoaXMuX3RyYW5zZm9ybWVyLmZyb20ob2JqKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldDogZnVuY3Rpb24odGVuc2lvbiwgZnJpY3Rpb24sIHZlbG9jaXR5KSB7XHJcblx0XHQvLyBJdCdzIGFuIG9iamVjdFxyXG5cdFx0aWYgKCFfLmlzTnVtYmVyKHRlbnNpb24pKSB7XHJcblx0XHRcdHZhciB0ZW1wID0gdGVuc2lvbjtcclxuXHRcdFx0dmVsb2NpdHkgPSB0ZW1wLnZlbG9jaXR5O1xyXG5cdFx0XHRmcmljdGlvbiA9IHRlbXAuZnJpY3Rpb247XHJcblx0XHRcdHRlbnNpb24gPSB0ZW1wLnRlbnNpb247XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fYW5pbWF0aW9uLnNldCh0ZW5zaW9uLCBmcmljdGlvbiwgdmVsb2NpdHkpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHRcclxuXHR0ZW5zaW9uOiBmdW5jdGlvbih0ZW5zaW9uKSB7XHJcblx0XHR0aGlzLl9hbmltYXRpb24udGVuc2lvbih0ZW5zaW9uKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGZyaWN0aW9uOiBmdW5jdGlvbihmcmljdGlvbikge1xyXG5cdFx0dGhpcy5fYW5pbWF0aW9uLmZyaWN0aW9uKGZyaWN0aW9uKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHZlbG9jaXR5OiBmdW5jdGlvbih2ZWxvY2l0eSkge1xyXG5cdFx0dGhpcy5fYW5pbWF0aW9uLnZlbG9jaXR5KHZlbG9jaXR5KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdF9zdGFydDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLl9pc1BsYXlpbmcgPSB0cnVlO1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHRoaXMuX2FuaW1hdGlvblxyXG5cdFx0XHQub25VcGRhdGUoZnVuY3Rpb24ocGVyYykge1xyXG5cdFx0XHRcdHNlbGYuX3RyYW5zZm9ybWVyLnVwZGF0ZShwZXJjKTtcclxuXHJcblx0XHRcdFx0c2VsZi5fb25VcGRhdGVDYWxsYmFjayhzZWxmLl90cmFuc2Zvcm1lci52YWx1ZSgpLCBzZWxmLl90cmFuc2Zvcm1lci5tYXRyaXgoKSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vblJldmVyc2UoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5fdHJhbnNmb3JtZXIucmV2ZXJzZSgpO1xyXG5cclxuXHRcdFx0XHRzZWxmLnN0YXJ0KCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuX2lzUGxheWluZyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRfbG9vcC5yZW1vdmUoc2VsZi5fYW5pbWF0aW9uKTtcclxuXHJcblx0XHRcdFx0c2VsZi5fb25Db21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuX3RyYW5zZm9ybWVyLnN0YXJ0KCk7XHJcblx0XHRfbG9vcC5hZGQoc2VsZi5fYW5pbWF0aW9uKTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGbHV4U3ByaW5nOyIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcclxuXHJcblx0X2xvb3AgPSByZXF1aXJlKCcuLi9sb29wJyksXHJcblxyXG5cdEFuaW1hdG9yID0gcmVxdWlyZSgnLi9BbmltYXRvcicpLFxyXG5cdFxyXG5cdEVhc2luZyA9IHJlcXVpcmUoJy4uL0Vhc2luZycpLFxyXG5cclxuXHRUd2VlbkFuaW1hdGlvbiA9IHJlcXVpcmUoJy4uL2FuaW1hdGlvbnMvVHdlZW4nKTtcclxuXHJcbnZhciBGbHV4VHdlZW4gPSBmdW5jdGlvbiBUd2VlbihvYmopIHtcclxuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgRmx1eFR3ZWVuKSkgeyByZXR1cm4gbmV3IEZsdXhUd2VlbihvYmopOyB9XHJcblxyXG5cdEFuaW1hdG9yLmNhbGwodGhpcywgb2JqKTtcclxuXHJcblx0dGhpcy5fYW5pbWF0aW9uID0gbmV3IFR3ZWVuQW5pbWF0aW9uKCk7XHJcbn07XHJcblxyXG5fLmV4dGVuZChGbHV4VHdlZW4ucHJvdG90eXBlLCBBbmltYXRvci5wcm90b3R5cGUsIHtcclxuXHRkdXJhdGlvbjogZnVuY3Rpb24oZHVyYXRpb24pIHtcclxuXHRcdHRoaXMuX2FuaW1hdGlvbi5kdXJhdGlvbigrZHVyYXRpb24pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0ZWFzZTogZnVuY3Rpb24oZm4pIHtcclxuXHRcdHRoaXMuX2FuaW1hdGlvbi5lYXNlKGZuIHx8IEVhc2luZy5MaW5lYXIuTm9uZSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRfc3RhcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5faXNQbGF5aW5nID0gdHJ1ZTtcclxuXHRcdFxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dGhpcy5fYW5pbWF0aW9uXHJcblx0XHRcdC5vblVwZGF0ZShmdW5jdGlvbihwZXJjKSB7XHJcblx0XHRcdFx0c2VsZi5fdHJhbnNmb3JtZXIudXBkYXRlKHBlcmMpO1xyXG5cclxuXHRcdFx0XHRzZWxmLl9vblVwZGF0ZUNhbGxiYWNrKHNlbGYuX3RyYW5zZm9ybWVyLnZhbHVlKCksIHNlbGYuX3RyYW5zZm9ybWVyLm1hdHJpeCgpKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uQ29tcGxldGUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5faXNQbGF5aW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdF9sb29wLnJlbW92ZShzZWxmLl9hbmltYXRpb24pO1xyXG5cclxuXHRcdFx0XHRzZWxmLl9vbkNvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uUmV2ZXJzZShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZWxmLl90cmFuc2Zvcm1lci5yZXZlcnNlKCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5zdGFydFRpbWUoXy5ub3coKSk7XHJcblxyXG5cdFx0c2VsZi5fdHJhbnNmb3JtZXIuc3RhcnQoKTtcclxuXHRcdF9sb29wLmFkZChzZWxmLl9hbmltYXRpb24pO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZsdXhUd2VlbjsiLCJ2YXIgX3dhaXRpbmcgPSBbXSxcclxuXHRfYW5pbWF0aW9ucyA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YXdhaXQ6IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHRfd2FpdGluZy5wdXNoKGZuKTtcclxuXHR9LFxyXG5cclxuXHRhZGQ6IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHRfYW5pbWF0aW9ucy5wdXNoKGZuKTtcclxuXHR9LFxyXG5cclxuXHRyZW1vdmU6IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgaWR4ID0gX2FuaW1hdGlvbnMuaW5kZXhPZihmbik7XHJcblx0XHRpZiAoaWR4ICE9PSAtMSkge1xyXG5cdFx0XHRfYW5pbWF0aW9ucy5zcGxpY2UoaWR4LCAxKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR1cGRhdGU6IGZ1bmN0aW9uKHRpbWUpIHtcclxuXHRcdGlmIChfd2FpdGluZy5sZW5ndGggPT09IDAgJiYgX2FuaW1hdGlvbnMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdHZhciBpZHggPSAwO1xyXG5cdFx0d2hpbGUgKGlkeCA8IF93YWl0aW5nLmxlbmd0aCkge1xyXG5cdFx0XHRpZiAoX3dhaXRpbmdbaWR4XSh0aW1lKSkge1xyXG5cdFx0XHRcdGlkeCsrO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdF93YWl0aW5nLnNwbGljZShpZHgsIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWR4ID0gMDtcclxuXHRcdHdoaWxlIChpZHggPCBfYW5pbWF0aW9ucy5sZW5ndGgpIHtcclxuXHRcdFx0aWYgKF9hbmltYXRpb25zW2lkeF0uc3RlcCh0aW1lKSkge1xyXG5cdFx0XHRcdGlkeCsrO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdF9hbmltYXRpb25zLnNwbGljZShpZHgsIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vLyBYQ1NTTWF0cml4IHBvbHlmaWxsXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qZnNpaWkvWENTU01hdHJpeFxyXG4oZnVuY3Rpb24oZSl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYm9vdHN0cmFwKWJvb3RzdHJhcChcInhjc3NtYXRyaXhcIixlKTtlbHNlIGlmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoZSk7ZWxzZSBpZihcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VzKXtpZighc2VzLm9rKCkpcmV0dXJuO3Nlcy5tYWtlWENTU01hdHJpeD1lfWVsc2VcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdy5YQ1NTTWF0cml4PWUoKTpnbG9iYWwuWENTU01hdHJpeD1lKCl9KShmdW5jdGlvbigpe3ZhciBlLHQsbixyLGk7cmV0dXJuIGZ1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiByKG4scyl7aWYoIXRbbl0pe2lmKCFlW25dKXt2YXIgbz10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCFzJiZvKXJldHVybiBvKG4sITApO2lmKGkpcmV0dXJuIGkobiwhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIituK1wiJ1wiKX12YXIgdT10W25dPXtleHBvcnRzOnt9fTtlW25dWzBdLmNhbGwodS5leHBvcnRzLGZ1bmN0aW9uKHQpe3ZhciBpPWVbbl1bMV1bdF07cmV0dXJuIHIoaT9pOnQpfSx1LHUuZXhwb3J0cyl9cmV0dXJuIHRbbl0uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgcz0wO3M8bi5sZW5ndGg7cysrKXIobltzXSk7cmV0dXJuIHJ9KHsxOltmdW5jdGlvbihlLHQsbil7dmFyIHI9ZShcIi4vbGliL1hDU1NNYXRyaXguanNcIik7dC5leHBvcnRzPXJ9LHtcIi4vbGliL1hDU1NNYXRyaXguanNcIjoyfV0sMjpbZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIGkoZSl7dGhpcy5tMTE9dGhpcy5tMjI9dGhpcy5tMzM9dGhpcy5tNDQ9MTt0aGlzLm0xMj10aGlzLm0xMz10aGlzLm0xND10aGlzLm0yMT10aGlzLm0yMz10aGlzLm0yND10aGlzLm0zMT10aGlzLm0zMj10aGlzLm0zND10aGlzLm00MT10aGlzLm00Mj10aGlzLm00Mz0wO2lmKHR5cGVvZiBlPT09XCJzdHJpbmdcIil7dGhpcy5zZXRNYXRyaXhWYWx1ZShlKX19ZnVuY3Rpb24gdShlKXtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShlKzk3KX1mdW5jdGlvbiBhKGUpe3JldHVyblwibVwiKyhNYXRoLmZsb29yKGUvNCkrMSkrKGUlNCsxKX1mdW5jdGlvbiBsKGUpe3JldHVybiBlLnZhbHVlfWZ1bmN0aW9uIGMoZSl7cmV0dXJuIGZbZV19ZnVuY3Rpb24gaChlKXtpZihlLnVuaXRzPT09XCJyYWRcIil7ZS52YWx1ZT1yLmFuZ2xlcy5yYWQyZGVnKGUudmFsdWUpO2UudW5pdHM9XCJkZWdcIn1lbHNlIGlmKGUudW5pdHM9PT1cImdyYWRcIil7ZS52YWx1ZT1yLmFuZ2xlcy5ncmFkMmRlZyhlLnZhbHVlKTtlLnVuaXRzPVwiZGVnXCJ9cmV0dXJuIGV9ZnVuY3Rpb24gcChlLHQpe3QudmFsdWU9dC52YWx1ZS5tYXAoaCk7dmFyIG49Yyh0LmtleSk7dmFyIHI9bihlLHQpO3JldHVybiByfHxlfWZ1bmN0aW9uIGQoZSl7dmFyIHQ9ci50cmFuc3Auc3RyaW5nVG9TdGF0ZW1lbnRzKGUpO2lmKHQubGVuZ3RoPT09MSYmL15tYXRyaXgvLnRlc3QoZSkpe3JldHVybiBlfXZhciBuPXIuZnVuY3Mub25seUZpcnN0QXJnKHIudHJhbnNwLnN0YXRlbWVudFRvT2JqZWN0KTt2YXIgcz10Lm1hcChuKTt2YXIgbz1uZXcgaTt2YXIgdT1zLnJlZHVjZShwLG8pO3ZhciBhPXUudG9TdHJpbmcoKTtyZXR1cm4gYX12YXIgcj17YW5nbGVzOmUoXCIuL3V0aWxzL2FuZ2xlXCIpLG1hdHJpeDplKFwiLi91dGlscy9tYXRyaXhcIiksdHJhbnNwOmUoXCIuL3V0aWxzL2Nzc1RyYW5zZm9ybVN0cmluZ1wiKSxmdW5jczp7b25seUZpcnN0QXJnOmZ1bmN0aW9uKGUsdCl7dD10fHx0aGlzO3JldHVybiBmdW5jdGlvbihuKXtyZXR1cm4gZS5jYWxsKHQsbil9fX19O2kuZGlzcGxheU5hbWU9XCJYQ1NTTWF0cml4XCI7dmFyIHM9W1wiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiXTt2YXIgbz1bXCJtMTFcIixcIm0xMlwiLFwibTEzXCIsXCJtMTRcIixcIm0yMVwiLFwibTIyXCIsXCJtMjNcIixcIm0yNFwiLFwibTMxXCIsXCJtMzJcIixcIm0zM1wiLFwibTM0XCIsXCJtNDFcIixcIm00MlwiLFwibTQzXCIsXCJtNDRcIl07W1tcIm0xMVwiLFwiYVwiXSxbXCJtMTJcIixcImJcIl0sW1wibTIxXCIsXCJjXCJdLFtcIm0yMlwiLFwiZFwiXSxbXCJtNDFcIixcImVcIl0sW1wibTQyXCIsXCJmXCJdXS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PWVbMF0sbj1lWzFdO09iamVjdC5kZWZpbmVQcm9wZXJ0eShpLnByb3RvdHlwZSxuLHtzZXQ6ZnVuY3Rpb24oZSl7dGhpc1t0XT1lfSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1t0XX0sZW51bWVyYWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlfSl9KTtpLnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbihlKXtyZXR1cm4gci5tYXRyaXgubXVsdGlwbHkodGhpcyxlKX07aS5wcm90b3R5cGUuaW52ZXJzZT1mdW5jdGlvbigpe3JldHVybiByLm1hdHJpeC5pbnZlcnNlKHRoaXMpfTtpLnByb3RvdHlwZS5yb3RhdGU9ZnVuY3Rpb24oZSx0LG4pe2lmKHR5cGVvZiBlIT09XCJudW1iZXJcInx8aXNOYU4oZSkpZT0wO2lmKCh0eXBlb2YgdCE9PVwibnVtYmVyXCJ8fGlzTmFOKHQpKSYmKHR5cGVvZiBuIT09XCJudW1iZXJcInx8aXNOYU4obikpKXtuPWU7ZT0wO3Q9MH1pZih0eXBlb2YgdCE9PVwibnVtYmVyXCJ8fGlzTmFOKHQpKXQ9MDtpZih0eXBlb2YgbiE9PVwibnVtYmVyXCJ8fGlzTmFOKG4pKW49MDtlPXIuYW5nbGVzLmRlZzJyYWQoZSk7dD1yLmFuZ2xlcy5kZWcycmFkKHQpO249ci5hbmdsZXMuZGVnMnJhZChuKTt2YXIgcz1uZXcgaSxvPW5ldyBpLHU9bmV3IGksYSxmLGw7bi89MjthPU1hdGguc2luKG4pO2Y9TWF0aC5jb3Mobik7bD1hKmE7dS5tMTE9dS5tMjI9MS0yKmw7dS5tMTI9dS5tMjE9MiphKmY7dS5tMjEqPS0xO3QvPTI7YT1NYXRoLnNpbih0KTtmPU1hdGguY29zKHQpO2w9YSphO28ubTExPW8ubTMzPTEtMipsO28ubTEzPW8ubTMxPTIqYSpmO28ubTEzKj0tMTtlLz0yO2E9TWF0aC5zaW4oZSk7Zj1NYXRoLmNvcyhlKTtsPWEqYTtzLm0yMj1zLm0zMz0xLTIqbDtzLm0yMz1zLm0zMj0yKmEqZjtzLm0zMio9LTE7dmFyIGM9bmV3IGk7dmFyIGg9dGhpcy50b1N0cmluZygpPT09Yy50b1N0cmluZygpO3ZhciBwPWg/dS5tdWx0aXBseShvKS5tdWx0aXBseShzKTp0aGlzLm11bHRpcGx5KHMpLm11bHRpcGx5KG8pLm11bHRpcGx5KHUpO3JldHVybiBwfTtpLnByb3RvdHlwZS5yb3RhdGVBeGlzQW5nbGU9ZnVuY3Rpb24oZSx0LG4scyl7aWYodHlwZW9mIGUhPT1cIm51bWJlclwifHxpc05hTihlKSllPTA7aWYodHlwZW9mIHQhPT1cIm51bWJlclwifHxpc05hTih0KSl0PTA7aWYodHlwZW9mIG4hPT1cIm51bWJlclwifHxpc05hTihuKSluPTA7aWYodHlwZW9mIHMhPT1cIm51bWJlclwifHxpc05hTihzKSlzPTA7aWYoZT09PTAmJnQ9PT0wJiZuPT09MCluPTE7cz0oci5hbmdsZXMuZGVnMnJhZChzKXx8MCkvMjt2YXIgbz1uZXcgaSx1PU1hdGguc3FydChlKmUrdCp0K24qbiksYT1NYXRoLmNvcyhzKSxmPU1hdGguc2luKHMpLGw9ZipmLGM9ZiphLGg9ZnVuY3Rpb24oZSl7cmV0dXJuIHBhcnNlRmxvYXQoZS50b0ZpeGVkKDYpKX0scCxkLHY7aWYodT09PTApe2U9MDt0PTA7bj0xfWVsc2UgaWYodSE9PTEpe2UvPXU7dC89dTtuLz11fWlmKGU9PT0xJiZ0PT09MCYmbj09PTApe28ubTIyPW8ubTMzPTEtMipsO28ubTIzPW8ubTMyPTIqYztvLm0zMio9LTF9ZWxzZSBpZihlPT09MCYmdD09PTEmJm49PT0wKXtvLm0xMT1vLm0zMz0xLTIqbDtvLm0xMz1vLm0zMT0yKmM7by5tMTMqPS0xfWVsc2UgaWYoZT09PTAmJnQ9PT0wJiZuPT09MSl7by5tMTE9by5tMjI9MS0yKmw7by5tMTI9by5tMjE9MipjO28ubTIxKj0tMX1lbHNle3A9ZSplO2Q9dCp0O3Y9bipuO28ubTExPWgoMS0yKihkK3YpKmwpO28ubTEyPWgoMiooZSp0KmwrbipjKSk7by5tMTM9aCgyKihlKm4qbC10KmMpKTtvLm0yMT1oKDIqKGUqdCpsLW4qYykpO28ubTIyPWgoMS0yKihwK3YpKmwpO28ubTIzPWgoMioodCpuKmwrZSpjKSk7by5tMzE9aCgyKihlKm4qbCt0KmMpKTtvLm0zMj1oKDIqKHQqbipsLWUqYykpO28ubTMzPWgoMS0yKihwK2QpKmwpfXJldHVybiB0aGlzLm11bHRpcGx5KG8pfTtpLnByb3RvdHlwZS5zY2FsZT1mdW5jdGlvbihlLHQsbil7dmFyIHI9bmV3IGk7aWYodHlwZW9mIGUhPT1cIm51bWJlclwifHxpc05hTihlKSllPTE7aWYodHlwZW9mIHQhPT1cIm51bWJlclwifHxpc05hTih0KSl0PWU7aWYodHlwZW9mIG4hPT1cIm51bWJlclwifHxpc05hTihuKSluPTE7ci5tMTE9ZTtyLm0yMj10O3IubTMzPW47cmV0dXJuIHRoaXMubXVsdGlwbHkocil9O2kucHJvdG90eXBlLnNrZXdYPWZ1bmN0aW9uKGUpe3ZhciB0PXIuYW5nbGVzLmRlZzJyYWQoZSk7dmFyIG49bmV3IGk7bi5jPU1hdGgudGFuKHQpO3JldHVybiB0aGlzLm11bHRpcGx5KG4pfTtpLnByb3RvdHlwZS5za2V3WT1mdW5jdGlvbihlKXt2YXIgdD1yLmFuZ2xlcy5kZWcycmFkKGUpO3ZhciBuPW5ldyBpO24uYj1NYXRoLnRhbih0KTtyZXR1cm4gdGhpcy5tdWx0aXBseShuKX07aS5wcm90b3R5cGUudHJhbnNsYXRlPWZ1bmN0aW9uKGUsdCxuKXt2YXIgcj1uZXcgaTtpZih0eXBlb2YgZSE9PVwibnVtYmVyXCJ8fGlzTmFOKGUpKWU9MDtpZih0eXBlb2YgdCE9PVwibnVtYmVyXCJ8fGlzTmFOKHQpKXQ9MDtpZih0eXBlb2YgbiE9PVwibnVtYmVyXCJ8fGlzTmFOKG4pKW49MDtyLm00MT1lO3IubTQyPXQ7ci5tNDM9bjtyZXR1cm4gdGhpcy5tdWx0aXBseShyKX07aS5wcm90b3R5cGUuc2V0TWF0cml4VmFsdWU9ZnVuY3Rpb24oZSl7dmFyIHQ9ZChlLnRyaW0oKSk7dmFyIG49ci50cmFuc3Auc3RhdGVtZW50VG9PYmplY3QodCk7aWYoIW4pcmV0dXJuO3ZhciBpPW4ua2V5PT09ci50cmFuc3AubWF0cml4Rm4zZDt2YXIgcz1pP2E6dTt2YXIgbz1uLnZhbHVlO3ZhciBmPW8ubGVuZ3RoO2lmKGkmJmYhPT0xNnx8IShpfHxmPT09NikpcmV0dXJuO28uZm9yRWFjaChmdW5jdGlvbihlLHQpe3ZhciBuPXModCk7dGhpc1tuXT1lLnZhbHVlfSx0aGlzKX07aS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgZSx0O2lmKHIubWF0cml4LmlzQWZmaW5lKHRoaXMpKXt0PXIudHJhbnNwLm1hdHJpeEZuMmQ7ZT1zfWVsc2V7dD1yLnRyYW5zcC5tYXRyaXhGbjNkO2U9b31yZXR1cm4gdCtcIihcIitlLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gdGhpc1tlXS50b0ZpeGVkKDYpfSx0aGlzKS5qb2luKFwiLCBcIikrXCIpXCJ9O3ZhciBmPXttYXRyaXg6ZnVuY3Rpb24oZSx0KXt2YXIgbj1uZXcgaSh0LnVucGFyc2VkKTtyZXR1cm4gZS5tdWx0aXBseShuKX0sbWF0cml4M2Q6ZnVuY3Rpb24oZSx0KXt2YXIgbj1uZXcgaSh0LnVucGFyc2VkKTtyZXR1cm4gZS5tdWx0aXBseShuKX0scGVyc3BlY3RpdmU6ZnVuY3Rpb24oZSx0KXt2YXIgbj1uZXcgaTtuLm0zNC09MS90LnZhbHVlWzBdLnZhbHVlO3JldHVybiBlLm11bHRpcGx5KG4pfSxyb3RhdGU6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5yb3RhdGUuYXBwbHkoZSx0LnZhbHVlLm1hcChsKSl9LHJvdGF0ZTNkOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUucm90YXRlQXhpc0FuZ2xlLmFwcGx5KGUsdC52YWx1ZS5tYXAobCkpfSxyb3RhdGVYOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUucm90YXRlLmFwcGx5KGUsW3QudmFsdWVbMF0udmFsdWUsMCwwXSl9LHJvdGF0ZVk6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5yb3RhdGUuYXBwbHkoZSxbMCx0LnZhbHVlWzBdLnZhbHVlLDBdKX0scm90YXRlWjpmdW5jdGlvbihlLHQpe3JldHVybiBlLnJvdGF0ZS5hcHBseShlLFswLDAsdC52YWx1ZVswXS52YWx1ZV0pfSxzY2FsZTpmdW5jdGlvbihlLHQpe3JldHVybiBlLnNjYWxlLmFwcGx5KGUsdC52YWx1ZS5tYXAobCkpfSxzY2FsZTNkOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUuc2NhbGUuYXBwbHkoZSx0LnZhbHVlLm1hcChsKSl9LHNjYWxlWDpmdW5jdGlvbihlLHQpe3JldHVybiBlLnNjYWxlLmFwcGx5KGUsdC52YWx1ZS5tYXAobCkpfSxzY2FsZVk6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5zY2FsZS5hcHBseShlLFswLHQudmFsdWVbMF0udmFsdWUsMF0pfSxzY2FsZVo6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5zY2FsZS5hcHBseShlLFswLDAsdC52YWx1ZVswXS52YWx1ZV0pfSxza2V3OmZ1bmN0aW9uKGUsdCl7dmFyIG49bmV3IGkoXCJza2V3WChcIit0LnZhbHVlWzBdLnVucGFyc2VkK1wiKVwiKTt2YXIgcj1uZXcgaShcInNrZXdZKFwiKyh0LnZhbHVlWzFdJiZ0LnZhbHVlWzFdLnVucGFyc2VkfHwwKStcIilcIik7dmFyIHM9XCJtYXRyaXgoMS4wMDAwMCwgXCIrci5iK1wiLCBcIituLmMrXCIsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApXCI7dmFyIG89bmV3IGkocyk7cmV0dXJuIGUubXVsdGlwbHkobyl9LHNrZXdYOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUuc2tld1guYXBwbHkoZSxbdC52YWx1ZVswXS52YWx1ZV0pfSxza2V3WTpmdW5jdGlvbihlLHQpe3JldHVybiBlLnNrZXdZLmFwcGx5KGUsW3QudmFsdWVbMF0udmFsdWVdKX0sdHJhbnNsYXRlOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUudHJhbnNsYXRlLmFwcGx5KGUsdC52YWx1ZS5tYXAobCkpfSx0cmFuc2xhdGUzZDpmdW5jdGlvbihlLHQpe3JldHVybiBlLnRyYW5zbGF0ZS5hcHBseShlLHQudmFsdWUubWFwKGwpKX0sdHJhbnNsYXRlWDpmdW5jdGlvbihlLHQpe3JldHVybiBlLnRyYW5zbGF0ZS5hcHBseShlLFt0LnZhbHVlWzBdLnZhbHVlLDAsMF0pfSx0cmFuc2xhdGVZOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUudHJhbnNsYXRlLmFwcGx5KGUsWzAsdC52YWx1ZVswXS52YWx1ZSwwXSl9LHRyYW5zbGF0ZVo6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS50cmFuc2xhdGUuYXBwbHkoZSxbMCwwLHQudmFsdWVbMF0udmFsdWVdKX19O3QuZXhwb3J0cz1pfSx7XCIuL3V0aWxzL2FuZ2xlXCI6MyxcIi4vdXRpbHMvbWF0cml4XCI6NCxcIi4vdXRpbHMvY3NzVHJhbnNmb3JtU3RyaW5nXCI6NX1dLDQ6W2Z1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiByKGUsdCxuLHIpe3JldHVybiBlKnItdCpufWZ1bmN0aW9uIGkoZSx0LG4saSxzLG8sdSxhLGYpe3JldHVybiBlKnIocyxvLGEsZiktaSpyKHQsbixhLGYpK3Uqcih0LG4scyxvKX1mdW5jdGlvbiBzKGUpe3ZhciB0PWUsbj10Lm0xMSxyPXQubTIxLHM9dC5tMzEsbz10Lm00MSx1PXQubTEyLGE9dC5tMjIsZj10Lm0zMixsPXQubTQyLGM9dC5tMTMsaD10Lm0yMyxwPXQubTMzLGQ9dC5tNDMsdj10Lm0xNCxtPXQubTI0LGc9dC5tMzQseT10Lm00NDtyZXR1cm4gbippKGEsaCxtLGYscCxnLGwsZCx5KS1yKmkodSxjLHYsZixwLGcsbCxkLHkpK3MqaSh1LGMsdixhLGgsbSxsLGQseSktbyppKHUsYyx2LGEsaCxtLGYscCxnKX1mdW5jdGlvbiBvKGUpe3JldHVybiBlLm0xMz09PTAmJmUubTE0PT09MCYmZS5tMjM9PT0wJiZlLm0yND09PTAmJmUubTMxPT09MCYmZS5tMzI9PT0wJiZlLm0zMz09PTEmJmUubTM0PT09MCYmZS5tNDM9PT0wJiZlLm00ND09PTF9ZnVuY3Rpb24gdShlKXt2YXIgdD1lO3JldHVybiB0Lm0xMT09PTEmJnQubTEyPT09MCYmdC5tMTM9PT0wJiZ0Lm0xND09PTAmJnQubTIxPT09MCYmdC5tMjI9PT0xJiZ0Lm0yMz09PTAmJnQubTI0PT09MCYmdC5tMzE9PT0wJiZ0Lm0zMT09PTAmJnQubTMzPT09MSYmdC5tMzQ9PT0wJiZ0Lm00ND09PTF9ZnVuY3Rpb24gYShlKXt2YXIgdD1lLG49bmV3IGUuY29uc3RydWN0b3Iscj10Lm0xMSxzPXQubTEyLG89dC5tMTMsdT10Lm0xNCxhPXQubTIxLGY9dC5tMjIsbD10Lm0yMyxjPXQubTI0LGg9dC5tMzEscD10Lm0zMixkPXQubTMzLHY9dC5tMzQsbT10Lm00MSxnPXQubTQyLHk9dC5tNDMsYj10Lm00NDtuLm0xMT1pKGYscCxnLGwsZCx5LGMsdixiKTtuLm0yMT0taShhLGgsbSxsLGQseSxjLHYsYik7bi5tMzE9aShhLGgsbSxmLHAsZyxjLHYsYik7bi5tNDE9LWkoYSxoLG0sZixwLGcsbCxkLHkpO24ubTEyPS1pKHMscCxnLG8sZCx5LHUsdixiKTtuLm0yMj1pKHIsaCxtLG8sZCx5LHUsdixiKTtuLm0zMj0taShyLGgsbSxzLHAsZyx1LHYsYik7bi5tNDI9aShyLGgsbSxzLHAsZyxvLGQseSk7bi5tMTM9aShzLGYsZyxvLGwseSx1LGMsYik7bi5tMjM9LWkocixhLG0sbyxsLHksdSxjLGIpO24ubTMzPWkocixhLG0scyxmLGcsdSxjLGIpO24ubTQzPS1pKHIsYSxtLHMsZixnLG8sbCx5KTtuLm0xND0taShzLGYscCxvLGwsZCx1LGMsdik7bi5tMjQ9aShyLGEsaCxvLGwsZCx1LGMsdik7bi5tMzQ9LWkocixhLGgscyxmLHAsdSxjLHYpO24ubTQ0PWkocixhLGgscyxmLHAsbyxsLGQpO3JldHVybiBufWZ1bmN0aW9uIGYoZSl7dmFyIHQ7aWYodShlKSl7dD1uZXcgZS5jb25zdHJ1Y3RvcjtpZighKGUubTQxPT09MCYmZS5tNDI9PT0wJiZlLm00Mz09PTApKXt0Lm00MT0tZS5tNDE7dC5tNDI9LWUubTQyO3QubTQzPS1lLm00M31yZXR1cm4gdH12YXIgbj1hKGUpO3ZhciByPXMoZSk7aWYoTWF0aC5hYnMocik8MWUtOClyZXR1cm4gbnVsbDtmb3IodmFyIGk9MTtpPDU7aSsrKXtmb3IodmFyIG89MTtvPDU7bysrKXtuW1wibVwiK2krb10vPXJ9fXJldHVybiBufWZ1bmN0aW9uIGwoZSx0KXtpZighdClyZXR1cm4gbnVsbDt2YXIgbj10LHI9ZSxpPW5ldyBlLmNvbnN0cnVjdG9yO2kubTExPW4ubTExKnIubTExK24ubTEyKnIubTIxK24ubTEzKnIubTMxK24ubTE0KnIubTQxO2kubTEyPW4ubTExKnIubTEyK24ubTEyKnIubTIyK24ubTEzKnIubTMyK24ubTE0KnIubTQyO2kubTEzPW4ubTExKnIubTEzK24ubTEyKnIubTIzK24ubTEzKnIubTMzK24ubTE0KnIubTQzO2kubTE0PW4ubTExKnIubTE0K24ubTEyKnIubTI0K24ubTEzKnIubTM0K24ubTE0KnIubTQ0O2kubTIxPW4ubTIxKnIubTExK24ubTIyKnIubTIxK24ubTIzKnIubTMxK24ubTI0KnIubTQxO2kubTIyPW4ubTIxKnIubTEyK24ubTIyKnIubTIyK24ubTIzKnIubTMyK24ubTI0KnIubTQyO2kubTIzPW4ubTIxKnIubTEzK24ubTIyKnIubTIzK24ubTIzKnIubTMzK24ubTI0KnIubTQzO2kubTI0PW4ubTIxKnIubTE0K24ubTIyKnIubTI0K24ubTIzKnIubTM0K24ubTI0KnIubTQ0O2kubTMxPW4ubTMxKnIubTExK24ubTMyKnIubTIxK24ubTMzKnIubTMxK24ubTM0KnIubTQxO2kubTMyPW4ubTMxKnIubTEyK24ubTMyKnIubTIyK24ubTMzKnIubTMyK24ubTM0KnIubTQyO2kubTMzPW4ubTMxKnIubTEzK24ubTMyKnIubTIzK24ubTMzKnIubTMzK24ubTM0KnIubTQzO2kubTM0PW4ubTMxKnIubTE0K24ubTMyKnIubTI0K24ubTMzKnIubTM0K24ubTM0KnIubTQ0O2kubTQxPW4ubTQxKnIubTExK24ubTQyKnIubTIxK24ubTQzKnIubTMxK24ubTQ0KnIubTQxO2kubTQyPW4ubTQxKnIubTEyK24ubTQyKnIubTIyK24ubTQzKnIubTMyK24ubTQ0KnIubTQyO2kubTQzPW4ubTQxKnIubTEzK24ubTQyKnIubTIzK24ubTQzKnIubTMzK24ubTQ0KnIubTQzO2kubTQ0PW4ubTQxKnIubTE0K24ubTQyKnIubTI0K24ubTQzKnIubTM0K24ubTQ0KnIubTQ0O3JldHVybiBpfWZ1bmN0aW9uIGMoZSl7dmFyIHQ9bmV3IGUuY29uc3RydWN0b3I7dmFyIG49NCxyPTQ7dmFyIGk9cixzO3doaWxlKGkpe3M9bjt3aGlsZShzKXt0W1wibVwiK2krc109ZVtcIm1cIitzK2ldO3MtLX1pLS19cmV0dXJuIHR9dC5leHBvcnRzPXtkZXRlcm1pbmFudDJ4MjpyLGRldGVybWluYW50M3gzOmksZGV0ZXJtaW5hbnQ0eDQ6cyxpc0FmZmluZTpvLGlzSWRlbnRpdHlPclRyYW5zbGF0aW9uOnUsYWRqb2ludDphLGludmVyc2U6ZixtdWx0aXBseTpsfX0se31dLDM6W2Z1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiByKGUpe3JldHVybiBlKk1hdGguUEkvMTgwfWZ1bmN0aW9uIGkoZSl7cmV0dXJuIGUqKDE4MC9NYXRoLlBJKX1mdW5jdGlvbiBzKGUpe3JldHVybiBlLyg0MDAvMzYwKX10LmV4cG9ydHM9e2RlZzJyYWQ6cixyYWQyZGVnOmksZ3JhZDJkZWc6c319LHt9XSw1OltmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gcihlKXt2YXIgdD0vKFtcXC1cXCtdP1swLTldK1tcXC4wLTldKikoZGVnfHJhZHxncmFkfHB4fCUpKi87dmFyIG49ZS5tYXRjaCh0KXx8W107cmV0dXJue3ZhbHVlOnBhcnNlRmxvYXQoblsxXSksdW5pdHM6blsyXSx1bnBhcnNlZDplfX1mdW5jdGlvbiBpKGUsdCl7dmFyIG49LyhcXHcrKVxcKChbXlxcKV0rKVxcKS9pO3ZhciBpPWUudG9TdHJpbmcoKS5tYXRjaChuKS5zbGljZSgxKTt2YXIgcz1pWzBdO3ZhciBvPWlbMV0uc3BsaXQoLywgPy8pO3ZhciB1PSF0JiZvLm1hcChyKTtyZXR1cm57a2V5OnMsdmFsdWU6dXx8byx1bnBhcnNlZDplfX1mdW5jdGlvbiBzKGUpe3ZhciB0PS8oXFx3KylcXChbXlxcKV0rXFwpL2lnO3ZhciBuPWUubWF0Y2godCl8fFtdO3JldHVybiBufXQuZXhwb3J0cz17bWF0cml4Rm4yZDpcIm1hdHJpeFwiLG1hdHJpeEZuM2Q6XCJtYXRyaXgzZFwiLHZhbHVlVG9PYmplY3Q6cixzdGF0ZW1lbnRUb09iamVjdDppLHN0cmluZ1RvU3RhdGVtZW50czpzfX0se31dfSx7fSxbMV0pKDEpfSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCd4JyxcclxuXHQneScsXHJcblx0J3onLFxyXG5cdCdzY2FsZVgnLFxyXG5cdCdzY2FsZVknLFxyXG5cdCdzY2FsZVonLFxyXG5cdCdyb3RhdGlvblgnLFxyXG5cdCdyb3RhdGlvblknLFxyXG5cdCdyb3RhdGlvblonXHJcbl07IiwidmFyIF9kaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHJcblx0X3Rlc3RQcm9wcyA9IGZ1bmN0aW9uKGFycikge1xyXG5cdFx0dmFyIGlkeCA9IGFyci5sZW5ndGg7XHJcblx0XHR3aGlsZSAoaWR4LS0pIHtcclxuXHRcdFx0aWYgKF9kaXYuc3R5bGVbYXJyW2lkeF1dICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gYXJyW2lkeF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gJyc7XHJcblx0fTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHRyYW5zZm9ybTogX3Rlc3RQcm9wcyhbXHJcblx0XHQndHJhbnNmb3JtJyxcclxuXHRcdCdtc1RyYW5zZm9ybScsXHJcblx0XHQnb1RyYW5zZm9ybScsXHJcblx0XHQnbW96VHJhbnNmb3JtJyxcclxuXHRcdCd3ZWJraXRUcmFuc2Zvcm0nXHJcblx0XSlcclxufTtcclxuXHJcbl9kaXYgPSBudWxsOyIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcclxuXHJcblx0RWxlbSA9IHJlcXVpcmUoJy4vRWxlbScpLFxyXG5cdE9iaiA9IHJlcXVpcmUoJy4vT2JqJyk7XHJcblxyXG52YXIgRWxlbXMgPSBmdW5jdGlvbihhcnIpIHtcclxuXHR0aGlzLl9hcnIgPSBfLm1hcChhcnIsIGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0cmV0dXJuIF8uaXNFbGVtZW50KG9iaikgPyBuZXcgRWxlbShvYmopIDogbmV3IE9iaihvYmopO1xyXG5cdH0pO1xyXG5cclxuXHR0aGlzLl9tYXRyaXhBcnIgPSBbXTtcclxufTtcclxuXHJcbkVsZW1zLnByb3RvdHlwZSA9IHtcclxuXHR2YWx1ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRlYWNoOiBmdW5jdGlvbihpdGVyYXRvcikge1xyXG5cdFx0dmFyIGlkeCA9IDAsIGxlbmd0aCA9IHRoaXMuX2Fyci5sZW5ndGg7XHJcblx0XHRmb3IgKDsgaWR4IDwgbGVuZ3RoOyBpZHgrKykge1xyXG5cdFx0XHRpdGVyYXRvcih0aGlzLl9hcnJbaWR4XSwgaWR4KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG1hdHJpeDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gXy5mYXN0bWFwKHRoaXMuX2FyciwgZnVuY3Rpb24oZWxlbSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbS5tYXRyaXgoKTtcclxuXHRcdH0sIHRoaXMuX21hdHJpeEFycik7XHJcblx0fSxcclxuXHJcblx0ZnJvbTogZnVuY3Rpb24ob2JqKSB7XHJcblx0XHR2YXIgaWR4ID0gdGhpcy5fYXJyLmxlbmd0aDtcclxuXHRcdHdoaWxlIChpZHgtLSkge1xyXG5cdFx0XHR0aGlzLl9hcnJbaWR4XS5mcm9tKG9iaik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHR0bzogZnVuY3Rpb24ob2JqKSB7XHJcblx0XHR2YXIgaWR4ID0gdGhpcy5fYXJyLmxlbmd0aDtcclxuXHRcdHdoaWxlIChpZHgtLSkge1xyXG5cdFx0XHR0aGlzLl9hcnJbaWR4XS50byhvYmopO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0eW95bzogZnVuY3Rpb24oeW95bykge1xyXG5cdFx0dmFyIGlkeCA9IHRoaXMuX2Fyci5sZW5ndGg7XHJcblx0XHR3aGlsZSAoaWR4LS0pIHtcclxuXHRcdFx0dGhpcy5fYXJyW2lkeF0ueW95byh5b3lvKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZTogZnVuY3Rpb24ocGVyYykge1xyXG5cdFx0dmFyIGlkeCA9IDAsIGxlbmd0aCA9IHRoaXMuX2Fyci5sZW5ndGg7XHJcblx0XHRmb3IgKDsgaWR4IDwgbGVuZ3RoOyBpZHgrKykge1xyXG5cdFx0XHR0aGlzLl9hcnJbaWR4XS51cGRhdGUocGVyYyk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZXZlcnNlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpZHggPSB0aGlzLl9hcnIubGVuZ3RoO1xyXG5cdFx0d2hpbGUgKGlkeC0tKSB7XHJcblx0XHRcdHRoaXMuX2FycltpZHhdLnJldmVyc2UoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpZHggPSAwLCBsZW5ndGggPSB0aGlzLl9hcnIubGVuZ3RoO1xyXG5cdFx0Zm9yICg7IGlkeCA8IGxlbmd0aDsgaWR4KyspIHtcclxuXHRcdFx0dGhpcy5fYXJyW2lkeF0uc3RhcnQoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWxlbXM7IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlscycpLFxyXG5cclxuXHRfcHJvcHMgPSByZXF1aXJlKCcuLi9zdHlsZXMvcHJvcHMnKSxcclxuXHRcclxuXHRXZWJNYXRyaXggPSB3aW5kb3cuV2ViS2l0Q1NTTWF0cml4ID8gd2luZG93LldlYktpdENTU01hdHJpeCA6IHJlcXVpcmUoJy4uL3BvbHlmaWxscy9YQ1NTTWF0cml4JyksXHJcblx0XHJcblx0TWF0cml4ID0gcmVxdWlyZSgnLi4vTWF0cml4JyksXHJcblxyXG5cdE9iaiA9IHJlcXVpcmUoJy4vT2JqJyk7XHJcblxyXG52YXIgX2dldENvbXB1dGVkTWF0cml4ID0gZnVuY3Rpb24oY29tcHV0ZWRTdHlsZXMpIHtcclxuXHRcdHJldHVybiBuZXcgV2ViTWF0cml4KGNvbXB1dGVkU3R5bGVzW19wcm9wcy50cmFuc2Zvcm1dKTtcclxuXHR9LFxyXG5cclxuXHRfZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uKGVsZW0pIHtcclxuXHRcdHJldHVybiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xyXG5cdH07XHJcblxyXG52YXIgRWxlbSA9IGZ1bmN0aW9uKGVsZW0pIHtcclxuXHR0aGlzLl9lbGVtID0gZWxlbTtcclxuXHJcblx0dGhpcy5fb2JqID0gbmV3IE9iaigpO1xyXG59O1xyXG5cclxuRWxlbS5wcm90b3R5cGUgPSB7XHJcblx0dmFsdWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW07XHJcblx0fSxcclxuXHJcblx0bWF0cml4OiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9vYmoubWF0cml4KCk7XHJcblx0fSxcclxuXHJcblx0ZnJvbTogZnVuY3Rpb24ob2JqKSB7XHJcblx0XHR0aGlzLl9vYmouZnJvbShvYmopO1xyXG5cdH0sXHJcblxyXG5cdHRvOiBmdW5jdGlvbihvYmopIHtcclxuXHRcdHRoaXMuX29iai50byhvYmopO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0eW95bzogZnVuY3Rpb24oeW95bykge1xyXG5cdFx0dGhpcy5fb2JqLnlveW8oeW95byk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHR1cGRhdGU6IGZ1bmN0aW9uKHBlcmMpIHtcclxuXHRcdHRoaXMuX29iai51cGRhdGUocGVyYyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRhcHBseU1hdHJpeDogZnVuY3Rpb24obWF0cml4KSB7XHJcblx0XHRpZiAoIW1hdHJpeCkgeyByZXR1cm47IH1cclxuXHRcdHRoaXMuX2VsZW0uc3R5bGVbX3Byb3BzLnRyYW5zZm9ybV0gPSBtYXRyaXgudG9TdHJpbmcoKTtcclxuXHR9LFxyXG5cclxuXHRyZXZlcnNlOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuX29iai5yZXZlcnNlKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRzdGFydDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY29tcHV0ZWRTdHlsZXM7XHJcblx0XHQvLyBJZiBmcm9tIGhhc24ndCBiZWVuIHNldCBvbiB0aGUgb2JqZWN0XHJcblx0XHRpZiAoIV8uaGFzU2l6ZSh0aGlzLl9vYmoudmFsdWUoKSkpIHtcclxuXHJcblx0XHRcdGNvbXB1dGVkU3R5bGVzID0gX2dldENvbXB1dGVkU3R5bGUodGhpcy5fZWxlbSk7XHJcblxyXG5cdFx0XHR2YXIgZnJvbSA9IHt9LFxyXG5cdFx0XHRcdHRvID0gdGhpcy5fb2JqLmdldFRvKCk7XHJcblx0XHRcdGZvciAodmFyIHByb3BlcnR5IGluIHRvKSB7XHJcblx0XHRcdFx0ZnJvbVtwcm9wZXJ0eV0gPSBjb21wdXRlZFN0eWxlc1twcm9wZXJ0eV07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX29iai5mcm9tKGZyb20pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzdGFydCB0aGUgb2JqZWN0Li4uXHJcblx0XHR0aGlzLl9vYmouc3RhcnQoKTtcclxuXHJcblx0XHQvLyAuLi5zbyB0aGF0IHdlIGNhbiBjaGVjayBpZiBpdCBoYXMgYSBtYXRyaXggc2V0LlxyXG5cdFx0Ly8gSWYgaXQgZG9lcywgbWFrZSBzdXJlIHdlIHNldCBhIHN0YXJ0aW5nIHBvaW50XHJcblx0XHQvLyBmb3IgdGhlIG1hdHJpeCBiYXNlZCBvZmYgb2YgdGhlIGVsZW1lbnQncyBjdXJyZW50XHJcblx0XHQvLyB0cmFuc2Zvcm1hdGlvblxyXG5cdFx0dmFyIG9iamVjdE1hdHJpeCA9IHRoaXMuX29iai5oYXNNYXRyaXgoKTtcclxuXHRcdGlmIChvYmplY3RNYXRyaXgpIHtcclxuXHRcdFx0dGhpcy5fb2JqLnNldE1hdHJpeFN0YXJ0KFxyXG5cdFx0XHRcdG5ldyBNYXRyaXgoXHJcblx0XHRcdFx0XHQvLyByZXVzZSB0aGUgY29tcHV0ZWQgbWF0cml4IGlmIHdlIGNhblxyXG5cdFx0XHRcdFx0X2dldENvbXB1dGVkTWF0cml4KGNvbXB1dGVkU3R5bGVzIHx8IF9nZXRDb21wdXRlZFN0eWxlKHRoaXMuX2VsZW0pKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW07IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlscycpLFxyXG5cdFxyXG5cdF9tYXRyaXhBbmltYXRhYmxlcyA9IHJlcXVpcmUoJy4uL3N0eWxlcy9tYXRyaXgtYW5pbWF0YWJsZXMnKSxcclxuXHRcclxuXHRNYXRyaXggPSByZXF1aXJlKCcuLi9NYXRyaXgnKSxcclxuXHJcblx0X2V4cGFuZFNob3J0aGFuZCA9IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0aWYgKG9iai5zY2FsZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdG9iai5zY2FsZVggPSBvYmouc2NhbGU7XHJcblx0XHRcdG9iai5zY2FsZVkgPSBvYmouc2NhbGU7XHJcblx0XHR9XHJcblx0XHRpZiAob2JqLnJvdGF0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0b2JqLnJvdGF0aW9uWiA9IHRvLnJvdGF0aW9uO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG9iajtcclxuXHR9O1xyXG5cclxudmFyIE9iaiA9IGZ1bmN0aW9uKG9iaikge1xyXG5cdHRoaXMuX29iamVjdCA9IG9iaiA/IF9leHBhbmRTaG9ydGhhbmQob2JqKSA6IHt9O1xyXG5cclxuXHR0aGlzLl92YWx1ZXNTdGFydCAgICAgICA9IHt9O1xyXG5cdHRoaXMuX3ZhbHVlc0VuZCAgICAgICAgID0ge307XHJcblx0dGhpcy5fdmFsdWVzU3RhcnRSZXBlYXQgPSB7fTtcclxuXHR0aGlzLl95b3lvICAgICAgICAgICAgICA9IGZhbHNlO1xyXG5cclxuXHQvLyBNYXRyaXggc3R1ZmZzIGFyZSBvbmx5IGNyZWF0ZWQgaWZcclxuXHQvLyB0aGVyZSBhcmUgbWF0cml4IHRyYW5zZm9ybWF0aW9uc1x0XHJcblx0Ly8gdGhpcy5fbWF0cml4ICAgICAgICAgICAgID0gbmV3IE1hdHJpeCgpO1xyXG5cdC8vIHRoaXMuX2N1cnJlbnRNYXRyaXhTdGF0ZSA9IG1hdHJpeDtcclxuXHQvLyB0aGlzLl9tYXRyaXhTdGFydCAgICAgICAgPSB7fTtcclxuXHQvLyB0aGlzLl9tYXRyaXhFbmQgICAgICAgICAgPSB7fTtcclxufTtcclxuXHJcbk9iai5wcm90b3R5cGUgPSB7XHJcblx0Ly8gVXNlZCBieSBFbGVtIC0tLS0tXHJcblx0c2V0TWF0cml4U3RhcnQ6IGZ1bmN0aW9uKG1hdHJpeCkge1xyXG5cdFx0dGhpcy5fbWF0cml4U3RhcnQgPSBtYXRyaXg7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cdGhhc01hdHJpeDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gISF0aGlzLl9tYXRyaXg7XHJcblx0fSxcclxuXHRnZXRUbzogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmFsdWVzRW5kO1xyXG5cdH0sXHJcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHR2YWx1ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fb2JqZWN0O1xyXG5cdH0sXHJcblxyXG5cdGZyb206IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0dGhpcy5fb2JqZWN0ID0gX2V4cGFuZFNob3J0aGFuZChvYmopO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0bWF0cml4OiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9jdXJyZW50TWF0cml4U3RhdGU7XHJcblx0fSxcclxuXHJcblx0dG86IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0dGhpcy5fdmFsdWVzRW5kID0gX2V4cGFuZFNob3J0aGFuZChvYmopO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0eW95bzogZnVuY3Rpb24oeW95bykge1xyXG5cdFx0dGhpcy5feW95byA9IHlveW87XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHR1cGRhdGU6IGZ1bmN0aW9uKHBlcmMpIHtcclxuXHRcdGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMuX3ZhbHVlc0VuZCkge1xyXG5cclxuXHRcdFx0dmFyIHN0YXJ0ID0gdGhpcy5fdmFsdWVzU3RhcnRbcHJvcGVydHldIHx8IDAsXHJcblx0XHRcdFx0ZW5kID0gdGhpcy5fdmFsdWVzRW5kW3Byb3BlcnR5XTtcclxuXHJcblx0XHRcdC8vIFBhcnNlcyByZWxhdGl2ZSBlbmQgdmFsdWVzIHdpdGggc3RhcnQgYXMgYmFzZSAoZS5nLjogKzEwLCAtMylcclxuXHRcdFx0aWYgKF8uaXNTdHJpbmcoZW5kKSkge1xyXG5cdFx0XHRcdGVuZCA9IHN0YXJ0ICsgcGFyc2VGbG9hdChlbmQsIDEwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcHJvdGVjdCBhZ2FpbnN0IG5vbiBudW1lcmljIHByb3BlcnRpZXMuXHJcblx0XHRcdGlmIChlbmQgPT09ICtlbmQpIHtcclxuXHRcdFx0XHR0aGlzLl9vYmplY3RbcHJvcGVydHldID0gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogcGVyYztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9tYXRyaXgpIHtcclxuXHRcdFx0Zm9yIChwcm9wZXJ0eSBpbiB0aGlzLl9tYXRyaXhFbmQpIHtcclxuXHJcblx0XHRcdFx0dmFyIG1hdHJpeFN0YXJ0ID0gdGhpcy5fbWF0cml4U3RhcnRbcHJvcGVydHldLFxyXG5cdFx0XHRcdFx0bWF0cml4RW5kID0gdGhpcy5fbWF0cml4RW5kW3Byb3BlcnR5XTtcclxuXHJcblx0XHRcdFx0dGhpcy5fbWF0cml4W3Byb3BlcnR5XSA9IG1hdHJpeFN0YXJ0ICsgKG1hdHJpeEVuZCAtIG1hdHJpeFN0YXJ0KSAqIHBlcmM7XHJcblxyXG5cdFx0XHRcdHRoaXMuX2N1cnJlbnRNYXRyaXhTdGF0ZSA9IHRoaXMuX21hdHJpeC51cGRhdGUoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5fb2JqZWN0W3Byb3BlcnR5XSA9IHRoaXMuX21hdHJpeFtwcm9wZXJ0eV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZXZlcnNlOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0bXA7XHJcblx0XHQvLyByZWFzc2lnbiBzdGFydGluZyB2YWx1ZXNcclxuXHRcdGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMuX3ZhbHVlc1N0YXJ0UmVwZWF0KSB7XHJcblxyXG5cdFx0XHRpZiAoXy5pc1N0cmluZyh0aGlzLl92YWx1ZXNFbmRbcHJvcGVydHldKSkge1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IHRoaXMuX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSArIHBhcnNlRmxvYXQodGhpcy5fdmFsdWVzRW5kW3Byb3BlcnR5XSwgMTApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5feW95bykge1xyXG5cdFx0XHRcdHRtcCA9IHRoaXMuX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSB0aGlzLl92YWx1ZXNFbmRbcHJvcGVydHldO1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlc0VuZFtwcm9wZXJ0eV0gPSB0bXA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9IHRoaXMuX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX21hdHJpeCkge1xyXG5cdFx0XHRmb3IgKHByb3BlcnR5IGluIHRoaXMuX21hdHJpeFN0YXJ0UmVwZWF0KSB7XHJcblxyXG5cdFx0XHRcdGlmIChfLmlzU3RyaW5nKHRoaXMuX21hdHJpeEVuZFtwcm9wZXJ0eV0pKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9tYXRyaXhTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSB0aGlzLl9tYXRyaXhTdGFydFJlcGVhdFtwcm9wZXJ0eV0gKyBwYXJzZUZsb2F0KHRoaXMuX21hdHJpeEVuZFtwcm9wZXJ0eV0sIDEwKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLl95b3lvKSB7XHJcblx0XHRcdFx0XHR0bXAgPSB0aGlzLl9tYXRyaXhTdGFydFJlcGVhdFtwcm9wZXJ0eV07XHJcblx0XHRcdFx0XHR0aGlzLl9tYXRyaXhTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSB0aGlzLl9tYXRyaXhFbmRbcHJvcGVydHldO1xyXG5cdFx0XHRcdFx0dGhpcy5fbWF0cml4RW5kW3Byb3BlcnR5XSA9IHRtcDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX21hdHJpeFN0YXJ0W3Byb3BlcnR5XSA9IHRoaXMuX21hdHJpeFN0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcclxuXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRzdGFydDogZnVuY3Rpb24oKSB7XHJcblx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzLl92YWx1ZXNFbmQpIHtcclxuXHJcblx0XHRcdC8vIG9taXQgdW5jaGFuZ2VkIHByb3BlcnRpZXNcclxuXHRcdFx0aWYgKHRoaXMuX3ZhbHVlc0VuZFtwcm9wZXJ0eV0gPT09IHRoaXMuX29iamVjdFtwcm9wZXJ0eV0pIHtcclxuXHRcdFx0XHRkZWxldGUgdGhpcy5fdmFsdWVzRW5kW3Byb3BlcnR5XTtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fdmFsdWVzU3RhcnRbcHJvcGVydHldID0gdGhpcy5fb2JqZWN0W3Byb3BlcnR5XTtcclxuXHJcblx0XHRcdHRoaXMuX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSAqPSAxLjA7IC8vIEVuc3VyZXMgd2UncmUgdXNpbmcgbnVtYmVycywgbm90IHN0cmluZ3NcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IHRoaXMuX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyB0cmFuc2xhdGUgbWF0cml4IHZhbHVlcyBvdmVyIHRvIF9tYXRyaXhTdGFydFxyXG5cdFx0dmFyIG1hdHJpeEVuZCxcclxuXHRcdFx0aWR4ID0gX21hdHJpeEFuaW1hdGFibGVzLmxlbmd0aCxcclxuXHRcdFx0YW5pbWF0YWJsZTtcclxuXHRcdHdoaWxlIChpZHgtLSkge1xyXG5cdFx0XHRhbmltYXRhYmxlID0gX21hdHJpeEFuaW1hdGFibGVzW2lkeF07XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5fdmFsdWVzRW5kW2FuaW1hdGFibGVdICE9PSB1bmRlZmluZWQpIHtcclxuXHJcblx0XHRcdFx0bWF0cml4RW5kID0gKG1hdHJpeEVuZCB8fCB7fSk7XHJcblxyXG5cdFx0XHRcdG1hdHJpeEVuZFthbmltYXRhYmxlXSA9IHRoaXMuX3ZhbHVlc0VuZFthbmltYXRhYmxlXTtcclxuXHJcblx0XHRcdFx0Ly8gcmVtb3ZlIGZyb20gX3ZhbHVlc1N0YXJ0IGFuZCBfdmFsdWVzRW5kIHNvIHRoYXQgd2UgZG9uJ3RcclxuXHRcdFx0XHQvLyBwZXJmb3JtIGNhbGN1bGF0aW9ucyBvbiB0aGVtXHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMuX3ZhbHVlc0VuZFthbmltYXRhYmxlXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHJlcXVpcmVzIGEgbWF0cml4XHJcblx0XHRpZiAobWF0cml4RW5kKSB7XHJcblx0XHRcdHRoaXMuX21hdHJpeCA9IG5ldyBNYXRyaXgoKTtcclxuXHJcblx0XHRcdHRoaXMuX21hdHJpeEVuZCA9IG1hdHJpeEVuZDtcclxuXHJcblx0XHRcdHRoaXMuX21hdHJpeFN0YXJ0ID0gdGhpcy5fbWF0cml4U3RhcnQgfHwge307XHJcblx0XHRcdHRoaXMuX21hdHJpeFN0YXJ0UmVwZWF0ID0ge307XHJcblxyXG5cdFx0XHRmb3IgKHByb3BlcnR5IGluIHRoaXMuX21hdHJpeEVuZCkge1xyXG5cclxuXHRcdFx0XHR0aGlzLl9tYXRyaXhTdGFydFtwcm9wZXJ0eV0gPSB0aGlzLl9tYXRyaXhTdGFydFtwcm9wZXJ0eV0gfHwgdGhpcy5fdmFsdWVzU3RhcnRbcHJvcGVydHldIHx8IDA7XHJcblxyXG5cdFx0XHRcdHRoaXMuX21hdHJpeFN0YXJ0W3Byb3BlcnR5XSAqPSAxLjA7IC8vIEVuc3VyZXMgd2UncmUgdXNpbmcgbnVtYmVycywgbm90IHN0cmluZ3NcclxuXHJcblx0XHRcdFx0dGhpcy5fbWF0cml4U3RhcnRSZXBlYXRbcHJvcGVydHldID0gdGhpcy5fbWF0cml4U3RhcnRbcHJvcGVydHldIHx8IDA7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9iajsiLCJ2YXIgX3RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdG5vb3A6IGZ1bmN0aW9uKCkge30sXHJcblx0XHJcblx0aXNBcnJheUxpa2U6IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0cmV0dXJuICghIW9iaiAmJiBvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCk7XHJcblx0fSxcclxuXHJcblx0aXNFbGVtZW50OiBmdW5jdGlvbihvYmopIHtcclxuXHRcdHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcclxuXHR9LFxyXG5cclxuXHRpc1N0cmluZzogZnVuY3Rpb24ob2JqKSB7XHJcblx0XHRyZXR1cm4gX3RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcblx0fSxcclxuXHJcblx0aXNOdW1iZXI6IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0cmV0dXJuIF90b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xyXG5cdH0sXHJcblxyXG5cdGV4aXN0czogZnVuY3Rpb24ob2JqKSB7XHJcblx0XHRyZXR1cm4gKG9iaiAhPT0gbnVsbCAmJiBvYmogIT09IHVuZGVmaW5lZCk7XHJcblx0fSxcclxuXHJcblx0bWFwOiBmdW5jdGlvbihhcnIsIGl0ZXJhdG9yKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW10sXHJcblx0XHRcdGlkeCA9IDAsIGxlbmd0aCA9IGFyci5sZW5ndGg7XHJcblx0XHRmb3IgKDsgaWR4IDwgbGVuZ3RoOyBpZHgrKykge1xyXG5cdFx0XHRyZXN1bHRbaWR4XSA9IGl0ZXJhdG9yKGFycltpZHhdLCBpZHgpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHRmYXN0bWFwOiBmdW5jdGlvbihhcnIsIGl0ZXJhdG9yLCByZXN1bHQpIHtcclxuXHRcdHZhciBpZHggPSAwLCBsZW5ndGggPSBhcnIubGVuZ3RoO1xyXG5cdFx0Zm9yICg7IGlkeCA8IGxlbmd0aDsgaWR4KyspIHtcclxuXHRcdFx0cmVzdWx0W2lkeF0gPSBpdGVyYXRvcihhcnJbaWR4XSwgaWR4KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0aGFzU2l6ZTogZnVuY3Rpb24ob2JqKSB7XHJcblx0XHRpZiAoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdGZvciAodmFyIGtleSBpbiBvYmopIHsgcmV0dXJuIHRydWU7IH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHRleHRlbmQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMsXHJcblx0XHRcdG9iaiA9IGFyZ3NbMF0sXHJcblx0XHRcdGlkeCA9IDEsIGxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xyXG5cclxuXHRcdGlmICghb2JqKSB7IHJldHVybiBvYmo7IH1cclxuXHJcblx0XHRmb3IgKDsgaWR4IDwgbGVuZ3RoOyBpZHgrKykge1xyXG5cdFx0XHR2YXIgc291cmNlID0gYXJnc1tpZHhdO1xyXG5cdFx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcclxuXHRcdFx0XHRcdG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb2JqO1xyXG5cdH0sXHJcblxyXG5cdG5vdzogKHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gdW5kZWZpbmVkICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCkgP1xyXG5cdFx0Ly8gV3JhcCBpbiBmdW5jdGlvbiB0byBhdm9pZCBpbGxlZ2FsIHJlZmVyZW5jZSBlcnJvcnNcclxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpOyB9IDpcclxuXHRcdC8vIEZhbGxiYWNrIHRvIG5vd1xyXG5cdFx0RGF0ZS5ub3cgPyBEYXRlLm5vdyA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH1cclxufTsiXX0=
;