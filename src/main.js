var _ = require('./support/utils'),
	_props = require('./styles/props'),
	_check = require('./support/supports'),
	_animatables = require('./styles/animatables'),

	Matrix = require('./Matrix'),
	EventEmitter = require('./EventEmitter'),
	Fallback = require('./animation/Fallback'),
	WebMatrix = require('./polyfills/WebMatrix'),
	Animation = require('./animation/Animation');

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