var PI_180 = Math.PI * 180,

	WebMatrix = require('xcssmatrix'),

	emptyMatrix = new WebMatrix(),

	decomposeWebMatrix = require('./decompose');

var Matrix = module.exports = function Matrix(matrix) {

	if (matrix instanceof WebMatrix) {

		// Webmatrix
		this.from(decomposeWebMatrix(matrix));

	}

};

Matrix.blank = function() {

	return {
		x: 0,
		y: 0,
		z: 0,
		scaleX: 1,
		scaleY: 1,
		scaleZ: 1,
		rotationX: 0,
		rotationY: 0,
		rotationZ: 0
	};

};

Matrix.prototype = {

	// Bit of bloat, but faster
	// setting of private vars than
	// defineProperty... this leaves us
	// with XCSSMATRIX being the biggest
	// slowdown when it comes to property
	// access.

	setX: function(value) {
		return (this._x = (value || 0));
	},

	setY: function(value) {
		return (this._y = (value || 0));
	},

	setZ: function(value) {
		return (this._z = (value || 0));
	},

	setScaleX: function(value) {
		return (this._scaleX = (value || 0));
	},

	setScaleY: function(value) {
		return (this._scaleY = (value || 0));
	},

	setScaleZ: function(value) {
		return (this._scaleZ = (value || 0));
	},

	setScale: function(value) {
		return (this._scaleX = this._scaleY = (value || 0));
	},

	setRotationX: function(value) {
		return (this._rotationX = (value || 0));
	},

	setRotationY: function(value) {
		return (this._rotationY = (value || 0));
	},

	setRotationZ: function(value) {
		return (this._rotationZ = (value || 0));
	},

	setRotation: function(value) {
		return (this.rotationZ = (value || 0));
	},

	transpose: function(obj) {

		if (!obj) { return; }

		for (var property in obj) {
			this[property] = obj[property];
		}

	},

	from: function(fromMatrix) {

		var matrix = this;
		matrix._x         = fromMatrix.translation.x;
		matrix._y         = fromMatrix.translation.y;
		matrix._z         = fromMatrix.translation.z;
		matrix._scaleX    = fromMatrix.scale.x;
		matrix._scaleY    = fromMatrix.scale.y;
		matrix._scaleZ    = fromMatrix.scale.z;
		matrix._rotationX = fromMatrix.rotation.x / PI_180;
		matrix._rotationY = fromMatrix.rotation.y / PI_180;
		matrix._rotationZ = fromMatrix.rotation.z / PI_180;

	},

	update: function() {

		var matrix = this,
			newMatrix = emptyMatrix;
		newMatrix = newMatrix.translate(matrix._x, matrix._y, matrix._z);
		newMatrix = newMatrix.rotate(matrix._rotationX, matrix._rotationY, matrix._rotationZ);
		newMatrix = newMatrix.scale(matrix._scaleX, matrix._scaleY, matrix._scaleZ);

		return newMatrix;

	},

	toObject: function() {

		var matrix = this,
			m = this._m || (this._m = {});
		m.x         = matrix._x;
		m.y         = matrix._y;
		m.z         = matrix._z;
		m.scaleX    = matrix._scaleX;
		m.scaleY    = matrix._scaleY;
		m.scaleZ    = matrix._scaleZ;
		m.rotationX = matrix._rotationX;
		m.rotationY = matrix._rotationY;
		m.rotationZ = matrix._rotationZ;

		return m;

	}

};