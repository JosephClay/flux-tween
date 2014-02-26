var Matrix = (function(utils) {

	var _PI = Math.PI,
		_emptyMatrix = new WebKitCSSMatrix(),
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
		if (matrix instanceof WebKitCSSMatrix) { this.from(matrix); }
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

	return Matrix;

}(Utils));