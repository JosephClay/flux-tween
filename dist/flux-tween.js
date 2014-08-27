(function(window, document, Math, Object, undefined) {
    (function(name, definition) {

        if (typeof define === 'function') { // AMD
            define(function() { return definition; });
        } else if (typeof module !== 'undefined' && module.exports) { // Node.js
            module.exports = definition;
        } else { // Browser
            this[name] = definition;
        }

    })('FLUX',

    (function(config, definitions, undefined) {

        var modules = {

        };

        var moduleCache = {

        };

        var aliases = {

        };

        for (var alias in config.aliases) {
            aliases[alias] = config.aliases[alias];
        }

        var require = function(path) {
            path = aliases[path] || path;
            return moduleCache[path] || (moduleCache[path] = modules[path]());
        };

        var define = function(path, definition) {
            var module;

            modules[path] = function() {
                if (module) {
                    return module.exports;
                }
                module = { exports: {} };
                definition(require, module, module.exports);
                return module.exports;
            };
        };

        for (var path in definitions) {
            define(path, definitions[path]);
        }

        return require(config.main);

    }(
        {
            "main": 1,
            "aliases": {}
        },
        {
            "1": function(require, module, exports) {
                require('8');

                var previousFlux = window.FLUX,

                	FLUX = {

                		Tween: require('11'),
                		Spring: require('10'),

                		Easing: require('2'),

                		update: require('4').update,

                		noConflict: function() {

                			window.FLUX = previousFlux;
                			return FLUX;

                		}
                	};

                // TODO: Dont assign to window after going to rq build
                return (module.exports = window.FLUX = FLUX);
            },
            "8": function(require, module, exports) {
                if (!Date.now) {
                    Date.now = function now() {
                        return new Date().getTime();
                    };
                }
            },
            "11": function(require, module, exports) {
                var _ = require('5'),

                	_loop = require('4'),

                	Animator = require('9'),

                	Easing = require('2'),

                	TweenAnimation = require('7');

                var FluxTween = function Tween(obj) {

                	if (!(this instanceof FluxTween)) { return new FluxTween(obj); }

                	Animator.call(this, obj);

                	this._animation = new TweenAnimation();

                };

                _.extend(FluxTween.prototype, Animator.prototype, {

                	from: function(obj) {

                		this._transformer.from(obj);
                		return this;

                	},

                	duration: function(duration) {

                		this._animation.duration(+duration);
                		return this;

                	},

                	ease: function(fn) {

                		this._animation.ease(fn || Easing.Linear.None);
                		return this;

                	},

                	_start: function() {

                		var self = this;
                		this._animation
                			.registerCallbacks({

                				onUpdate: function(perc) {

                					self._transformer.update(perc);

                					self._onUpdateCallback(self._transformer.value(), self._transformer.matrix());

                				},
                				onComplete: function() {

                					self._isPlaying = false;

                					_loop.remove(self._animation);

                					self._onCompleteCallback();

                				},

                				onReverse: function() {

                					self._transformer.reverse();

                				}

                			})
                			.startTime(_loop.now);

                		self._transformer.start();
                		_loop.add(self._animation);

                	}

                });

                module.exports = FluxTween;
            },
            "5": function(require, module, exports) {
                var toString = Object.prototype.toString;

                module.exports = {
                	noop: function() {},

                	isArrayLike: function(obj) {
                		return (!!obj && obj.length === +obj.length);
                	},

                	isElement: function(obj) {
                		return !!(obj && obj.nodeType === 1);
                	},

                	isString: function(obj) {
                		return toString.call(obj) === '[object String]';
                	},

                	isNumber: function(obj) {
                		return toString.call(obj) === '[object Number]';
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
                				var prop;
                				for (prop in source) {
                					obj[prop] = source[prop];
                				}
                			}
                		}

                		return obj;
                	}
                };
            },
            "4": function(require, module, exports) {
                var _ = require('5'),
                	_waiting = [],
                	_animations = [];

                var loop = {
                	now: 0,

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

                		time = loop.now = time || Date.now();

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

                			_animations[idx].step(time);
                			idx++;

                		}

                	}
                };

                module.exports = loop;
            },
            "9": function(require, module, exports) {
                var _ = require('5'),

                	_loop = require('4'),

                	TransformObj = require('14'),
                	TransformElem = require('13'),
                	TransformCollection = require('12');

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
                		if (!arguments.length) { yoyo = true; }
                		this._transformer.yoyo(yoyo);
                		return this;

                	},

                	to: function(goTo) {

                		this._transformer.to(goTo);
                		return this;

                	},

                	start: function(time) {

                		this._startTime = time || _loop.now;

                		var self = this;
                		_loop.await(function(time) {

                			var shouldContinueToWait;

                			if (time < (self._startTime + self._delayTime)) {

                				return (shouldContinueToWait = true);

                			}

                			self._onStartCallback();

                			self._isPlaying = true;

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

                	}

                	// Implemented by the inheritor
                	// _start: function() {},
                };

                module.exports = Animation;
            },
            "14": function(require, module, exports) {
                var _ = require('5'),

                	_matrixAnimatables = require('15'),

                	Matrix = require('3'),

                	_MATRIX_END = {
                		x: 0,
                		y: 0,
                		z: 0,
                		scaleX: 1,
                		scaleY: 1,
                		scaleZ: 1,
                		rotationX: 0,
                		rotationY: 0,
                		rotationZ: 0
                	},

                	_expandShorthand = function(obj) {

                		if (obj.scale !== undefined) {

                			obj.scaleX = obj.scale;
                			obj.scaleY = obj.scale;
                			delete obj.scale;

                		}

                		if (obj.rotation !== undefined) {

                			obj.rotationZ = obj.rotation;
                			delete obj.rotation;

                		}

                		if (obj.rotate !== undefined) {

                			obj.rotationZ = obj.rotate;
                			delete obj.rotate;

                		}

                		return obj;

                	};

                var Obj = function(obj) {

                	var object = this;
                	object._object = obj ? _expandShorthand(obj) : {};

                	object._valuesStart       = {};
                	object._valuesEnd         = {};
                	object._valuesStartRepeat = {};
                	object._yoyo              = false;

                	// Matrix stuffs are only created if
                	// there are matrix transformations
                	// object._matrix             = new Matrix();
                	// object._currentMatrixState = matrix;
                	// object._matrixStart        = {};
                	// object._matrixEnd          = {};
                	// object._matrixStartRepeat  = {};

                };

                Obj.prototype = {
                	// Used by Elem -----

                	setMatrixStart: function(obj) {

                		var object = this;
                		object._matrixStart = obj;
                		object._matrixStartRepeat = obj;
                		return object;

                	},

                	getMatrixStart: function() {

                		return this._matrixStart;

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

                		var object = this;
                		object._object = _expandShorthand(obj);
                		return object;

                	},

                	matrix: function() {

                		return this._currentMatrixState;

                	},

                	to: function(obj) {

                		var object = this;
                		object._valuesEnd = _expandShorthand(obj);
                		return object;

                	},

                	yoyo: function(yoyo) {

                		var object = this;
                		object._yoyo = yoyo;
                		return object;

                	},

                	update: function(perc) {

                		var property;
                		for (property in this._valuesEnd) {

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

                		var property, tmp;

                		// reassign starting values
                		for (property in this._valuesStartRepeat) {

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
                		var property;

                		for (property in this._valuesEnd) {

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
                			matrixStart,
                			idx = _matrixAnimatables.length,
                			animatable;

                		while (idx--) {

                			animatable = _matrixAnimatables[idx];

                			if (this._valuesEnd[animatable] !== undefined) {

                				matrixEnd = (matrixEnd || {
                					x: 0,
                					y: 0,
                					z: 0,
                					scaleX: 1,
                					scaleY: 1,
                					scaleZ: 1,
                					rotationX: 0,
                					rotationY: 0,
                					rotationZ: 0
                				});

                				matrixEnd[animatable] = this._valuesEnd[animatable];

                				// remove from _valuesStart and _valuesEnd so that we don't
                				// perform calculations on them
                				// delete this._valuesEnd[animatable];

                			}

                			if (this._object[animatable] !== undefined) {

                				matrixStart = (matrixStart || {
                					x: 0,
                					y: 0,
                					z: 0,
                					scaleX: 1,
                					scaleY: 1,
                					scaleZ: 1,
                					rotationX: 0,
                					rotationY: 0,
                					rotationZ: 0
                				});

                				matrixStart[animatable] = this._object[animatable];

                				// delete this._object[animatable];
                			}

                		}

                		// requires a matrix
                		if (matrixEnd) {

                			this._matrix = new Matrix();

                			this._matrixEnd = matrixEnd;

                			this._matrixStart = matrixStart || this._matrixStart || {};
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
            },
            "15": function(require, module, exports) {
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
            },
            "3": function(require, module, exports) {
                var WebMatrix = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : require('xcssmatrix'),

                	_emptyMatrix = new WebMatrix(),

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

                var Matrix = function Matrix(matrix) {

                	if (matrix instanceof WebMatrix) {

                		// Webmatrix
                		this.from(_decomposeWebMatrix(matrix));

                	}

                };

                Matrix.prototype = {
                	transpose: function(obj) {
                		if (!obj) { return; }

                		for (var property in obj) {
                			this[property] = obj[property];
                		}

                	},

                	from: function(fromMatrix) {

                		var matrix = this;
                		matrix.x         = fromMatrix.translation.x;
                		matrix.y         = fromMatrix.translation.y;
                		matrix.z         = fromMatrix.translation.z;
                		matrix.scaleX    = fromMatrix.scale.x;
                		matrix.scaleY    = fromMatrix.scale.y;
                		matrix.scaleZ    = fromMatrix.scale.z;
                		matrix.rotationX = fromMatrix.rotation.x / Math.PI * 180;
                		matrix.rotationY = fromMatrix.rotation.y / Math.PI * 180;
                		matrix.rotationZ = fromMatrix.rotation.z / Math.PI * 180;

                	},

                	update: function() {

                		var matrix = this,
                			newMatrix = _emptyMatrix;
                		newMatrix = newMatrix.translate(matrix._x, matrix._y, matrix._z);
                		newMatrix = newMatrix.rotate(matrix._rotationX, matrix._rotationY, matrix._rotationZ);
                		newMatrix = newMatrix.scale(matrix._scaleX, matrix._scaleY, matrix._scaleZ);

                		return newMatrix;

                	},

                	toObject: function() {

                		var matrix = this,
                			m = this._m || (this._m = {});
                		m.x         = matrix.x;
                		m.y         = matrix.y;
                		m.z         = matrix.z;
                		m.scaleX    = matrix.scaleX;
                		m.scaleY    = matrix.scaleY;
                		m.scaleZ    = matrix.scaleZ;
                		m.rotationX = matrix.rotationX;
                		m.rotationY = matrix.rotationY;
                		m.rotationZ = matrix.rotationZ;

                		return m;

                	}
                };

                Matrix.define = function(definition) {

                	var property;
                	for (property in definition) {

                		Object.defineProperty(Matrix.prototype, property, definition[property]);

                	}

                };

                Matrix.define({
                	x: {
                		get: function() {
                			return this._x || 0;
                		},
                		set: function(value) {
                			return (this._x = (value || 0));
                		}
                	},

                	y: {
                		get: function() {
                			return this._y || 0;
                		},
                		set: function(value) {
                			return (this._y = (value || 0));
                		}
                	},

                	z: {
                		get: function() {
                			return this._z || 0;
                		},
                		set: function(value) {
                			return (this._z = (value || 0));
                		}
                	},

                	scaleX: {
                		get: function() {
                			return this._scaleX || 1;
                		},
                		set: function(value) {
                			return (this._scaleX = (value || 0));
                		}
                	},

                	scaleY: {
                		get: function() {
                			return this._scaleY || 1;
                		},
                		set: function(value) {
                			return (this._scaleY = (value || 0));
                		}
                	},

                	scaleZ: {
                		get: function() {
                			return this._scaleZ || 1;
                		},
                		set: function(value) {
                			return (this._scaleZ = (value || 0));
                		}
                	},

                	scale: {
                		get: function() {
                			return (this._scaleX + this._scaleY) / 2.0;
                		},
                		set: function(value) {
                			return (this._scaleX = this._scaleY = (value || 0));
                		}
                	},

                	rotationX: {
                		get: function() {
                			return this._rotationX || 0;
                		},
                		set: function(value) {
                			return (this._rotationX = (value || 0));
                		}
                	},

                	rotationY: {
                		get: function() {
                			return (this._rotationY || 0);
                		},
                		set: function(value) {
                			return (this._rotationY = (value || 0));
                		}
                	},

                	rotationZ: {
                		get: function() {
                			return this._rotationZ || 0;
                		},
                		set: function(value) {
                			return (this._rotationZ = (value || 0));
                		}
                	},

                	rotation: {
                		get: function() {
                			return this.rotationZ;
                		},
                		set: function(value) {
                			return (this.rotationZ = (value || 0));
                		}
                	}
                });

                module.exports = Matrix;
            },
            "13": function(require, module, exports) {
                var _ = require('5'),

                	_props = require('16'),

                	WebMatrix = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : require('xcssmatrix'),

                	Matrix = require('3'),

                	Obj = require('14');

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
                	element: function() {

                		return this._elem;

                	},

                	value: function() {

                		return this;

                	},

                	val: function() {

                		return this._obj.value();

                	},

                	matrix: function() {

                		return this._obj.matrix();

                	},

                	from: function(obj) {

                		this._obj.from(obj);
                		return this;

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

                		matrix = matrix || this._obj.matrix();
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
                		if (this._obj.hasMatrix()) {

                			var matrix = new Matrix(
                				// reuse the computed matrix if we can
                				_getComputedMatrix(computedStyles || _getComputedStyle(this._elem))
                			);

                			matrix.transpose(this._obj.getMatrixStart());

                			this._obj.setMatrixStart(matrix.toObject());

                		}
                	}
                };

                module.exports = Elem;
            },
            "16": function(require, module, exports) {
                var _div = document.createElement('div'),

                	_selectProp = function(arr) {
                		var idx = arr.length;
                		while (idx--) {
                			if (_div.style[arr[idx]] !== undefined) {
                				return arr[idx];
                			}
                		}

                		return '';
                	};

                module.exports = {
                	transform: _selectProp([
                		'transform',
                		'msTransform',
                		'oTransform',
                		'mozTransform',
                		'webkitTransform'
                	])
                };

                _div = null;
            },
            "12": function(require, module, exports) {
                var _ = require('5'),

                	Elem = require('13'),
                	Obj = require('14');

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
            },
            "2": function(require, module, exports) {
                // from the amazing sole
                // https://github.com/sole/tween.js/
                module.exports = {

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
            },
            "7": function(require, module, exports) {
                var _ = require('5'),

                	Easing = require('2');

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
            },
            "10": function(require, module, exports) {
                var _ = require('5'),

                	_loop = require('4'),

                	Animator = require('9'),

                	SpringAnimation = require('6');

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
            },
            "6": function(require, module, exports) {
                var _END_VALUE = 100,
                	_TOLERANCE = 0.01,
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
                			shouldSpringStop = netValueIsLow || netVelocityIsLow;

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
            }
        }
    ))
    )

    ;
}(window, document, Math, Object));
