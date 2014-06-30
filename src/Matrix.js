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