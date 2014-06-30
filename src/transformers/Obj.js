var _ = require('../utils'),
	
	_matrixAnimatables = require('../styles/matrix-animatables'),
	
	Matrix = require('../Matrix'),

	_expandShorthand = function(obj) {

		if (obj.scale !== undefined) {

			obj.scaleX = obj.scale;
			obj.scaleY = obj.scale;
			delete obj.scale;

		}

		if (obj.rotation !== undefined) {

			obj.rotationZ = to.rotation;
			delete obj.rotation;

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