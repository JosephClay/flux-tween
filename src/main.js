var _ = require('./support/utils'),
	_props = require('./styles/props'),
	_check = require('./support/supports'),
	_animatables = require('./styles/animatables'),

	Matrix = require('./Matrix'),
	EventEmitter = require('./EventEmitter'),
	Fallback = require('./animation/Fallback'),
	WebMatrix = require('./polyfills/WebMatrix'),
	Animation = require('./animation/Animation');

var _addClass = function(elem, className) {
		return elem.classList.add(className);
	},
	_removeClass = function(elem, className) {
		elem.classList.remove(className);
	},
	_applyShorthand = function(obj) {
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
			matrix = new Matrix(view.getComputedMatrix()),
			key;
		while (idx--) {
			key = _animatables.matrix[idx];
			obj[key]  = matrix[key];
		}
		return obj;
	},
	_getCurrentCssProperties = function(view) {
		var obj = {},
			styles = view.getComputedStyle(),
			key;
		for (key in _animatables.css) {
			obj[key] = styles[key];
		}

		return obj;
	};

var Element = function(elem, props) {
	EventEmitter.call(this);

	this.elem = elem;
	this.style = this.elem.style;
	this.properties = props || {};

	this._matrix = new Matrix(new WebMatrix(this.elem.style[_props.transform]));
	this._bindEnd();
};

_.extend(Element.prototype, EventEmitter.prototype, {
	_bindEnd: function() {
		var self = this;
		this.elem.addEventListener(_props.animationEvent, function() {
			self.emit('end');
		}, false);
	},

	addClass: function(className) {
		_addClass(this.elem, className);
	},

	removeClass: function(className) {
		_removeClass(this.elem, className);
	},

	animate: function(args, callback) {
		_applyShorthand(this.properties);
		_applyShorthand(args.properties);

		this.properties = _ensureProperties(this, this.properties, args.properties);

		var animation = (_check.canHwAccel) ? new Animation(this, args) : new Fallback(this, args);
		animation.start(callback);
		return animation;
	},

	setMatrix: function(matrix) {
		this._matrix = matrix;
		this.style[_props.transform] = this._matrix.css();
	},
	
	getComputedMatrix: function() {
		return new WebMatrix(this.getComputedStyle()[_props.transform]);
	},

	getComputedStyle: function() {
		return document.defaultView.getComputedStyle(this.elem);
	}
});

window.Anim = Element;