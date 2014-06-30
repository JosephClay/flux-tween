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
				(new Matrix(
					// reuse the computed matrix if we can
					_getComputedMatrix(computedStyles || _getComputedStyle(this._elem))
				)).toObject()
			);
		}
	}
};

module.exports = Elem;