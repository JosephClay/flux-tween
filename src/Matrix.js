var WebMatrix = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : require('./polyfills/XCSSMatrix'),

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
	from: function(matrix) {

		this.x         = matrix.translation.x;
		this.y         = matrix.translation.y;
		this.z         = matrix.translation.z;
		this.scaleX    = matrix.scale.x;
		this.scaleY    = matrix.scale.y;
		this.scaleZ    = matrix.scale.z;
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

	},

	toObject: function() {

		return {
			x:         this.x,
			y:         this.y,
			z:         this.z,
			scaleX:    this.scaleX,
			scaleY:    this.scaleY,
			scaleZ:    this.scaleZ,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			rotationZ: this.rotationZ
		};

	}
};

Matrix.define = function(definition) {

	var property;
	for (property in definition) {

		Object.defineProperty(Matrix.prototype, property, definition[property]);

	}

};

Matrix.define({
	'x': {
		get: function() {
			return this._x || 0;
		},
		set: function(value) {
			return (this._x = (value || 0));
		}
	},

	'y': {
		get: function() {
			return this._y || 0;
		},
		set: function(value) {
			return (this._y = (value || 0));
		}
	},

	'z': {
		get: function() {
			return this._z || 0;
		},
		set: function(value) {
			return (this._z = (value || 0));
		}
	},

	'scaleX': {
		get: function() {
			return this._scaleX || 1;
		},
		set: function(value) {
			return (this._scaleX = (value || 0));
		}
	},

	'scaleY': {
		get: function() {
			return this._scaleY || 1;
		},
		set: function(value) {
			return (this._scaleY = (value || 0));
		}
	},

	'scaleZ': {
		get: function() {
			return this._scaleZ || 1;
		},
		set: function(value) {
			return (this._scaleZ = (value || 0));
		}
	},

	'scale': {
		get: function() {
			return (this._scaleX + this._scaleY) / 2.0;
		},
		set: function(value) {
			return (this._scaleX = this._scaleY = (value || 0));
		}
	},

	'rotationX': {
		get: function() {
			return this._rotationX || 0;
		},
		set: function(value) {
			return (this._rotationX = (value || 0));
		}
	},

	'rotationY': {
		get: function() {
			return (this._rotationY || 0);
		},
		set: function(value) {
			return (this._rotationY = (value || 0));
		}
	},

	'rotationZ': {
		get: function() {
			return this._rotationZ || 0;
		},
		set: function(value) {
			return (this._rotationZ = (value || 0));
		}
	},

	'rotation': {
		get: function() {
			return this.rotationZ;
		},
		set: function(value) {
			return (this.rotationZ = (value || 0));
		}
	}
});

module.exports = Matrix;