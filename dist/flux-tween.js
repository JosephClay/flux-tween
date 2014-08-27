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
                require('14');

                var previousFlux = window.FLUX,

                	FLUX = {

                		Tween: require('9'),
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
            "14": function(require, module, exports) {
                if (!Date.now) {
                    Date.now = function now() {
                        return new Date().getTime();
                    };
                }
            },
            "9": function(require, module, exports) {
                var _ = require('5'),

                	_loop = require('4'),

                	Animator = require('8'),

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
            "8": function(require, module, exports) {
                var _ = require('5'),

                	_loop = require('4'),

                	TransformObj = require('17'),
                	TransformElem = require('16'),
                	TransformCollection = require('15');

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
            "17": function(require, module, exports) {
                var _ = require('5'),

                	_matrixAnimatables = require('11'),

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
            "11": function(require, module, exports) {
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
                var WebMatrix = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : require('13'),

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
                // XCSSMatrix polyfill
                // https://github.com/jfsiii/XCSSMatrix
                (function(e){if("function"==typeof bootstrap)bootstrap("xcssmatrix",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeXCSSMatrix=e}else"undefined"!=typeof window?window.XCSSMatrix=e():global.XCSSMatrix=e()})(function(){var e,t,n,r,i;return function(e,t,n){function r(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(i)return i(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var i=e[n][1][t];return r(i?i:t)},u,u.exports)}return t[n].exports}var i=typeof require=="function"&&require;for(var s=0;s<n.length;s++)r(n[s]);return r}({1:[function(e,t,n){var r=e("./lib/XCSSMatrix.js");t.exports=r},{"./lib/XCSSMatrix.js":2}],2:[function(e,t,n){function i(e){this.m11=this.m22=this.m33=this.m44=1;this.m12=this.m13=this.m14=this.m21=this.m23=this.m24=this.m31=this.m32=this.m34=this.m41=this.m42=this.m43=0;if(typeof e==="string"){this.setMatrixValue(e)}}function u(e){return String.fromCharCode(e+97)}function a(e){return"m"+(Math.floor(e/4)+1)+(e%4+1)}function l(e){return e.value}function c(e){return f[e]}function h(e){if(e.units==="rad"){e.value=r.angles.rad2deg(e.value);e.units="deg"}else if(e.units==="grad"){e.value=r.angles.grad2deg(e.value);e.units="deg"}return e}function p(e,t){t.value=t.value.map(h);var n=c(t.key);var r=n(e,t);return r||e}function d(e){var t=r.transp.stringToStatements(e);if(t.length===1&&/^matrix/.test(e)){return e}var n=r.funcs.onlyFirstArg(r.transp.statementToObject);var s=t.map(n);var o=new i;var u=s.reduce(p,o);var a=u.toString();return a}var r={angles:e("./utils/angle"),matrix:e("./utils/matrix"),transp:e("./utils/cssTransformString"),funcs:{onlyFirstArg:function(e,t){t=t||this;return function(n){return e.call(t,n)}}}};i.displayName="XCSSMatrix";var s=["a","b","c","d","e","f"];var o=["m11","m12","m13","m14","m21","m22","m23","m24","m31","m32","m33","m34","m41","m42","m43","m44"];[["m11","a"],["m12","b"],["m21","c"],["m22","d"],["m41","e"],["m42","f"]].forEach(function(e){var t=e[0],n=e[1];Object.defineProperty(i.prototype,n,{set:function(e){this[t]=e},get:function(){return this[t]},enumerable:true,configurable:true})});i.prototype.multiply=function(e){return r.matrix.multiply(this,e)};i.prototype.inverse=function(){return r.matrix.inverse(this)};i.prototype.rotate=function(e,t,n){if(typeof e!=="number"||isNaN(e))e=0;if((typeof t!=="number"||isNaN(t))&&(typeof n!=="number"||isNaN(n))){n=e;e=0;t=0}if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;e=r.angles.deg2rad(e);t=r.angles.deg2rad(t);n=r.angles.deg2rad(n);var s=new i,o=new i,u=new i,a,f,l;n/=2;a=Math.sin(n);f=Math.cos(n);l=a*a;u.m11=u.m22=1-2*l;u.m12=u.m21=2*a*f;u.m21*=-1;t/=2;a=Math.sin(t);f=Math.cos(t);l=a*a;o.m11=o.m33=1-2*l;o.m13=o.m31=2*a*f;o.m13*=-1;e/=2;a=Math.sin(e);f=Math.cos(e);l=a*a;s.m22=s.m33=1-2*l;s.m23=s.m32=2*a*f;s.m32*=-1;var c=new i;var h=this.toString()===c.toString();var p=h?u.multiply(o).multiply(s):this.multiply(s).multiply(o).multiply(u);return p};i.prototype.rotateAxisAngle=function(e,t,n,s){if(typeof e!=="number"||isNaN(e))e=0;if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;if(typeof s!=="number"||isNaN(s))s=0;if(e===0&&t===0&&n===0)n=1;s=(r.angles.deg2rad(s)||0)/2;var o=new i,u=Math.sqrt(e*e+t*t+n*n),a=Math.cos(s),f=Math.sin(s),l=f*f,c=f*a,h=function(e){return parseFloat(e.toFixed(6))},p,d,v;if(u===0){e=0;t=0;n=1}else if(u!==1){e/=u;t/=u;n/=u}if(e===1&&t===0&&n===0){o.m22=o.m33=1-2*l;o.m23=o.m32=2*c;o.m32*=-1}else if(e===0&&t===1&&n===0){o.m11=o.m33=1-2*l;o.m13=o.m31=2*c;o.m13*=-1}else if(e===0&&t===0&&n===1){o.m11=o.m22=1-2*l;o.m12=o.m21=2*c;o.m21*=-1}else{p=e*e;d=t*t;v=n*n;o.m11=h(1-2*(d+v)*l);o.m12=h(2*(e*t*l+n*c));o.m13=h(2*(e*n*l-t*c));o.m21=h(2*(e*t*l-n*c));o.m22=h(1-2*(p+v)*l);o.m23=h(2*(t*n*l+e*c));o.m31=h(2*(e*n*l+t*c));o.m32=h(2*(t*n*l-e*c));o.m33=h(1-2*(p+d)*l)}return this.multiply(o)};i.prototype.scale=function(e,t,n){var r=new i;if(typeof e!=="number"||isNaN(e))e=1;if(typeof t!=="number"||isNaN(t))t=e;if(typeof n!=="number"||isNaN(n))n=1;r.m11=e;r.m22=t;r.m33=n;return this.multiply(r)};i.prototype.skewX=function(e){var t=r.angles.deg2rad(e);var n=new i;n.c=Math.tan(t);return this.multiply(n)};i.prototype.skewY=function(e){var t=r.angles.deg2rad(e);var n=new i;n.b=Math.tan(t);return this.multiply(n)};i.prototype.translate=function(e,t,n){var r=new i;if(typeof e!=="number"||isNaN(e))e=0;if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;r.m41=e;r.m42=t;r.m43=n;return this.multiply(r)};i.prototype.setMatrixValue=function(e){var t=d(e.trim());var n=r.transp.statementToObject(t);if(!n)return;var i=n.key===r.transp.matrixFn3d;var s=i?a:u;var o=n.value;var f=o.length;if(i&&f!==16||!(i||f===6))return;o.forEach(function(e,t){var n=s(t);this[n]=e.value},this)};i.prototype.toString=function(){var e,t;if(r.matrix.isAffine(this)){t=r.transp.matrixFn2d;e=s}else{t=r.transp.matrixFn3d;e=o}return t+"("+e.map(function(e){return this[e].toFixed(6)},this).join(", ")+")"};var f={matrix:function(e,t){var n=new i(t.unparsed);return e.multiply(n)},matrix3d:function(e,t){var n=new i(t.unparsed);return e.multiply(n)},perspective:function(e,t){var n=new i;n.m34-=1/t.value[0].value;return e.multiply(n)},rotate:function(e,t){return e.rotate.apply(e,t.value.map(l))},rotate3d:function(e,t){return e.rotateAxisAngle.apply(e,t.value.map(l))},rotateX:function(e,t){return e.rotate.apply(e,[t.value[0].value,0,0])},rotateY:function(e,t){return e.rotate.apply(e,[0,t.value[0].value,0])},rotateZ:function(e,t){return e.rotate.apply(e,[0,0,t.value[0].value])},scale:function(e,t){return e.scale.apply(e,t.value.map(l))},scale3d:function(e,t){return e.scale.apply(e,t.value.map(l))},scaleX:function(e,t){return e.scale.apply(e,t.value.map(l))},scaleY:function(e,t){return e.scale.apply(e,[0,t.value[0].value,0])},scaleZ:function(e,t){return e.scale.apply(e,[0,0,t.value[0].value])},skew:function(e,t){var n=new i("skewX("+t.value[0].unparsed+")");var r=new i("skewY("+(t.value[1]&&t.value[1].unparsed||0)+")");var s="matrix(1.00000, "+r.b+", "+n.c+", 1.000000, 0.000000, 0.000000)";var o=new i(s);return e.multiply(o)},skewX:function(e,t){return e.skewX.apply(e,[t.value[0].value])},skewY:function(e,t){return e.skewY.apply(e,[t.value[0].value])},translate:function(e,t){return e.translate.apply(e,t.value.map(l))},translate3d:function(e,t){return e.translate.apply(e,t.value.map(l))},translateX:function(e,t){return e.translate.apply(e,[t.value[0].value,0,0])},translateY:function(e,t){return e.translate.apply(e,[0,t.value[0].value,0])},translateZ:function(e,t){return e.translate.apply(e,[0,0,t.value[0].value])}};t.exports=i},{"./utils/angle":3,"./utils/matrix":4,"./utils/cssTransformString":5}],4:[function(e,t,n){function r(e,t,n,r){return e*r-t*n}function i(e,t,n,i,s,o,u,a,f){return e*r(s,o,a,f)-i*r(t,n,a,f)+u*r(t,n,s,o)}function s(e){var t=e,n=t.m11,r=t.m21,s=t.m31,o=t.m41,u=t.m12,a=t.m22,f=t.m32,l=t.m42,c=t.m13,h=t.m23,p=t.m33,d=t.m43,v=t.m14,m=t.m24,g=t.m34,y=t.m44;return n*i(a,h,m,f,p,g,l,d,y)-r*i(u,c,v,f,p,g,l,d,y)+s*i(u,c,v,a,h,m,l,d,y)-o*i(u,c,v,a,h,m,f,p,g)}function o(e){return e.m13===0&&e.m14===0&&e.m23===0&&e.m24===0&&e.m31===0&&e.m32===0&&e.m33===1&&e.m34===0&&e.m43===0&&e.m44===1}function u(e){var t=e;return t.m11===1&&t.m12===0&&t.m13===0&&t.m14===0&&t.m21===0&&t.m22===1&&t.m23===0&&t.m24===0&&t.m31===0&&t.m31===0&&t.m33===1&&t.m34===0&&t.m44===1}function a(e){var t=e,n=new e.constructor,r=t.m11,s=t.m12,o=t.m13,u=t.m14,a=t.m21,f=t.m22,l=t.m23,c=t.m24,h=t.m31,p=t.m32,d=t.m33,v=t.m34,m=t.m41,g=t.m42,y=t.m43,b=t.m44;n.m11=i(f,p,g,l,d,y,c,v,b);n.m21=-i(a,h,m,l,d,y,c,v,b);n.m31=i(a,h,m,f,p,g,c,v,b);n.m41=-i(a,h,m,f,p,g,l,d,y);n.m12=-i(s,p,g,o,d,y,u,v,b);n.m22=i(r,h,m,o,d,y,u,v,b);n.m32=-i(r,h,m,s,p,g,u,v,b);n.m42=i(r,h,m,s,p,g,o,d,y);n.m13=i(s,f,g,o,l,y,u,c,b);n.m23=-i(r,a,m,o,l,y,u,c,b);n.m33=i(r,a,m,s,f,g,u,c,b);n.m43=-i(r,a,m,s,f,g,o,l,y);n.m14=-i(s,f,p,o,l,d,u,c,v);n.m24=i(r,a,h,o,l,d,u,c,v);n.m34=-i(r,a,h,s,f,p,u,c,v);n.m44=i(r,a,h,s,f,p,o,l,d);return n}function f(e){var t;if(u(e)){t=new e.constructor;if(!(e.m41===0&&e.m42===0&&e.m43===0)){t.m41=-e.m41;t.m42=-e.m42;t.m43=-e.m43}return t}var n=a(e);var r=s(e);if(Math.abs(r)<1e-8)return null;for(var i=1;i<5;i++){for(var o=1;o<5;o++){n["m"+i+o]/=r}}return n}function l(e,t){if(!t)return null;var n=t,r=e,i=new e.constructor;i.m11=n.m11*r.m11+n.m12*r.m21+n.m13*r.m31+n.m14*r.m41;i.m12=n.m11*r.m12+n.m12*r.m22+n.m13*r.m32+n.m14*r.m42;i.m13=n.m11*r.m13+n.m12*r.m23+n.m13*r.m33+n.m14*r.m43;i.m14=n.m11*r.m14+n.m12*r.m24+n.m13*r.m34+n.m14*r.m44;i.m21=n.m21*r.m11+n.m22*r.m21+n.m23*r.m31+n.m24*r.m41;i.m22=n.m21*r.m12+n.m22*r.m22+n.m23*r.m32+n.m24*r.m42;i.m23=n.m21*r.m13+n.m22*r.m23+n.m23*r.m33+n.m24*r.m43;i.m24=n.m21*r.m14+n.m22*r.m24+n.m23*r.m34+n.m24*r.m44;i.m31=n.m31*r.m11+n.m32*r.m21+n.m33*r.m31+n.m34*r.m41;i.m32=n.m31*r.m12+n.m32*r.m22+n.m33*r.m32+n.m34*r.m42;i.m33=n.m31*r.m13+n.m32*r.m23+n.m33*r.m33+n.m34*r.m43;i.m34=n.m31*r.m14+n.m32*r.m24+n.m33*r.m34+n.m34*r.m44;i.m41=n.m41*r.m11+n.m42*r.m21+n.m43*r.m31+n.m44*r.m41;i.m42=n.m41*r.m12+n.m42*r.m22+n.m43*r.m32+n.m44*r.m42;i.m43=n.m41*r.m13+n.m42*r.m23+n.m43*r.m33+n.m44*r.m43;i.m44=n.m41*r.m14+n.m42*r.m24+n.m43*r.m34+n.m44*r.m44;return i}function c(e){var t=new e.constructor;var n=4,r=4;var i=r,s;while(i){s=n;while(s){t["m"+i+s]=e["m"+s+i];s--}i--}return t}t.exports={determinant2x2:r,determinant3x3:i,determinant4x4:s,isAffine:o,isIdentityOrTranslation:u,adjoint:a,inverse:f,multiply:l}},{}],3:[function(e,t,n){function r(e){return e*Math.PI/180}function i(e){return e*(180/Math.PI)}function s(e){return e/(400/360)}t.exports={deg2rad:r,rad2deg:i,grad2deg:s}},{}],5:[function(e,t,n){function r(e){var t=/([\-\+]?[0-9]+[\.0-9]*)(deg|rad|grad|px|%)*/;var n=e.match(t)||[];return{value:parseFloat(n[1]),units:n[2],unparsed:e}}function i(e,t){var n=/(\w+)\(([^\)]+)\)/i;var i=e.toString().match(n).slice(1);var s=i[0];var o=i[1].split(/, ?/);var u=!t&&o.map(r);return{key:s,value:u||o,unparsed:e}}function s(e){var t=/(\w+)\([^\)]+\)/ig;var n=e.match(t)||[];return n}t.exports={matrixFn2d:"matrix",matrixFn3d:"matrix3d",valueToObject:r,statementToObject:i,stringToStatements:s}},{}]},{},[1])(1)});
            },
            "16": function(require, module, exports) {
                var _ = require('5'),

                	_props = require('12'),

                	WebMatrix = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : require('13'),

                	Matrix = require('3'),

                	Obj = require('17');

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
            "12": function(require, module, exports) {
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
            "15": function(require, module, exports) {
                var _ = require('5'),

                	Elem = require('16'),
                	Obj = require('17');

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

                	Animator = require('8'),

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
