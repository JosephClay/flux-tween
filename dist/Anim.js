(function(window, document, undefined) {
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

        require(config.main);

    }(
        {
            "main": 1,
            "aliases": {}
        },
        {
            "1": function(require, module, exports) {
                var _ = require('11'),
                	_props = require('8'),
                	_check = require('10'),
                	_animatables = require('7'),

                	Matrix = require('3'),
                	EventEmitter = require('2'),
                	Fallback = require('5'),
                	WebMatrix = require('6'),
                	Animation = require('4');

                var _applyShorthand = function(obj) {
                		if (obj.scale) {
                			obj.scaleX = obj.scale;
                			obj.scaleY = obj.scale;
                		}
                		if (obj.rotation) {
                			obj.rotationZ = to.rotation;
                		}
                	},
                	_ensureProperties = function(view, from, to) {
                		var key,
                			missingMatrixValue,
                			missingCssValue;
                		for (key in to) {
                			// Both failed, no more tests
                			if (missingMatrixValue && missingCssValue) { break; }

                			// This to key exists in from, we're good
                			if (_.exists(from[key])) { continue; }

                			// It's a matrix value, flag and continue
                			if (_animatables.matrix.indexOf(key) > -1) { missingMatrixValue = true; continue; }

                			// It's a css value, flag and continue
                			if (key in _animatables.css) { missingCssValue = true; continue; }
                		}

                		if (missingMatrixValue) {
                			var matrixObj = _getCurrentMatrixProperties(view);
                			for (key in to) {
                				if (matrixObj[key] !== undefined) {
                					from[key] = matrixObj[key];
                				}
                			}
                		}

                		if (missingCssValue) {
                			var styles = _getCurrentCssProperties(view);
                			for (key in to) {
                				if (styles[key] !== undefined) {
                					from[key] = parseFloat(styles[key]);
                				}
                			}
                		}

                		return from;
                	},
                	_getCurrentMatrixProperties = function(view) {
                		var obj = {},
                			idx = _animatables.matrix.length,
                			matrix = new Matrix(view._getComputedMatrix()),
                			key;
                		while (idx--) {
                			key = _animatables.matrix[idx];
                			obj[key]  = matrix[key];
                		}
                		return obj;
                	},
                	_getCurrentCssProperties = function(view) {
                		var obj = {},
                			styles = view._getComputedStyle(),
                			key;
                		for (key in _animatables.css) {
                			obj[key] = styles[key];
                		}

                		return obj;
                	};

                var View = window.Anim = function(elem, props) {
                	if (!(this instanceof View)) { return new View(elem, props); }

                	EventEmitter.call(this);

                	this.elem = elem;
                	this.style = this.elem.style;
                	this.properties = props || {};

                	this._matrix = new Matrix(new WebMatrix(this.elem.style[_props.transform]));
                	this._bindEnd();
                };

                _.extend(View.prototype, EventEmitter.prototype, {
                	to: function(goTo) {
                		this._to = goTo;
                		return this;
                	},

                	_bindEnd: function() {
                		var self = this;
                		this.elem.addEventListener(_props.animationEvent, function() {
                			self.emit('end');
                		}, false);
                	},

                	addClass: function(className) {
                		this.elem.classList.add(className);
                	},

                	removeClass: function(className) {
                		this.elem.classList.remove(className);
                	},

                	getClass: function() {
                		return this._animation || '';
                	},

                	animate: function(goTo) {
                		goTo = goTo || this._to;

                		_applyShorthand(this.properties);
                		_applyShorthand(goTo.properties);

                		this.properties = _ensureProperties(this, this.properties, goTo.properties);

                		this._animation = (_check.canHwAccel) ? new Animation(this, goTo) : new Fallback(this, goTo);

                		return this;
                	},

                	start: function(callback) {
                		var anim = this._animation;
                		if (anim) { this._animation.start(callback); }
                		return this;
                	},

                	reverse: function(callback) {
                		var anim = this._animation;
                		if (anim) { this._animation.reverse(callback); }
                		return this;
                	},

                	stop: function() {
                		var anim = this._animation;
                		if (anim) { anim.stop(); }
                		return this;
                	},

                	_setMatrix: function(matrix) {
                		this._matrix = matrix;
                		this.style[_props.transform] = this._matrix.css();
                	},

                	_getComputedMatrix: function() {
                		return new WebMatrix(this._getComputedStyle()[_props.transform]);
                	},

                	_getComputedStyle: function() {
                		return document.defaultView.getComputedStyle(this.elem);
                	}
                });
            },
            "11": function(require, module, exports) {
                module.exports = {
                	exists: function(obj) {
                		return (obj !== null && obj !== undefined);
                	},

                	slice: (function(_ARR_PROTO) {
                		return function(arrlike) {
                			return _ARR_PROTO.slice.call(arrlike);
                		};
                	}(Array.prototype)),

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

                	round: function(value, decimals) {
                		var d = Math.pow(10, decimals);
                		return Math.round(value * d) / d;
                	}
                };
            },
            "8": function(require, module, exports) {
                var _tests = require('15');

                module.exports = {
                	animationEvent: _tests.keyVal({
                		'-webkit-animation': 'webkitAnimationEnd',
                		'-moz-animation': 'animationend',
                		'-o-animation': 'oAnimationEnd',
                		'-ms-animation': 'msAnimationEnd',
                		'animation': 'animationend'
                	}),

                	transform: _tests.prop([
                		'transform',
                		'msTransform',
                		'oTransform',
                		'mozTransform',
                		'webkitTransform'
                	]),

                	transformOrigin: _tests.prop([
                		'transformOrigin',
                		'msTransformOrigin',
                		'oTransformOrigin',
                		'mozTransformOrigin',
                		'webkitTransformOrigin'
                	]),
                };
            },
            "15": function(require, module, exports) {
                var _div = document.createElement('div');

                module.exports = {
                	keyVal: function(obj) {
                		var key;
                		for (key in obj) {
                			if (_div.style[key] !== undefined) {
                				return obj[key];
                			}
                		}

                		return '';
                	},

                	prop: function(arr) {
                		var idx = arr.length;
                		while (idx--) {
                			if (_div.style[arr[idx]] !== undefined) {
                				return arr[idx];
                			}
                		}

                		return '';
                	}
                };
            },
            "10": function(require, module, exports) {
                var _styles = require('9');

                module.exports = {
                	canHwAccel: (_styles.animationDuration && _styles.animationKeyFrame && _styles.animationName && _styles.animationTimingFunction),
                	canAnimate: !!_styles.transform
                };
            },
            "9": function(require, module, exports) {
                var _tests = require('15');

                module.exports = {
                	animationDuration: _tests.prop([
                		'animation-duration',
                		'-ms-animation-duration',
                		'-o-animation-duration',
                		'-moz-animation-duration',
                		'-webkit-animation-duration'
                	]),

                	animationName: _tests.prop([
                		'animation-name',
                		'-ms-animation-name',
                		'-o-animation-name',
                		'-moz-animation-name',
                		'-webkit-animation-name'
                	]),

                	animationKeyFrame: _tests.keyVal({
                		'-webkit-animation-name': '-webkit-keyframes',
                		'-moz-animation-name': '-moz-keyframes',
                		'-o-animation-name': '-o-keyframes',
                		'-ms-animation-name': '-ms-keyframes',
                		'animation-name': 'keyframes'
                	}),

                	animationTimingFunction: _tests.prop([
                		'animation-timing-function',
                		'-ms-animation-timing-function',
                		'-o-animation-timing-function',
                		'-moz-animation-timing-function',
                		'-webkit-animation-timing-function'
                	]),

                	animationFillMode: _tests.prop([
                		'animation-fill-mode',
                		'-ms-animation-fill-mode',
                		'-o-animation-fill-mode',
                		'-moz-animation-fill-mode',
                		'-webkit-animation-fill-mode'
                	]),

                	backfaceVisibility: _tests.prop([
                		'backface-visibility',
                		'-ms-backface-visibility',
                		'-o-backface-visibility',
                		'-moz-backface-visibility',
                		'-webkit-backface-visibility'
                	]),

                	transform: _tests.prop([
                		'transform',
                		'-ms-transform',
                		'-o-transform',
                		'-moz-transform',
                		'-webkit-transform'
                	])
                };
            },
            "7": function(require, module, exports) {
                module.exports = {
                	matrix: [
                		'x',
                		'y',
                		'z',
                		'scaleX',
                		'scaleY',
                		'scaleZ',
                		'rotationX',
                		'rotationY',
                		'rotationZ'
                	],

                	css: {
                		opacity: '',
                		width: 'px',
                		height: 'px'
                	}
                };
            },
            "3": function(require, module, exports) {
                var WebMatrix = require('6');

                var _PI = Math.PI,
                	_emptyMatrix = new WebMatrix(),
                	_decompose = function(m) {
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
                	if (matrix instanceof WebMatrix) { this.from(matrix); }
                };

                Matrix.prototype = {

                	from: function(matrix) {
                		matrix = _decompose(matrix);
                		this.x = matrix.translation.x;
                		this.y = matrix.translation.y;
                		this.scaleX = matrix.scale.x;
                		this.scaleY = matrix.scale.y;
                		this.scaleZ = matrix.scale.z;
                		this.rotationX = matrix.rotation.x / _PI * 180;
                		this.rotationY = matrix.rotation.y / _PI * 180;
                		this.rotationZ = matrix.rotation.z / _PI * 180;
                	},

                	set: function(view) {
                		return (view._matrix = this);
                	},

                	css: function() {
                		var matrix = _emptyMatrix;
                		matrix = matrix.translate(this._x, this._y, this._z);
                		matrix = matrix.rotate(this._rotationX, this._rotationY, this._rotationZ);
                		matrix = matrix.scale(this._scaleX, this._scaleY, this._scaleZ);
                		return matrix.toString();
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
                		return (this._x = value);
                	}
                });

                Matrix.define('y', {
                	get: function() {
                		return this._y || 0;
                	},
                	set: function(value) {
                		return (this._y = value);
                	}
                });

                Matrix.define('z', {
                	get: function() {
                		return this._z || 0;
                	},
                	set: function(value) {
                		return (this._z = value);
                	}
                });

                Matrix.define('scaleX', {
                	get: function() {
                		return this._scaleX || 1;
                	},
                	set: function(value) {
                		return (this._scaleX = value);
                	}
                });

                Matrix.define('scaleY', {
                	get: function() {
                		return this._scaleY || 1;
                	},
                	set: function(value) {
                		return (this._scaleY = value);
                	}
                });

                Matrix.define('scaleZ', {
                	get: function() {
                		return this._scaleZ || 1;
                	},
                	set: function(value) {
                		return (this._scaleZ = value);
                	}
                });

                Matrix.define('scale', {
                	get: function() {
                		return (this._scaleX + this._scaleY) / 2.0;
                	},
                	set: function(value) {
                		return (this._scaleX = this._scaleY = value);
                	}
                });

                Matrix.define('rotationX', {
                	get: function() {
                		return this._rotationX || 0;
                	},
                	set: function(value) {
                		return (this._rotationX = value);
                	}
                });

                Matrix.define('rotationY', {
                	get: function() {
                		return (this._rotationY || 0);
                	},
                	set: function(value) {
                		return (this._rotationY = value);
                	}
                });

                Matrix.define('rotationZ', {
                	get: function() {
                		return this._rotationZ || 0;
                	},
                	set: function(value) {
                		return (this._rotationZ = value);
                	}
                });

                Matrix.define('rotation', {
                	get: function() {
                		return this.rotationZ;
                	},
                	set: function(value) {
                		return (this.rotationZ = value);
                	}
                });

                module.exports = Matrix;
            },
            "6": function(require, module, exports) {
                module.exports = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : XCSSMatrix;
            },
            "2": function(require, module, exports) {
                var _ = require('11');

                var _eventCheck = function(event) {
                	if (event !== '') { return; }
                	console.error(event, 'Missing event type');
                };

                var EventEmitter = function() {
                	this.events = {};
                };

                EventEmitter.prototype = {
                	emit: function() {
                		var event = arguments[0],
                			args = arguments.length >= 2 ? _.slice(arguments) : [];

                		_eventCheck(event);

                		var reference = this.events[event];
                		if (!reference) { return; }

                		var results = [],
                			idx = 0, length = reference.length,
                			listener;
                		for (; idx < length; idx++) {
                			listener = reference[idx];
                			results.push(listener && listener.apply(null, args));
                		}

                		return results;
                	},

                	on: function(event, listener) {
                		_eventCheck(event);

                		var base = this.events[event] || (this.events[event] = []);

                		return this.events[event].push(listener);
                	},
                	addListener: function() {
                		this.on.apply(this, arguments);
                	},

                	off: function(event, listener) {
                		_eventCheck(event);
                		if (!this.events[event]) { return; }

                		var reference = this.events[event],
                			idx = reference.length;
                		while (idx--) {
                			if (reference[idx] === listener) {
                				reference.splice(idx, 1);
                			}
                		}
                	},
                	removeListener: function() {
                		this.off.apply(this, arguments);
                	},

                	once: function(event, listener) {
                		_eventCheck(event);

                		var self = this;
                		return this.on(event, function() {
                			self.off(event, fn);
                			return listener.apply(null, arguments);
                		});
                	},

                	removeAllListeners: function(event) {
                		_eventCheck(event);

                		if (!this.events[event]) { return; }

                		var reference = this.events[event],
                			idx = reference.length,
                			listener;
                		while (idx--) {
                			listener = reference[idx];
                			this.off(event, listener);
                		}
                	}
                };

                module.exports = EventEmitter;
            },
            "5": function(require, module, exports) {
                var _ = require('11'),
                	_props = require('8'),
                	_animatables = require('7'),

                	Matrix = require('3'),
                	Animation = require('4'),
                	EventEmitter = require('2'),
                	BezierCurve = require('13'),
                	SpringCurve = require('14');

                var _defaults = {
                		timeSpeedFactor: 1,
                		roundingDecimals: 5,
                		fps: 60
                	},
                	_PREFIX = 'animationjs-animation-',
                	_id = 0;

                var _animationKeys = function(obj) {
                	var keys = [],
                		key;
                	for (key in obj) {
                		keys.push(parseFloat(key));
                	}
                	return keys.sort(function(a, b) { return a - b; });
                };

                var Fallback = function(view, options) {
                	EventEmitter.call(this);

                	this.view = view;
                	this.callback = options.callback;
                	this.precision = options.precision || _defaults.fps;
                	this.origin = options.origin;
                	this.time = options.time || 1000;
                	this.curve = options.curve || 'linear';

                	this._to = options.properties;
                	this._from = view.properties;
                	this._id = (_id += 1);
                	this._animationName = _PREFIX + this._id;
                	this._currentProperties = {};
                	this._spring = options.spring;
                	this._ease = options.ease;
                	this._curve = this._parseCurve(options);
                	this._curveValues = this._curve.all();
                	this._totalTime = this._curve.time();

                	if (this.origin) { this.view.style[_props.transformOrigin] = this.origin; }
                };

                _.extend(Fallback.prototype, Animation.prototype, {

                	start: function() {
                		this._aggregateCurrentProperties();

                		var numOfChanges = this._omitUnchangedProperties();
                		if (!numOfChanges) { return; }

                		var keyframes = this._generateKeyframeCss();
                		this._animate(keyframes);
                	},

                	_animate: function(keyframes) {
                		var self = this,
                			animationKeys = _animationKeys(keyframes),
                			index = 0;

                		this._tween = new TWEEN.Tween({ key: animationKeys[0] })
                							.to({ key: animationKeys }, this._totalTime * 1000)
                							.onUpdate(function() {

                								var key = animationKeys[index];
                									keyframe = keyframes[key];
                								if (!keyframe) { return; }
                								self._applyKeyframeStyles(keyframe);

                								index += 1;
                							})
                							.onComplete(function() {
                								var lastIndex = animationKeys.length - 1,
                									key = animationKeys[lastIndex];
                									keyframe = keyframes[key];
                								self._applyKeyframeStyles(keyframe);

                								self._cleanup();
                							})
                							.interpolation(TWEEN.Interpolation.Linear)
                							.easing(TWEEN.Easing.Linear.None)
                							.start();
                	},

                	_applyKeyframeStyles: function(keyframe) {
                		self.view.style[_props.transform] = keyframe.transform;

                		var key;
                		for (key in keyframe.css) {
                			self.view.style[key] = keyframe.css[key];
                		}
                	},

                	_cleanup: function(completed) {
                		this._tween = null;
                		this.view.properties = this._to;

                		if (this.callback) { this.callback(this); }
                		return this.emit('end');
                	},

                	_generateKeyframeCss: function() {
                		var keyFrames = this._generateKeyframes(),
                			obj = {},
                			matrix = new Matrix();

                		var position, values, propertyName, unit, idx;
                		for (position in keyFrames) {
                			values = keyFrames[position];

                			var styles = {};

                			idx = _animatables.matrix.length;
                			while (idx--) {
                				propertyName = _animatables.matrix[idx];
                				matrix[propertyName] = values[propertyName];
                			}

                			styles.transform = matrix.css();

                			styles.css = {};
                			for (propertyName in _animatables.css) {
                				unit = _animatables.css[propertyName];
                				if (!_.exists(values[propertyName])) { continue; } // Avoid NaNs and nully values from working with undefined values
                				styles.css[propertyName] = (_.round(values[propertyName], _defaults.roundingDecimals)) + unit;
                			}

                			obj[position] = styles;
                		}

                		return obj;
                	},

                	_parseCurve: function(config) {
                		var factor = _defaults.timeSpeedFactor,
                			precision = this.precision * factor,
                			time = this.time * factor;

                		if (config.spring) {
                			var spring = config.spring;
                			return SpringCurve.create(spring.tension, spring.friction, spring.velocity, precision);
                		}

                		if (config.curve) {
                			var curve = config.curve;
                			if (curve === 'linear') {

                				return BezierCurve.create(BezierCurve.Linear, this.precision, time);

                			} else if (curve === 'ease') {

                				return BezierCurve.create(BezierCurve.Ease, this.precision, time);

                			} else if (curve === 'ease-in') {

                				return BezierCurve.create(BezierCurve.EaseIn, this.precision, time);

                			} else if (curve === 'ease-out') {

                				return BezierCurve.create(BezierCurve.EaseOut, this.precision, time);

                			} else if (curve === 'ease-in-out') {

                				return BezierCurve.create(BezierCurve.EaseInOut, this.precision, time);

                			}
                		}

                		return BezierCurve.create(BezierCurve.Linear, this.precision, this.time);
                	}
                });

                module.exports = Fallback;
            },
            "4": function(require, module, exports) {
                var _ = require('11'),
                	_head = require('12'),
                	_props = require('8'),
                	_styles = require('9'),
                	_animatables = require('7'),

                	Matrix = require('3'),
                	EventEmitter = require('2'),
                	BezierCurve = require('13'),
                	SpringCurve = require('14');

                var _defaults = {
                		timeSpeedFactor: 1,
                		roundingDecimals: 5,
                		fps: 60
                	},
                	_PREFIX = 'animjs-animation-',
                	_id = 0;

                var Animation = function(view, options) {
                	EventEmitter.call(this);

                	this.view = view;
                	this.callback = options.callback;
                	this.precision = options.precision || _defaults.fps;
                	this.origin = options.origin;
                	this.time = options.time || 1000;
                	this.curve = options.curve || 'linear';

                	this._isRunning = false;
                	this._to = options.properties;
                	this._from = view.properties;
                	this._id = (_id += 1);
                	this._cleanup = this._cleanup.bind(this);
                	this._animationName = _PREFIX + this._id;
                	this._currentProperties = {};
                	this._spring = options.spring;
                	this._ease = options.ease;
                	this._curveValues = this._parseCurve(options);
                	this._totalTime = (this._curveValues.length / this.precision) * 1000;

                	if (this.origin) { this.view.style[_props.transformOrigin] = this.origin; }
                };

                _.extend(Animation.prototype, EventEmitter.prototype, {

                	start: function(callback) {
                		if (this._isRunning) { return; }
                		this._isRunning = true;

                		this.callback = callback || this.callback;

                		this._aggregateCurrentProperties();

                		var numOfChanges = this._omitUnchangedProperties();
                		if (!numOfChanges) { return; }

                		this._styleTag = _head.addStyle(
                			this._generateKeyframeCss() + ' .' + this._animationName + ' { ' +
                				_styles.animationDuration + ': ' + (this._totalTime / 1000) + 's;' +
                				_styles.animationName + ': ' + this._animationName + ';' +
                				_styles.animationTimingFunction + ': linear;' +
                				_styles.animationFillMode + ': both;' +
                				_styles.backfaceVisibility + ': visible;' +
                			'}'
                		);

                		this.view.addClass(this._animationName);
                		this.view.on('end', this._cleanup);
                	},

                	_aggregateCurrentProperties: function() {
                		var to = this._to,
                			idx = _animatables.matrix.length,
                			key;
                		while (idx--) {
                			key = _animatables.matrix[idx];
                			if (!_.exists(to[key])) { continue; } // If we're not going to it, skip
                			this._currentProperties[key] = to[key];
                		}
                		for (key in _animatables.css) {
                			if (!_.exists(to[key])) { continue; } // If we're not going to it, skip
                			this._currentProperties[key] = to[key];
                		}
                	},

                	_omitUnchangedProperties: function() {
                		var propertyCount = 0,
                			key;
                		for (key in this._currentProperties) {
                			// No change, we don't care about it
                			if (this._from[key] === this._currentProperties[key]) {
                				delete this._currentProperties[key];
                				continue;
                			}

                			propertyCount += 1;
                		}

                		return propertyCount;
                	},

                	reverse: function(callback) {
                		var animation = new Animation(this.view, {
                			properties: this._from,
                			callback: callback || this.callback,
                			precision: this.precision,
                			origin: this.origin,
                			time: this.time,
                			curve: this.curve,
                			spring: this._spring,
                			ease: this._ease
                		});
                		animation.start(callback);
                		return animation;
                	},

                	stop: function() {
                		return this._cleanup();
                	},

                	_cleanup: function(completed) {
                		this._isRunning = false;
                		this.view.off('end', this._cleanup);

                		var computedStyles = this.view._getComputedStyle(),
                			endStyles = {},
                			key;
                		for (key in _animatables.css) {
                			endStyles[key] = computedStyles[key];
                		}

                		this.view._setMatrix(new Matrix(this.view._getComputedMatrix()));
                		this.view.style = _.extend(this.view.style, endStyles);

                		this.view.removeClass(this._animationName);
                		_head.removeStyle(this._styleTag);
                		this._styleTag = null;

                		this.view.properties = this._to;

                		if (this.callback) { this.callback(this); }
                		return this.emit('end');
                	},

                	_generateKeyframeCss: function() {
                		var keyFrames = this._generateKeyframes(),
                			arr = [],
                			matrix = new Matrix();

                		arr.push('@'+ _styles.animationKeyFrame +' ' + this._animationName + ' {');

                		var position, values, propertyName, unit, idx;
                		for (position in keyFrames) {
                			values = keyFrames[position];

                			arr.push(position + '% {');
                			arr.push(_styles.transform + ': ');

                			idx = _animatables.matrix.length;
                			while (idx--) {
                				propertyName = _animatables.matrix[idx];
                				matrix[propertyName] = values[propertyName];
                			}

                			arr.push(matrix.css() + '; ');

                			for (propertyName in _animatables.css) {
                				unit = _animatables.css[propertyName];
                				if (!_.exists(values[propertyName])) { continue; } // Avoid NaNs and nully values from working with undefined values
                				arr.push(propertyName + ':' + (_.round(values[propertyName], _defaults.roundingDecimals)) + unit + '; ');
                			}

                			arr.push('}');
                		}
                		arr.push('}');
                		return arr.join('');
                	},

                	_generateKeyframes: function() {
                		var stepIncrement = 0,
                			curveValues = this._curveValues,
                			stepDelta = 100 / (curveValues.length - 1),
                			deltas = this._deltas(),
                			keyFrames = {},
                			idx = 0, length = curveValues.length;

                		for (; idx < length; idx++) {
                			var curveValue = curveValues[idx],
                				position = _.round(stepIncrement * stepDelta, _defaults.roundingDecimals),
                				currentKeyFrame = {};

                			var propertyName;
                			for (propertyName in this._currentProperties) {
                				currentKeyFrame[propertyName] = curveValue * deltas[propertyName] + this._from[propertyName];
                			}

                			keyFrames[position] = currentKeyFrame;
                			stepIncrement++;
                		}

                		return keyFrames;
                	},

                	_deltas: function() {
                		var deltas = {},
                			key;
                		for (key in this._currentProperties) {
                			deltas[key] = (this._currentProperties[key] - this._from[key]) / 100.0;
                		}
                		return deltas;
                	},

                	_parseCurve: function(config) {
                		var factor = _defaults.timeSpeedFactor,
                			precision = this.precision * factor,
                			time = this.time * factor;

                		if (config.spring) {
                			var spring = config.spring;
                			return SpringCurve.generate(spring.tension, spring.friction, spring.velocity, precision);
                		}

                		if (config.curve) {
                			// TODO: Optimize
                			var curve = config.curve;
                			if (curve === 'linear') {

                				return BezierCurve.generate(BezierCurve.Linear, this.precision, time);

                			} else if (curve === 'ease') {

                				return BezierCurve.generate(BezierCurve.Ease, this.precision, time);

                			} else if (curve === 'ease-in') {

                				return BezierCurve.generate(BezierCurve.EaseIn, this.precision, time);

                			} else if (curve === 'ease-out') {

                				return BezierCurve.generate(BezierCurve.EaseOut, this.precision, time);

                			} else if (curve === 'ease-in-out') {

                				return BezierCurve.generate(BezierCurve.EaseInOut, this.precision, time);

                			}
                		}

                		return BezierCurve.generate(BezierCurve.Linear, this.precision, this.time);
                	}
                });

                module.exports = Animation;
            },
            "12": function(require, module, exports) {
                var _head = document.head;

                module.exports = {
                	addStyle: function(css) {
                		var styleSheet = document.createElement('style');
                		styleSheet.innerHTML = css;
                		return _head.appendChild(styleSheet);
                	},
                	removeStyle: function(style) {
                		if (style) { _head.removeChild(style); }
                	}
                };
            },
            "13": function(require, module, exports) {
                var _ = require('11');

                var _EPSILON = 1e-6;

                var UnitBezier = function(p1x, p1y, p2x, p2y) {
                	this.cx = 3.0 * p1x;
                	this.bx = 3.0 * (p2x - p1x) - this.cx;
                	this.ax = 1.0 - this.cx - this.bx;
                	this.cy = 3.0 * p1y;
                	this.by = 3.0 * (p2y - p1y) - this.cy;
                	this.ay = 1.0 - this.cy - this.by;
                };

                UnitBezier.prototype = {

                	_sampleCurveX: function(t) {
                		return ((this.ax * t + this.bx) * t + this.cx) * t;
                	},

                	_sampleCurveY: function(t) {
                		return ((this.ay * t + this.by) * t + this.cy) * t;
                	},

                	sampleCurveDerivativeX: function(t) {
                		return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
                	},

                	_solveCurveX: function(x) {
                		var t2 = x,
                			idx = 0,
                			x2, d2;
                		while (idx < 8) {
                			x2 = this._sampleCurveX(t2) - x;
                			if (Math.abs(x2) < _EPSILON) { return t2; }

                			d2 = this.sampleCurveDerivativeX(t2);
                			if (Math.abs(d2) < _EPSILON) { break; }

                			t2 = t2 - x2 / d2;
                			idx++;
                		}

                		var t0 = 0.0,
                			t1 = 1.0;

                		t2 = x;
                		if (t2 < t0) { return t0; }
                		if (t2 > t1) { return t1; }

                		while (t0 < t1) {
                			x2 = this._sampleCurveX(t2);
                			if (Math.abs(x2 - x) < _EPSILON) { return t2; }

                			if (x > x2) {
                				t0 = t2;
                			} else {
                				t1 = t2;
                			}
                			t2 = (t1 - t0) * 0.5 + t0;
                		}
                		return t2;
                	},

                	solve: function(x) {
                		return this._sampleCurveY(this._solveCurveX(x));
                	}
                };

                var Bezier = function(a, b, c, d, time, fps) {
                	this._curve = new UnitBezier(a, b, c, d);
                	this._values = [];
                	this._time = time;
                	this._fps = fps;
                };

                _.extend(Bezier, {
                	Linear: function(time, fps) {
                		return new Bezier(0, 0, 1, 1, time, fps);
                	},

                	Ease: function(time, fps) {
                		return new Bezier(0.25, 0.1, 0.25, 1, time, fps);
                	},

                	EaseIn: function(time, fps) {
                		return new Bezier(0.42, 0, 1, 1, time, fps);
                	},

                	EaseOut: function(time, fps) {
                		return new Bezier(0, 0, 0.58, 1, time, fps);
                	},

                	EaseInOut: function(time, fps) {
                		return new Bezier(0.42, 0, 0.58, 1, time, fps);
                	},

                	create: function(Constructor, time, fps) {
                		return new Constructor(time, fps);
                	},

                	generate: function(Constructor, time, fps) {
                		var curve = new Constructor(time, fps);
                		return curve.all();
                	}
                });

                Bezier.prototype = {
                	all: function() {
                		var steps = ((this._time / 1000) * this._fps) - 1;
                		if (steps > 3000) { throw 'Bezier: too many values'; }

                		var step, idx;
                		for (step = idx = 0; 0 <= steps ? idx <= steps : idx >= steps; step = 0 <= steps ? ++idx : --idx) {
                			this._values.push(this._curve.solve(step / steps) * 100);
                		}

                		return this._values;
                	},

                	time: function() {
                		return this._time;
                	}
                };

                module.exports = Bezier;
            },
            "14": function(require, module, exports) {
                var _ = require('11');

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
            }
        }
    ));
}(window, document));
