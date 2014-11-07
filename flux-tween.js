!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.flux=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Tween     = require('./animators/FluxTween'),
    Spring    = require('./animators/FluxSpring'),
    transform = require('./transform-prop');

var flux = {
	transform: transform,

	tween: function(obj) {

        return Tween.create(obj);

    },
	spring: function(obj) {

        return Spring.create(obj);

    },

	easing: require('./easing'),

	update: require('./loop').update,

    applyMatrix: function(obj, tween) {
        var elem = tween.elem,
            matrix = tween.matrix;

        if (!elem || !matrix) { return; }

        elem.style[transform] = matrix.toString();
    },

    plugin: function(name, fn) {

        Tween.prototype[name] = Spring.prototype[name] = function() {

            fn.apply(this, arguments);
            return this;

        };

        return flux;

    }
};

module.exports = flux;
},{"./animators/FluxSpring":10,"./animators/FluxTween":11,"./easing":14,"./loop":17,"./transform-prop":20}],2:[function(require,module,exports){
var XCSSMatrix = require('./lib/XCSSMatrix.js');
module.exports = XCSSMatrix;

},{"./lib/XCSSMatrix.js":4}],3:[function(require,module,exports){
var vector = require('./utils/vector');
module.exports = Vector4;

/**
 * A 4 dimensional vector
 * @author Joe Lambert
 * @constructor
 */
function Vector4(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  this.checkValues();
}

/**
 * Ensure that values are not undefined
 * @author Joe Lambert
 * @returns null
 */

Vector4.prototype.checkValues = function() {
  this.x = this.x || 0;
  this.y = this.y || 0;
  this.z = this.z || 0;
  this.w = this.w || 0;
};

/**
 * Get the length of the vector
 * @author Joe Lambert
 * @returns {float}
 */

Vector4.prototype.length = function() {
  this.checkValues();
  return vector.length(this);
};


/**
 * Get a normalised representation of the vector
 * @author Joe Lambert
 * @returns {Vector4}
 */

Vector4.prototype.normalize = function() {
	return vector.normalize(this);
};


/**
 * Vector Dot-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {float} The Dot-Product of this and v.
 */

Vector4.prototype.dot = function(v) {
  return vector.dot(this, v);
};


/**
 * Vector Cross-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {Vector4} The Cross-Product of this and v.
 */

Vector4.prototype.cross = function(v) {
  return vector.cross(this, v);
};


/**
 * Helper function required for matrix decomposition
 * A Javascript implementation of pseudo code available from http://www.w3.org/TR/css3-2d-transforms/#matrix-decomposition
 * @param {Vector4} aPoint A 3D point
 * @param {float} ascl
 * @param {float} bscl
 * @author Joe Lambert
 * @returns {Vector4}
 */

Vector4.prototype.combine = function(bPoint, ascl, bscl) {
  return vector.combine(this, bPoint, ascl, bscl);
};

Vector4.prototype.multiplyByMatrix = function (matrix) {
  return vector.multiplyByMatrix(this, matrix);
};

},{"./utils/vector":8}],4:[function(require,module,exports){
var utils = {
    angles: require('./utils/angle'),
    matrix: require('./utils/matrix'),
    transp: require('./utils/cssTransformString'),
    funcs: {
        // Given a function `fn`, return a function which calls `fn` with only 1
        //   argument, no matter how many are given.
        // Most useful where you only want the first value from a map/foreach/etc
        onlyFirstArg: function (fn, context) {
            context = context || this;

            return function (first) {
                return fn.call(context, first);
            };
        }
    }
};


/**
 *  Given a CSS transform string (like `rotate(3rad)`, or
 *    `matrix(1, 0, 0, 0, 1, 0)`), return an instance compatible with
 *    [`WebKitCSSMatrix`](http://developer.apple.com/library/safari/documentation/AudioVideo/Reference/WebKitCSSMatrixClassReference/WebKitCSSMatrix/WebKitCSSMatrix.html)
 *  @constructor
 *  @param {string} domstr - a string representation of a 2D or 3D transform matrix
 *    in the form given by the CSS transform property, i.e. just like the
 *    output from [[@link#toString]].
 *  @member {number} a - The first 2D vector value.
 *  @member {number} b - The second 2D vector value.
 *  @member {number} c - The third 2D vector value.
 *  @member {number} d - The fourth 2D vector value.
 *  @member {number} e - The fifth 2D vector value.
 *  @member {number} f - The sixth 2D vector value.
 *  @member {number} m11 - The 3D matrix value in the first row and first column.
 *  @member {number} m12 - The 3D matrix value in the first row and second column.
 *  @member {number} m13 - The 3D matrix value in the first row and third column.
 *  @member {number} m14 - The 3D matrix value in the first row and fourth column.
 *  @member {number} m21 - The 3D matrix value in the second row and first column.
 *  @member {number} m22 - The 3D matrix value in the second row and second column.
 *  @member {number} m23 - The 3D matrix value in the second row and third column.
 *  @member {number} m24 - The 3D matrix value in the second row and fourth column.
 *  @member {number} m31 - The 3D matrix value in the third row and first column.
 *  @member {number} m32 - The 3D matrix value in the third row and second column.
 *  @member {number} m33 - The 3D matrix value in the third row and third column.
 *  @member {number} m34 - The 3D matrix value in the third row and fourth column.
 *  @member {number} m41 - The 3D matrix value in the fourth row and first column.
 *  @member {number} m42 - The 3D matrix value in the fourth row and second column.
 *  @member {number} m43 - The 3D matrix value in the fourth row and third column.
 *  @member {number} m44 - The 3D matrix value in the fourth row and fourth column.
 *  @returns {XCSSMatrix} matrix
 */
function XCSSMatrix(domstr) {
    this.m11 = this.m22 = this.m33 = this.m44 = 1;

               this.m12 = this.m13 = this.m14 =
    this.m21 =            this.m23 = this.m24 =
    this.m31 = this.m32 =            this.m34 =
    this.m41 = this.m42 = this.m43            = 0;

    if (typeof domstr === 'string') {
        this.setMatrixValue(domstr);
    }
}

/**
 *  XCSSMatrix.displayName = 'XCSSMatrix'
 */
XCSSMatrix.displayName = 'XCSSMatrix';

var points2d = ['a', 'b', 'c', 'd', 'e', 'f'];
var points3d = [
    'm11', 'm12', 'm13', 'm14',
    'm21', 'm22', 'm23', 'm24',
    'm31', 'm32', 'm33', 'm34',
    'm41', 'm42', 'm43', 'm44'
];

([
    ['m11', 'a'],
    ['m12', 'b'],
    ['m21', 'c'],
    ['m22', 'd'],
    ['m41', 'e'],
    ['m42', 'f']
]).forEach(function (pair) {
    var key3d = pair[0], key2d = pair[1];

    Object.defineProperty(XCSSMatrix.prototype, key2d, {
        set: function (val) {
            this[key3d] = val;
        },

        get: function () {
            return this[key3d];
        },
        enumerable : true,
        configurable : true
    });
});


/**
 *  Multiply one matrix by another
 *  @method
 *  @member
 *  @param {XCSSMatrix} otherMatrix - The matrix to multiply this one by.
 */
XCSSMatrix.prototype.multiply = function (otherMatrix) {
    return utils.matrix.multiply(this, otherMatrix);
};

/**
 *  If the matrix is invertible, returns its inverse, otherwise returns null.
 *  @method
 *  @member
 *  @returns {XCSSMatrix|null}
 */
XCSSMatrix.prototype.inverse = function () {
    return utils.matrix.inverse(this);
};

/**
 *  Returns the result of rotating the matrix by a given vector.
 *
 *  If only the first argument is provided, the matrix is only rotated about
 *  the z axis.
 *  @method
 *  @member
 *  @param {number} rotX - The rotation around the x axis.
 *  @param {number} rotY - The rotation around the y axis. If undefined, the x component is used.
 *  @param {number} rotZ - The rotation around the z axis. If undefined, the x component is used.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.rotate = function (rx, ry, rz) {

    if (typeof rx !== 'number' || isNaN(rx)) rx = 0;

    if ((typeof ry !== 'number' || isNaN(ry)) &&
        (typeof rz !== 'number' || isNaN(rz))) {
        rz = rx;
        rx = 0;
        ry = 0;
    }

    if (typeof ry !== 'number' || isNaN(ry)) ry = 0;
    if (typeof rz !== 'number' || isNaN(rz)) rz = 0;

    rx = utils.angles.deg2rad(rx);
    ry = utils.angles.deg2rad(ry);
    rz = utils.angles.deg2rad(rz);

    var tx = new XCSSMatrix(),
        ty = new XCSSMatrix(),
        tz = new XCSSMatrix(),
        sinA, cosA, sq;

    rz /= 2;
    sinA  = Math.sin(rz);
    cosA  = Math.cos(rz);
    sq = sinA * sinA;

    // Matrices are identity outside the assigned values
    tz.m11 = tz.m22 = 1 - 2 * sq;
    tz.m12 = tz.m21 = 2 * sinA * cosA;
    tz.m21 *= -1;

    ry /= 2;
    sinA  = Math.sin(ry);
    cosA  = Math.cos(ry);
    sq = sinA * sinA;

    ty.m11 = ty.m33 = 1 - 2 * sq;
    ty.m13 = ty.m31 = 2 * sinA * cosA;
    ty.m13 *= -1;

    rx /= 2;
    sinA = Math.sin(rx);
    cosA = Math.cos(rx);
    sq = sinA * sinA;

    tx.m22 = tx.m33 = 1 - 2 * sq;
    tx.m23 = tx.m32 = 2 * sinA * cosA;
    tx.m32 *= -1;

    var identityMatrix = new XCSSMatrix(); // returns identity matrix by default
    var isIdentity     = this.toString() === identityMatrix.toString();
    var rotatedMatrix  = isIdentity ?
            tz.multiply(ty).multiply(tx) :
            this.multiply(tx).multiply(ty).multiply(tz);

    return rotatedMatrix;
};

/**
 *  Returns the result of rotating the matrix around a given vector by a given
 *  angle.
 *
 *  If the given vector is the origin vector then the matrix is rotated by the
 *  given angle around the z axis.
 *  @method
 *  @member
 *  @param {number} rotX - The rotation around the x axis.
 *  @param {number} rotY - The rotation around the y axis. If undefined, the x component is used.
 *  @param {number} rotZ - The rotation around the z axis. If undefined, the x component is used.
 *  @param {number} angle - The angle of rotation about the axis vector, in degrees.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.rotateAxisAngle = function (x, y, z, a) {
    if (typeof x !== 'number' || isNaN(x)) x = 0;
    if (typeof y !== 'number' || isNaN(y)) y = 0;
    if (typeof z !== 'number' || isNaN(z)) z = 0;
    if (typeof a !== 'number' || isNaN(a)) a = 0;
    if (x === 0 && y === 0 && z === 0) z = 1;
    a = (utils.angles.deg2rad(a) || 0) / 2;
    var t         = new XCSSMatrix(),
        len       = Math.sqrt(x * x + y * y + z * z),
        cosA      = Math.cos(a),
        sinA      = Math.sin(a),
        sq        = sinA * sinA,
        sc        = sinA * cosA,
        precision = function(v) { return parseFloat((v).toFixed(6)); },
        x2, y2, z2;

    // Bad vector, use something sensible
    if (len === 0) {
        x = 0;
        y = 0;
        z = 1;
    } else if (len !== 1) {
        x /= len;
        y /= len;
        z /= len;
    }

    // Optimise cases where axis is along major axis
    if (x === 1 && y === 0 && z === 0) {
        t.m22 = t.m33 = 1 - 2 * sq;
        t.m23 = t.m32 = 2 * sc;
        t.m32 *= -1;
    } else if (x === 0 && y === 1 && z === 0) {
        t.m11 = t.m33 = 1 - 2 * sq;
        t.m13 = t.m31 = 2 * sc;
        t.m13 *= -1;
    } else if (x === 0 && y === 0 && z === 1) {
        t.m11 = t.m22 = 1 - 2 * sq;
        t.m12 = t.m21 = 2 * sc;
        t.m21 *= -1;
    } else {
        x2  = x * x;
        y2  = y * y;
        z2  = z * z;
        // http://dev.w3.org/csswg/css-transforms/#mathematical-description
        t.m11 = precision(1 - 2 * (y2 + z2) * sq);
        t.m12 = precision(2 * (x * y * sq + z * sc));
        t.m13 = precision(2 * (x * z * sq - y * sc));
        t.m21 = precision(2 * (x * y * sq - z * sc));
        t.m22 = precision(1 - 2 * (x2 + z2) * sq);
        t.m23 = precision(2 * (y * z * sq + x * sc));
        t.m31 = precision(2 * (x * z * sq + y * sc));
        t.m32 = precision(2 * (y * z * sq - x * sc));
        t.m33 = precision(1 - 2 * (x2 + y2) * sq);
    }

    return this.multiply(t);
};

/**
 *  Returns the result of scaling the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} scaleX - the scaling factor in the x axis.
 *  @param {number} scaleY - the scaling factor in the y axis. If undefined, the x component is used.
 *  @param {number} scaleZ - the scaling factor in the z axis. If undefined, 1 is used.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.scale = function (scaleX, scaleY, scaleZ) {
    var transform = new XCSSMatrix();

    if (typeof scaleX !== 'number' || isNaN(scaleX)) scaleX = 1;
    if (typeof scaleY !== 'number' || isNaN(scaleY)) scaleY = scaleX;
    if (typeof scaleZ !== 'number' || isNaN(scaleZ)) scaleZ = 1;

    transform.m11 = scaleX;
    transform.m22 = scaleY;
    transform.m33 = scaleZ;

    return this.multiply(transform);
};

/**
 *  Returns the result of skewing the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} skewX - The scaling factor in the x axis.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.skewX = function (degrees) {
    var radians   = utils.angles.deg2rad(degrees);
    var transform = new XCSSMatrix();

    transform.c = Math.tan(radians);

    return this.multiply(transform);
};

/**
 *  Returns the result of skewing the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} skewY - the scaling factor in the x axis.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.skewY = function (degrees) {
    var radians   = utils.angles.deg2rad(degrees);
    var transform = new XCSSMatrix();

    transform.b = Math.tan(radians);

    return this.multiply(transform);
};

/**
 *  Returns the result of translating the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} x - The x component of the vector.
 *  @param {number} y - The y component of the vector.
 *  @param {number} z - The z component of the vector. If undefined, 0 is used.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.translate = function (x, y, z) {
    var t = new XCSSMatrix();

    if (typeof x !== 'number' || isNaN(x)) x = 0;
    if (typeof y !== 'number' || isNaN(y)) y = 0;
    if (typeof z !== 'number' || isNaN(z)) z = 0;

    t.m41 = x;
    t.m42 = y;
    t.m43 = z;

    return this.multiply(t);
};

/**
 *  Sets the matrix values using a string representation, such as that produced
 *  by the [[XCSSMatrix#toString]] method.
 *  @method
 *  @member
 *  @params {string} domstr - A string representation of a 2D or 3D transform matrix
 *    in the form given by the CSS transform property, i.e. just like the
 *    output from [[XCSSMatrix#toString]].
 *  @returns undefined
 */
XCSSMatrix.prototype.setMatrixValue = function (domstr) {

    var matrixString = toMatrixString(domstr.trim());
    var matrixObject = utils.transp.statementToObject(matrixString);

    if (!matrixObject) return;

    var is3d   = matrixObject.key === utils.transp.matrixFn3d;
    var keygen = is3d ? indextoKey3d : indextoKey2d;
    var values = matrixObject.value;
    var count  = values.length;

    if ((is3d && count !== 16) || !(is3d || count === 6)) return;

    values.forEach(function (obj, i) {
        var key = keygen(i);
        this[key] = obj.value;
    }, this);
};

function indextoKey2d (index) {
    return String.fromCharCode(index + 97); // ASCII char 97 == 'a'
}

function indextoKey3d (index) {
    return ('m' + (Math.floor(index / 4) + 1)) + (index % 4 + 1);
}
/**
 *  Returns a string representation of the matrix.
 *  @method
 *  @memberof XCSSMatrix
 *  @returns {string} matrixString - a string like `matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)`
 *
 **/
XCSSMatrix.prototype.toString = function () {
    var points, prefix;

    if (utils.matrix.isAffine(this)) {
        prefix = utils.transp.matrixFn2d;
        points = points2d;
    } else {
        prefix = utils.transp.matrixFn3d;
        points = points3d;
    }

    return prefix + '(' +
        points.map(function (p) {
            return this[p].toFixed(6);
        }, this) .join(', ') +
        ')';
};

// ====== toMatrixString ====== //
var jsFunctions = {
    matrix: function (m, o) {
        var m2 = new XCSSMatrix(o.unparsed);

        return m.multiply(m2);
    },
    matrix3d: function (m, o) {
        var m2 = new XCSSMatrix(o.unparsed);

        return m.multiply(m2);
    },

    perspective: function (m, o) {
        var m2 = new XCSSMatrix();
        m2.m34 -= 1 / o.value[0].value;

        return m.multiply(m2);
    },

    rotate: function (m, o) {
        return m.rotate.apply(m, o.value.map(objectValues));
    },
    rotate3d: function (m, o) {
        return m.rotateAxisAngle.apply(m, o.value.map(objectValues));
    },
    rotateX: function (m, o) {
        return m.rotate.apply(m, [o.value[0].value, 0, 0]);
    },
    rotateY: function (m, o) {
        return m.rotate.apply(m, [0, o.value[0].value, 0]);
    },
    rotateZ: function (m, o) {
        return m.rotate.apply(m, [0, 0, o.value[0].value]);
    },

    scale: function (m, o) {
        return m.scale.apply(m, o.value.map(objectValues));
    },
    scale3d: function (m, o) {
        return m.scale.apply(m, o.value.map(objectValues));
    },
    scaleX: function (m, o) {
        return m.scale.apply(m, o.value.map(objectValues));
    },
    scaleY: function (m, o) {
        return m.scale.apply(m, [0, o.value[0].value, 0]);
    },
    scaleZ: function (m, o) {
        return m.scale.apply(m, [0, 0, o.value[0].value]);
    },

    skew: function (m, o) {
        var mX = new XCSSMatrix('skewX(' + o.value[0].unparsed + ')');
        var mY = new XCSSMatrix('skewY(' + (o.value[1]&&o.value[1].unparsed || 0) + ')');
        var sM = 'matrix(1.00000, '+ mY.b +', '+ mX.c +', 1.000000, 0.000000, 0.000000)';
        var m2 = new XCSSMatrix(sM);

        return m.multiply(m2);
    },
    skewX: function (m, o) {
        return m.skewX.apply(m, [o.value[0].value]);
    },
    skewY: function (m, o) {
        return m.skewY.apply(m, [o.value[0].value]);
    },

    translate: function (m, o) {
        return m.translate.apply(m, o.value.map(objectValues));
    },
    translate3d: function (m, o) {
        return m.translate.apply(m, o.value.map(objectValues));
    },
    translateX: function (m, o) {
        return m.translate.apply(m, [o.value[0].value, 0, 0]);
    },
    translateY: function (m, o) {
        return m.translate.apply(m, [0, o.value[0].value, 0]);
    },
    translateZ: function (m, o) {
        return m.translate.apply(m, [0, 0, o.value[0].value]);
    }
};

function objectValues(obj) {
    return obj.value;
}

function cssFunctionToJsFunction(cssFunctionName) {
    return jsFunctions[cssFunctionName];
}

function parsedToDegrees(parsed) {
    if (parsed.units === 'rad') {
        parsed.value = utils.angles.rad2deg(parsed.value);
        parsed.units = 'deg';
    }
    else if (parsed.units === 'grad') {
        parsed.value = utils.angles.grad2deg(parsed.value);
        parsed.units = 'deg';
    }

    return parsed;
}

function transformMatrix(matrix, operation) {
    // convert to degrees because all CSSMatrix methods expect degrees
    operation.value = operation.value.map(parsedToDegrees);

    var jsFunction = cssFunctionToJsFunction(operation.key);
    var result     = jsFunction(matrix, operation);

    return result || matrix;
}

/**
 *  Tranforms a `el.style.WebkitTransform`-style string
 *  (like `rotate(18rad) translate3d(50px, 100px, 10px)`)
 *  into a `getComputedStyle(el)`-style matrix string
 *  (like `matrix3d(0.660316, -0.750987, 0, 0, 0.750987, 0.660316, 0, 0, 0, 0, 1, 0, 108.114560, 28.482308, 10, 1)`)
 *  @private
 *  @method
 *  @param {string} transformString - `el.style.WebkitTransform`-style string (like `rotate(18rad) translate3d(50px, 100px, 10px)`)
 */
function toMatrixString(transformString) {
    var statements = utils.transp.stringToStatements(transformString);

    if (statements.length === 1 && (/^matrix/).test(transformString)) {
        return transformString;
    }

    // We only want the statement to pass to `utils.transp.statementToObject`
    //   not the other values (index, list) from `map`
    var statementToObject = utils.funcs.onlyFirstArg(utils.transp.statementToObject);
    var operations        = statements.map(statementToObject);
    var startingMatrix    = new XCSSMatrix();
    var transformedMatrix = operations.reduce(transformMatrix, startingMatrix);
    var matrixString      = transformedMatrix.toString();

    return matrixString;
}

module.exports = XCSSMatrix;

},{"./utils/angle":5,"./utils/cssTransformString":6,"./utils/matrix":7}],5:[function(require,module,exports){
module.exports = {
  deg2rad: deg2rad,
  rad2deg: rad2deg,
  grad2deg: grad2deg
};

/**
 *  Converts angles in degrees, which are used by the external API, to angles
 *  in radians used in internal calculations.
 *  @param {number} angle - An angle in degrees.
 *  @returns {number} radians
 */
function deg2rad(angle) {
    return angle * Math.PI / 180;
}

function rad2deg(radians) {
    return radians * (180 / Math.PI);
}

function grad2deg(gradians) {
    // 400 gradians in 360 degrees
    return gradians / (400 / 360);
}

},{}],6:[function(require,module,exports){
module.exports = {
    matrixFn2d: 'matrix',
    matrixFn3d: 'matrix3d',
    valueToObject: valueToObject,
    statementToObject: statementToObject,
    stringToStatements: stringToStatements
};

function valueToObject(value) {
    var units = /([\-\+]?[0-9]+[\.0-9]*)(deg|rad|grad|px|%)*/;
    var parts = value.match(units) || [];

    return {
        value: parseFloat(parts[1]),
        units: parts[2],
        unparsed: value
    };
}

function statementToObject(statement, skipValues) {
    var nameAndArgs    = /(\w+)\(([^\)]+)\)/i;
    var statementParts = statement.toString().match(nameAndArgs).slice(1);
    var functionName   = statementParts[0];
    var stringValues   = statementParts[1].split(/, ?/);
    var parsedValues   = !skipValues && stringValues.map(valueToObject);

    return {
        key: functionName,
        value: parsedValues || stringValues,
        unparsed: statement
    };
}

function stringToStatements(transformString) {
    var functionSignature   = /(\w+)\([^\)]+\)/ig;
    var transformStatements = transformString.match(functionSignature) || [];

    return transformStatements;
}

},{}],7:[function(require,module,exports){
module.exports = {
  determinant2x2: determinant2x2,
  determinant3x3: determinant3x3,
  determinant4x4: determinant4x4,
  isAffine: isAffine,
  isIdentityOrTranslation: isIdentityOrTranslation,
  adjoint: adjoint,
  inverse: inverse,
  multiply: multiply,
  decompose: decompose
};

/**
 *  Calculates the determinant of a 2x2 matrix.
 *  @param {number} a - Top-left value of the matrix.
 *  @param {number} b - Top-right value of the matrix.
 *  @param {number} c - Bottom-left value of the matrix.
 *  @param {number} d - Bottom-right value of the matrix.
 *  @returns {number}
 */
function determinant2x2(a, b, c, d) {
    return a * d - b * c;
}

/**
 *  Calculates the determinant of a 3x3 matrix.
 *  @param {number} a1 - Matrix value in position [1, 1].
 *  @param {number} a2 - Matrix value in position [1, 2].
 *  @param {number} a3 - Matrix value in position [1, 3].
 *  @param {number} b1 - Matrix value in position [2, 1].
 *  @param {number} b2 - Matrix value in position [2, 2].
 *  @param {number} b3 - Matrix value in position [2, 3].
 *  @param {number} c1 - Matrix value in position [3, 1].
 *  @param {number} c2 - Matrix value in position [3, 2].
 *  @param {number} c3 - Matrix value in position [3, 3].
 *  @returns {number}
 */
function determinant3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3) {

    return a1 * determinant2x2(b2, b3, c2, c3) -
           b1 * determinant2x2(a2, a3, c2, c3) +
           c1 * determinant2x2(a2, a3, b2, b3);
}

/**
 *  Calculates the determinant of a 4x4 matrix.
 *  @param {XCSSMatrix} matrix - The matrix to calculate the determinant of.
 *  @returns {number}
 */
function determinant4x4(matrix) {
    var
        m = matrix,
        // Assign to individual variable names to aid selecting correct elements
        a1 = m.m11, b1 = m.m21, c1 = m.m31, d1 = m.m41,
        a2 = m.m12, b2 = m.m22, c2 = m.m32, d2 = m.m42,
        a3 = m.m13, b3 = m.m23, c3 = m.m33, d3 = m.m43,
        a4 = m.m14, b4 = m.m24, c4 = m.m34, d4 = m.m44;

    return a1 * determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4) -
           b1 * determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4) +
           c1 * determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4) -
           d1 * determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
}

/**
 *  Determines whether the matrix is affine.
 *  @returns {boolean}
 */
function isAffine(matrix) {
    return matrix.m13 === 0 && matrix.m14 === 0 &&
           matrix.m23 === 0 && matrix.m24 === 0 &&
           matrix.m31 === 0 && matrix.m32 === 0 &&
           matrix.m33 === 1 && matrix.m34 === 0 &&
           matrix.m43 === 0 && matrix.m44 === 1;
}

/**
 *  Returns whether the matrix is the identity matrix or a translation matrix.
 *  @return {boolean}
 */
function isIdentityOrTranslation(matrix) {
    var m = matrix;

    return m.m11 === 1 && m.m12 === 0 && m.m13 === 0 && m.m14 === 0 &&
           m.m21 === 0 && m.m22 === 1 && m.m23 === 0 && m.m24 === 0 &&
           m.m31 === 0 && m.m31 === 0 && m.m33 === 1 && m.m34 === 0 &&
    /* m41, m42 and m43 are the translation points */   m.m44 === 1;
}

/**
 *  Returns the adjoint matrix.
 *  @return {XCSSMatrix}
 */
function adjoint(matrix) {
    var m = matrix,
        // make `result` the same type as the given metric
        result = new matrix.constructor(),

        a1 = m.m11, b1 = m.m12, c1 = m.m13, d1 = m.m14,
        a2 = m.m21, b2 = m.m22, c2 = m.m23, d2 = m.m24,
        a3 = m.m31, b3 = m.m32, c3 = m.m33, d3 = m.m34,
        a4 = m.m41, b4 = m.m42, c4 = m.m43, d4 = m.m44;

    // Row column labeling reversed since we transpose rows & columns
    result.m11 =  determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4);
    result.m21 = -determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4);
    result.m31 =  determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4);
    result.m41 = -determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);

    result.m12 = -determinant3x3(b1, b3, b4, c1, c3, c4, d1, d3, d4);
    result.m22 =  determinant3x3(a1, a3, a4, c1, c3, c4, d1, d3, d4);
    result.m32 = -determinant3x3(a1, a3, a4, b1, b3, b4, d1, d3, d4);
    result.m42 =  determinant3x3(a1, a3, a4, b1, b3, b4, c1, c3, c4);

    result.m13 =  determinant3x3(b1, b2, b4, c1, c2, c4, d1, d2, d4);
    result.m23 = -determinant3x3(a1, a2, a4, c1, c2, c4, d1, d2, d4);
    result.m33 =  determinant3x3(a1, a2, a4, b1, b2, b4, d1, d2, d4);
    result.m43 = -determinant3x3(a1, a2, a4, b1, b2, b4, c1, c2, c4);

    result.m14 = -determinant3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3);
    result.m24 =  determinant3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3);
    result.m34 = -determinant3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3);
    result.m44 =  determinant3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);

    return result;
}

function inverse(matrix) {
  var inv;

  if (isIdentityOrTranslation(matrix)) {
      inv = new matrix.constructor();

      if (!(matrix.m41 === 0 && matrix.m42 === 0 && matrix.m43 === 0)) {
          inv.m41 = -matrix.m41;
          inv.m42 = -matrix.m42;
          inv.m43 = -matrix.m43;
      }

      return inv;
  }

  // Calculate the adjoint matrix
  var result = adjoint(matrix);

  // Calculate the 4x4 determinant
  var det = determinant4x4(matrix);

  // If the determinant is zero, then the inverse matrix is not unique
  if (Math.abs(det) < 1e-8) return null;

  // Scale the adjoint matrix to get the inverse
  for (var i = 1; i < 5; i++) {
      for (var j = 1; j < 5; j++) {
          result[('m' + i) + j] /= det;
      }
  }

  return result;
}

function multiply(matrix, otherMatrix) {
  if (!otherMatrix) return null;

  var a = otherMatrix,
      b = matrix,
      c = new matrix.constructor();

  c.m11 = a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41;
  c.m12 = a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42;
  c.m13 = a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43;
  c.m14 = a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44;

  c.m21 = a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41;
  c.m22 = a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42;
  c.m23 = a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43;
  c.m24 = a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44;

  c.m31 = a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41;
  c.m32 = a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42;
  c.m33 = a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43;
  c.m34 = a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44;

  c.m41 = a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41;
  c.m42 = a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42;
  c.m43 = a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43;
  c.m44 = a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44;

  return c;
}

function transpose(matrix) {
  var result = new matrix.constructor();
  var rows = 4, cols = 4;
  var i = cols, j;
  while (i) {
    j = rows;
    while (j) {
      result['m' + i + j] = matrix['m'+ j + i];
      j--;
    }
    i--;
  }
  return result;
}

/*
  Input:  matrix      ; a 4x4 matrix
  Output: translation ; a 3 component vector
          scale       ; a 3 component vector
          skew        ; skew factors XY,XZ,YZ represented as a 3 component vector
          perspective ; a 4 component vector
          rotate  ; a 4 component vector
  Returns false if the matrix cannot be decomposed, true if it can
*/
var Vector4 = require('../Vector4.js');
function decompose(matrix) {
  var perspectiveMatrix, rightHandSide, inversePerspectiveMatrix, transposedInversePerspectiveMatrix,
      perspective, translate, row, i, len, scale, skew, pdum3, rotate;

  // Normalize the matrix.
  if (matrix.m33 == 0) { return false; }

  for (i = 1; i <= 4; i++) {
    for (j = 1; j < 4; j++) {
      matrix['m'+i+j] /= matrix.m44;
    }
  }

  // perspectiveMatrix is used to solve for perspective, but it also provides
  // an easy way to test for singularity of the upper 3x3 component.
  perspectiveMatrix = matrix;
  perspectiveMatrix.m14 = 0;
  perspectiveMatrix.m24 = 0;
  perspectiveMatrix.m34 = 0;
  perspectiveMatrix.m44 = 1;

  if (determinant4x4(perspectiveMatrix) == 0) {
    return false;
  }

  // First, isolate perspective.
  if (matrix.m14 != 0 || matrix.m24 != 0 || matrix.m34 != 0) {
    // rightHandSide is the right hand side of the equation.
    rightHandSide = new Vector4(matrix.m14, matrix.m24, matrix.m34, matrix.m44);

    // Solve the equation by inverting perspectiveMatrix and multiplying
    // rightHandSide by the inverse.
    inversePerspectiveMatrix = inverse(perspectiveMatrix);
    transposedInversePerspectiveMatrix = transpose(inversePerspectiveMatrix);
    perspective = rightHandSide.multiplyByMatrix(transposedInversePerspectiveMatrix);
  }
  else {
    // No perspective.
    perspective = new Vector4(0, 0, 0, 1);
  }

  // Next take care of translation
  translate = new Vector4(matrix.m41, matrix.m42, matrix.m43);

  // Now get scale and shear. 'row' is a 3 element array of 3 component vectors
  row = [ new Vector4(), new Vector4(), new Vector4() ];
  for (i = 1, len = row.length; i < len; i++) {
    row[i-1].x = matrix['m'+i+'1'];
    row[i-1].y = matrix['m'+i+'2'];
    row[i-1].z = matrix['m'+i+'3'];
  }

  // Compute X scale factor and normalize first row.
  scale = new Vector4();
  skew = new Vector4();

  scale.x = row[0].length();
  row[0] = row[0].normalize();

  // Compute XY shear factor and make 2nd row orthogonal to 1st.
  skew.x = row[0].dot(row[1]);
  row[1] = row[1].combine(row[0], 1.0, -skew.x);

  // Now, compute Y scale and normalize 2nd row.
  scale.y = row[1].length();
  row[1] = row[1].normalize();
  skew.x /= scale.y;

  // Compute XZ and YZ shears, orthogonalize 3rd row
  skew.y = row[0].dot(row[2]);
  row[2] = row[2].combine(row[0], 1.0, -skew.y);
  skew.z = row[1].dot(row[2]);
  row[2] = row[2].combine(row[1], 1.0, -skew.z);

  // Next, get Z scale and normalize 3rd row.
  scale.z = row[2].length();
  row[2] = row[2].normalize();
  skew.y = (skew.y / scale.z) || 0;
  skew.z = (skew.z / scale.z) || 0;

  // At this point, the matrix (in rows) is orthonormal.
  // Check for a coordinate system flip.  If the determinant
  // is -1, then negate the matrix and the scaling factors.
  pdum3 = row[1].cross(row[2]);
  if (row[0].dot(pdum3) < 0) {
    for (i = 0; i < 3; i++) {
      scale.x *= -1;
      row[i].x *= -1;
      row[i].y *= -1;
      row[i].z *= -1;
    }
  }

  // Now, get the rotations out
  // FROM W3C
  rotate = new Vector4();
  rotate.x = 0.5 * Math.sqrt(Math.max(1 + row[0].x - row[1].y - row[2].z, 0));
  rotate.y = 0.5 * Math.sqrt(Math.max(1 - row[0].x + row[1].y - row[2].z, 0));
  rotate.z = 0.5 * Math.sqrt(Math.max(1 - row[0].x - row[1].y + row[2].z, 0));
  rotate.w = 0.5 * Math.sqrt(Math.max(1 + row[0].x + row[1].y + row[2].z, 0));

  // if (row[2].y > row[1].z) rotate[0] = -rotate[0];
  // if (row[0].z > row[2].x) rotate[1] = -rotate[1];
  // if (row[1].x > row[0].y) rotate[2] = -rotate[2];

  // FROM MORF.JS
  rotate.y = Math.asin(-row[0].z);
  if (Math.cos(rotate.y) != 0) {
    rotate.x = Math.atan2(row[1].z, row[2].z);
    rotate.z = Math.atan2(row[0].y, row[0].x);
  } else {
    rotate.x = Math.atan2(-row[2].x, row[1].y);
    rotate.z = 0;
  }

  // FROM http://blog.bwhiting.co.uk/?p=26
  // scale.x2 = Math.sqrt(matrix.m11*matrix.m11 + matrix.m21*matrix.m21 + matrix.m31*matrix.m31);
  // scale.y2 = Math.sqrt(matrix.m12*matrix.m12 + matrix.m22*matrix.m22 + matrix.m32*matrix.m32);
  // scale.z2 = Math.sqrt(matrix.m13*matrix.m13 + matrix.m23*matrix.m23 + matrix.m33*matrix.m33);

  // rotate.x2 = Math.atan2(matrix.m23/scale.z2, matrix.m33/scale.z2);
  // rotate.y2 = -Math.asin(matrix.m13/scale.z2);
  // rotate.z2 = Math.atan2(matrix.m12/scale.y2, matrix.m11/scale.x2);

  return {
    perspective : perspective,
    translate   : translate,
    skew        : skew,
    scale       : scale,
    rotate      : rotate
  };
}

},{"../Vector4.js":3}],8:[function(require,module,exports){
module.exports = {
  length           : length,
  normalize        : normalize,
  dot              : dot,
  cross            : cross,
  combine          : combine,
  multiplyByMatrix : multiplyByMatrix
};

/**
 * Get the length of the vector
 * @author Joe Lambert
 * @returns {float}
 */

function length(vector) {
  return Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
}


/**
 * Get a normalized representation of the vector
 * @author Joe Lambert
 * @returns {Vector4}
 */

function normalize(vector) {
  var len = length(vector),
    v = new vector.constructor(vector.x / len, vector.y / len, vector.z / len);

  return v;
}


/**
 * Vector Dot-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {float} The Dot-Product of a and b.
 */

function dot(a, b) {
  return a.x*b.x + a.y*b.y + a.z*b.z + a.w*b.w;
}


/**
 * Vector Cross-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {Vector4} The Cross-Product of a and b.
 */

function cross(a, b) {
  return new a.constructor(
    (a.y * b.z) - (a.z * b.y),
    (a.z * b.x) - (a.x * b.z),
    (a.x * b.y) - (a.y * b.x)
  );
}


/**
 * Helper function required for matrix decomposition
 * A Javascript implementation of pseudo code available from http://www.w3.org/TR/css3-2d-transforms/#matrix-decomposition
 * @param {Vector4} aPoint A 3D point
 * @param {float} ascl
 * @param {float} bscl
 * @author Joe Lambert
 * @returns {Vector4}
 */

function combine(aPoint, bPoint, ascl, bscl) {
  return new aPoint.constructor(
    (ascl * aPoint.x) + (bscl * bPoint.x),
    (ascl * aPoint.y) + (bscl * bPoint.y),
    (ascl * aPoint.z) + (bscl * bPoint.z)
  );
}

function multiplyByMatrix(vector, matrix) {
  return new vector.constructor(
    (matrix.m11 * vector.x) + (matrix.m12 * vector.y) + (matrix.m13 * vector.z),
    (matrix.m21 * vector.x) + (matrix.m22 * vector.y) + (matrix.m23 * vector.z),
    (matrix.m31 * vector.x) + (matrix.m32 * vector.y) + (matrix.m33 * vector.z)
  );
}

},{}],9:[function(require,module,exports){
var _      = require('../utils'),

	loop   = require('../loop'),

	Elem   = require('../elem'),

	Matrix = require('../transformers/Matrix'),
	Obj    = require('../transformers/Obj');

var Animation = function(obj) {

	var hasElem = _.isElement(obj);
	this.obj         = hasElem ? Obj.create() : Obj.create(obj);
	this._elem        = hasElem ? Elem.create(obj) : null;
	this.elem         = hasElem ? obj : null;
	this.matrix       = Matrix.create();
	this.playing      = false;
	this._startTime   = 0;
	this._delayTime   = 0;
	this._events      = {};

	var self = this;
	this.transform = {
		from: function(from) {

			self.matrix.setFrom(from);

			return self;

		},
		to: function(to) {

			self.matrix.setTo(to);

			return self;

		}
	};
};

Animation.prototype = {

	on: function(name, fn) {

		var arr = this._events[name] || (this._events[name] = []);
		arr.push(fn);
		return this;

	},

	off: function(name, fn) {

		var arr = this._events[name];
		if (!arr || !arr.length) { return this; }

		var idx = arr.indexOf(fn);
		if (idx !== -1) {

			animations.splice(idx, 1);

		}

		return this;

	},

	trigger: function(name, a, b) {

		var arr = this._events[name];
		if (!arr || !arr.length) { return this; }

		var idx = 0, length = arr.length;
		for (; idx < length; idx++) {

			arr[idx](a, b);

		}

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
		this.obj.yoyo = this.matrix.yoyo = !!yoyo;
		return this;

	},

	to: function(to) {

		this.obj.setTo(to);
		return this;

	},

	from: function(from) {

		this.obj.setFrom(from);
		return this;

	},

	start: function(time) {

		this._startTime = time || loop.now;

		var self = this;
		loop.await(function(time) {

			var shouldContinueToWait;

			if (time < (self._startTime + self._delayTime)) {

				return (shouldContinueToWait = true);

			}

			self.trigger('start');

			self.playing = true;

			self._resolveToFrom();

			self._start(time);

			return (shouldContinueToWait = false);

		});

		return this;

	},

	_resolveToFrom: function() {

		if (!this._elem) { return; }

		if (!this.obj.base) {

			this.obj.setFrom(
				this._elem.calcBase(this.obj.to)
			);

		}

		if (this.matrix.to) {

			this.matrix.setMatrix(this._elem.calcMatrix());

		}

	},

	pause: function(time) {

		time = time || loop.now;
		this._animation.pause(time);
		return this;

	},

	resume: function(time) {

		time = time || loop.now;
		this._animation.resume(time);
		return this;

	},

	stop: function() {

		if (!this.playing) { return this; }

		this.playing = false;

		loop.remove(this._animation);

		this._animation.stop();

		this.trigger('stop');

		return this;
	}

	// Implemented by the inheritor
	// _start: function() {}
};

module.exports = Animation;
},{"../elem":15,"../loop":17,"../transformers/Matrix":22,"../transformers/Obj":23,"../utils":24}],10:[function(require,module,exports){
var _ = require('../utils'),

	loop = require('../loop'),

	Animator = require('./Animator'),

	Spring = require('./animations/Spring');

var FluxSpring = module.exports =function(obj) {
	Animator.call(this, obj);

	this._animation = Spring.create();
};

FluxSpring.create = function(obj) {

	return new FluxSpring(obj);

};

_.extend(FluxSpring.prototype, Animator.prototype, {

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

		this._animation.tension = +tension;

		return this;

	},

	friction: function(friction) {

		this._animation.friction = +friction;

		return this;

	},

	velocity: function(velocity) {

		this._animation.velocity = +velocity;

		return this;

	},

	_start: function() {

		var self = this;
		this._animation
			.registerCallbacks({

				onUpdate: function(perc) {

					self.obj.update(perc);
					self.matrix.update(perc);

					self.trigger('update', self.obj.base, self);

				},

				onReverse: function() {

					self.obj.reverse();
					self.matrix.reverse();

				},

				onComplete: function() {

					self.stop().trigger('complete');

				}

			});

		self.obj.start();
		self.matrix.start();

		loop.add(self._animation);

	}
});
},{"../loop":17,"../utils":24,"./Animator":9,"./animations/Spring":12}],11:[function(require,module,exports){
var _ = require('../utils'),

	loop = require('../loop'),

	Animator = require('./Animator'),

	easing = require('../easing'),

	Tween = require('./animations/Tween');

var FluxTween = module.exports = function(obj) {
	Animator.call(this, obj);

	this._animation = Tween.create();

};

FluxTween.create = function(obj) {

	return new FluxTween(obj);

};

_.extend(FluxTween.prototype, Animator.prototype, {

	from: function(obj) {

		this.obj.from(obj);
		return this;

	},

	duration: function(duration) {

		this._animation.duration(+duration);
		return this;

	},

	ease: function(fn) {

		this._animation.ease(fn || easing.linear.none);
		return this;

	},

	_start: function() {

		var self = this;
		this._animation
			.registerCallbacks({

				onUpdate: function(perc) {

					self.obj.update(perc);
					self.matrix.update(perc);

					self.trigger('update', self.obj.base, self);

				},

				onComplete: function() {

					self.stop().trigger('complete');

				},

				onReverse: function() {

					self.obj.reverse();
					self.matrix.reverse();

				}

			})
			.startTime(loop.now);

		self.obj.start();
		self.matrix.start();
		loop.add(self._animation);

	}

});
},{"../easing":14,"../loop":17,"../utils":24,"./Animator":9,"./animations/Tween":13}],12:[function(require,module,exports){
var END_VALUE = 100,
	TOLERANCE = 0.01,
	SPEED     = 1 / 60,

	calcSpringAcceleration = function(tension, x, friction, velocity) {

		return -tension * x - friction * velocity;

	},

	springCalculateState = function(state, speed) {

		var dt = speed * 0.5,
			velocity = state.velocity,
			tension  = state.tension,
			friction = state.friction,

			a_dx = velocity,
			a_dv = calcSpringAcceleration(tension, state.x, friction, velocity),

			b_dx = velocity + a_dv * dt,
			b_end_x = state.x + a_dx * dt,
			b_dv = calcSpringAcceleration(tension, b_end_x, friction, b_dx),

			c_dx = velocity + b_dv * dt,
			c_end_x = state.x + b_dx * dt,
			c_dv = calcSpringAcceleration(tension, c_end_x, friction, c_dx),

			d_dx = velocity + c_dv * dt,
			d_end_x = state.x + c_dx * dt,
			d_dv = calcSpringAcceleration(tension, d_end_x, friction, d_dx),

			dxdt = (1 / 6) * (a_dx + 2 * (b_dx + c_dx) + d_dx),
			dvdt = (1 / 6) * (a_dv + 2 * (b_dv + c_dv) + d_dv);

		state.x        = state.x + dxdt * speed;
		state.velocity = a_dx + dvdt * speed;

		return state;

	};

var Spring = module.exports = function Spring() {

	var spring = this;
	spring._repeat           = 0;
	spring.velocity          = 0;
	spring._originalVelocity = 0;
	spring.tension           = 80;
	spring._originalTension  = 80;
	spring.friction          = 8;
	spring._originalFriction = 8;
	spring._value            = 0;

	spring._isPaused         = false;

	// Stores x and velocity to do
	// calculations against so that
	// we can have multiple return
	// values from springCalculateState
	spring._state = {};

};

Spring.create = function() {
	return new Spring();
};

Spring.prototype = {

	registerCallbacks: function(obj) {

		var spring = this;
		spring._updateCallback   = obj.onUpdate;
		spring._completeCallback = obj.onComplete;
		spring._reverseCallback  = obj.onReverse;
		return spring;

	},

	repeat: function(times) {

		var spring = this;
		spring._repeat = times;
		return spring;

	},

	set: function(tension, friction, velocity) {

		var spring = this;
		if (velocity !== undefined) { spring.velocity = spring._originalVelocity = velocity; }
		if (tension  !== undefined) { spring.tension  = spring._originalTension  = tension;  }
		if (friction !== undefined) { spring.friction = spring._originalFriction = friction; }
		return spring;

	},

	tension: function(tension) {

		var spring = this;
		spring.tension = spring._originalTension = tension;
		return spring;

	},

	friction: function(friction) {

		var spring = this;
		spring.friction = spring._originalFriction = friction;
		return spring;

	},

	velocity: function(velocity) {

		var spring = this;
		spring.velocity = spring._originalVelocity = velocity;
		return spring;

	},

	pause: function() {

		this._isPaused = true;
		return this;

	},

	resume: function() {

		this._isPaused = false;
		return this;

	},

	step: function() {
		var shouldStepAgain;

		if (this._isPaused) { return (shouldStepAgain = true); }

		var spring = this,
			stateBefore = spring._state;

		stateBefore.x        = spring._value - END_VALUE;
		stateBefore.velocity = spring.velocity;
		stateBefore.tension  = spring.tension;
		stateBefore.friction = spring.friction;

		var stateAfter       = springCalculateState(stateBefore, SPEED),
			finalVelocity    = stateAfter.velocity,
			netFloat         = stateAfter.x,
			net1DVelocity    = stateAfter.velocity,
			netValueIsLow    = Math.abs(netFloat) < TOLERANCE,
			netVelocityIsLow = Math.abs(net1DVelocity) < TOLERANCE,
			shouldSpringStop = netValueIsLow || netVelocityIsLow;

		spring._value = END_VALUE + stateAfter.x;

		if (shouldSpringStop) {

			spring.velocity = finalVelocity = 0;
			spring._value = END_VALUE;

			spring._updateCallback(spring._value / 100);

			// Should we repeat?
			if (spring._repeat > 0) {

				// Decrement the repeat counter (if finite,
				// we may be in an infinite loop)
				if (isFinite(spring._repeat)) { spring._repeat--; }

				spring._reverseCallback();
				spring.velocity = spring._originalVelocity;
				spring.tension  = spring._originalTension;
				spring.friction = spring._originalFriction;
				spring._value = 0;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			spring._completeCallback();

			return (shouldStepAgain = false);

		}

		spring.velocity = finalVelocity;
		spring._updateCallback(spring._value / 100);
		return (shouldStepAgain = true);

	},

	stop: function() {

		var spring = this;
		spring.velocity = spring._originalVelocity;
		spring.tension  = spring._originalTension;
		spring.friction = spring._originalFriction;
		spring._value = 0;

	}
};
},{}],13:[function(require,module,exports){
var _ = require('../../utils'),

	easing = require('../../easing');

var Tween = module.exports = function Tween() {

	var tween = this;
	tween._duration           = 1000;
	tween._repeat             = 0;
	tween._startTime          = 0;
	tween._isPaused           = false;
	tween._easingFunction     = easing.linear.none;

	tween.step = tween.step.bind(tween);

};

Tween.create = function() {
	return new Tween();
};

Tween.prototype = {

	registerCallbacks: function(obj) {

		var tween = this;
		tween._updateCallback   = obj.onUpdate;
		tween._completeCallback = obj.onComplete;
		tween._reverseCallback  = obj.onReverse;
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

	pause: function(time) {

		this._isPaused = true;
		this._pauseTime = time;
		return this;

	},

	resume: function(time) {

		if (!this._isPaused || !this._pauseTime) { return this; }

		var delay = time - this._pauseTime;
		this._startTime += delay;

		this._pauseTime = null;
		this._isPaused = false;

		return this;

	},

	step: function(time) {
		var shouldStepAgain;

		if (this._isPaused) { return (shouldStepAgain = true); }

		var elapsedUncapped = (time - this._startTime) / this._duration,
			elapsed         = elapsedUncapped > 1 ? 1 : elapsedUncapped;

		this._updateCallback(this._easingFunction(elapsed));

		// We have ellapsed tween loop
		if (elapsed === 1) {

			// Should we repeat?
			if (this._repeat > 0) {

				// Decrement the repeat counter (if finite,
				// we may be in an infinite loop)
				if (isFinite(this._repeat)) { this._repeat--; }

				this._reverseCallback();
				this._startTime = time;

				return (shouldStepAgain = true);

			}

			// Otherwise, we're done repeating
			this._completeCallback();

			return (shouldStepAgain = false);

		}

		return (shouldStepAgain = true);

	},

	stop: _.noop
};
},{"../../easing":14,"../../utils":24}],14:[function(require,module,exports){
// from the amazing sole
// https://github.com/sole/tween.js/

var PI = Math.PI,
	HALF_PI = PI / 2;

var linearNone = function(k) {

		return k;

	},

	quadraticIn = function(k) {

		return k * k;

	},

	quadraticOut = function(k) {

		return k * (2 - k);

	},

	quadraticInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k; }
		return - 0.5 * (--k * (k - 2) - 1);

	},

	cubicIn = function(k) {

		return k * k * k;

	},

	cubicOut = function(k) {

		return --k * k * k + 1;

	},

	cubicInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k * k; }
		return 0.5 * ((k -= 2) * k * k + 2);

	},

	quarticIn = function(k) {

		return k * k * k * k;

	},

	quarticOut = function(k) {

		return 1 - (--k * k * k * k);

	},

	quarticInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k * k * k; }
		return - 0.5 * ((k -= 2) * k * k * k - 2);

	},

	quinticIn = function(k) {

		return k * k * k * k * k;

	},

	quinticOut = function(k) {

		return --k * k * k * k * k + 1;

	},

	quinticInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k * k * k * k; }
		return 0.5 * ((k -= 2) * k * k * k * k + 2);

	},

	sinusoidalIn = function(k) {

		return 1 - Math.cos(k * HALF_PI);

	},

	sinusoidalOut = function(k) {

		return Math.sin(k * HALF_PI);

	},

	sinusoidalInOut = function(k) {

		return 0.5 * (1 - Math.cos(PI * k));

	},

	exponentialIn = function(k) {

		return k === 0 ? 0 : Math.pow(1024, k - 1);

	},

	exponentialOut = function(k) {

		return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

	},

	exponentialInOut = function(k) {

		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if ((k *= 2) < 1) { return 0.5 * Math.pow(1024, k - 1); }
		return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

	},

	circularIn = function(k) {

		return 1 - Math.sqrt(1 - k * k);

	},

	circularOut = function(k) {

		return Math.sqrt(1 - (--k * k));

	},

	circularInOut = function(k) {

		if ((k *= 2) < 1) { return - 0.5 * (Math.sqrt(1 - k * k) - 1); }
		return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

	},

	elasticIn = function(k) {

		var s, a = 0.1, p = 0.4;
		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if (!a || a < 1) {
			a = 1; s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * PI);
		}
		return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * PI) / p));

	},

	elasticOut = function(k) {

		var s, a = 0.1, p = 0.4;
		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if (!a || a < 1) {
			a = 1; s = p / 4;
		} else {
			 s = p * Math.asin(1 / a) / (2 * PI);
		}
		return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * PI) / p) + 1);

	},

	elasticInOut = function(k) {

		var s, a = 0.1, p = 0.4;
		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if (!a || a < 1) {
			a = 1; s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * PI);
		}
		if ((k *= 2) < 1) { return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * PI) / p)); }
		return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * PI) / p) * 0.5 + 1;

	},

	backIn = function(k) {

		var s = 1.70158;
		return k * k * ((s + 1) * k - s);

	},

	backOut = function(k) {

		var s = 1.70158;
		return --k * k * ((s + 1) * k + s) + 1;

	},

	backInOut = function(k) {

		var s = 1.70158 * 1.525;
		if ((k *= 2) < 1) { return 0.5 * (k * k * ((s + 1) * k - s)); }
		return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

	},

	bounceIn = function(k) {

		return 1 - bounceOut(1 - k);

	},

	bounceOut = function(k) {

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

	bounceInOut = function(k) {

		if (k < 0.5) { return bounceIn(k * 2) * 0.5; }
		return bounceOut(k * 2 - 1) * 0.5 + 0.5;

	};

module.exports = {

	linear: {

		none: linearNone

	},

	quadratic: {

		in: quadraticIn,

		out: quadraticOut,

		inOut: quadraticInOut

	},

	cubic: {

		in: cubicIn,

		out: cubicOut,

		inOut: cubicInOut

	},

	quartic: {

		in: quarticIn,

		out: quarticOut,

		inOut: quarticInOut

	},

	quintic: {

		in: quinticIn,

		out: quinticOut,

		inOut: quinticInOut

	},

	sinusoidal: {

		in: sinusoidalIn,

		out: sinusoidalOut,

		inOut: sinusoidalInOut

	},

	exponential: {

		in: exponentialIn,

		out: exponentialOut,

		inOut: exponentialInOut

	},

	circular: {

		in: circularIn,

		out: circularOut,

		inOut: circularInOut

	},

	elastic: {

		in: elasticIn,

		out: elasticOut,

		inOut: elasticInOut

	},

	back: {

		in: backIn,

		out: backOut,

		inOut: backInOut,

	},

	bounce: {

		in: bounceIn,

		out: bounceOut,

		inOut: bounceInOut

	}

};

},{}],15:[function(require,module,exports){
var utils = require('./utils');

var Elem = module.exports = function(elem) {

    this.elem = elem;

    // this._computedStyles

};

Elem.create = function(elem) {

    return new Elem(elem);

};

Elem.prototype = {

    calcBase: function(to) {

        var from = {},
            computedStyles = this._computedStyles = utils.getComputedStyle(this.elem);

        for (var property in to) {

            from[property] = computedStyles[property];

        }

        return from;

    },

    calcMatrix: function() {

        return utils.getComputedMatrix(this._computedStyles || utils.getComputedStyle(this.elem));

    }
};
},{"./utils":16}],16:[function(require,module,exports){
var WebMatrix = require('xcssmatrix'),

    transform = require('../transform-prop');

module.exports = {

    getComputedMatrix: function(computedStyles) {

        return new WebMatrix(computedStyles[transform]);

    },

    getComputedStyle: function(elem) {

        return document.defaultView.getComputedStyle(elem);

    }

};
},{"../transform-prop":20,"xcssmatrix":2}],17:[function(require,module,exports){
var _          = require('./utils'),
	waiting    = [],
	animations = [];

var loop = module.exports = {
	now: 0,

	await: function(fn) {

		waiting.push(fn);

	},

	add: function(fn) {

		animations.push(fn);

	},

	remove: function(fn) {

		var idx = animations.indexOf(fn);
		if (idx !== -1) {

			animations.splice(idx, 1);

		}

	},

	update: function(time) {

		time = loop.now = time || Date.now();

		if (waiting.length === 0 && animations.length === 0) { return; }

		var idx = 0;
		while (idx < waiting.length) {

			if (waiting[idx](time)) {

				idx++;

			} else {

				waiting.splice(idx, 1);

			}

		}

		idx = 0;
		while (idx < animations.length) {

			animations[idx].step(time);
			idx++;

		}

	}
};
},{"./utils":24}],18:[function(require,module,exports){
module.exports = function(m) {

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
},{}],19:[function(require,module,exports){
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
},{"./decompose":18,"xcssmatrix":2}],20:[function(require,module,exports){
var div = document.createElement('div'),

	selectProp = function(arr) {
		var idx = arr.length;
		while (idx--) {
			if (div.style[arr[idx]] !== undefined) {
				return arr[idx];
			}
		}
	};

module.exports = selectProp([
	'transform',
	'msTransform',
	'oTransform',
	'mozTransform',
	'webkitTransform'
]) || '';

div = null;
},{}],21:[function(require,module,exports){
/*
    var MATRIX = {
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
*/

var expand = function(obj) {
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

module.exports = function(obj) {

    if (!obj) { return obj; }

    return expand(obj);

};
},{}],22:[function(require,module,exports){
var _ = require('../../utils'),

    M = require('../../matrix'),

    expandShorthand = require('./expand-shorthand'),

    Obj = require('../Obj'),

    setters = {
        x: 'setX',
        y: 'setY',
        z: 'setZ',
        scale: 'setScale',
        scaleX: 'setScaleX',
        scaleY: 'setScaleY',
        scaleZ: 'setScaleZ',
        rotation: 'setRotation',
        rotationX: 'setRotationX',
        rotationY: 'setRotationY',
        rotationZ: 'setRotationZ'
    };

var Matrix = module.exports = function() {

    // this.base;
    // this.from = {};
    // this.to   = {};

    // this.yoyo  = false;

    // this._matrix;

};

Matrix.create = function(obj) {

    return new Matrix(obj);

};

_.extend(Matrix.prototype, Obj.prototype, {

    setMatrix: function(matrix) {

        this._matrix = new M(matrix);
        this.base = this._matrix.toObject();
        return this;

    },

    setFrom: function(from) {

        this.base = expandShorthand(from);

        return this;

    },

    setTo: function(to) {

        this.to = expandShorthand(to);

        return this;

    },

    update: function(perc) {

        if (!this._matrix) { return this; }

        var property;

        for (property in this.base) {

            var start = this.from[property] || 0,
                end = this.to[property];

            // protect against non numeric properties.
            if (end === +end) {

                this.base[property] = start + (end - start) * perc;

            }

            this._matrix[setters[property]](this.base[property]);

        }

        return this;

    },

    start: function() {

        if (!this._matrix || ! this.to) { return this; }

        var base   = this.base || (this.base = {}),
            from   = this.from || (this.from = {}),
            repeat = this._repeat || (this._repeat = {}),
            to     = this.to,
            property;

        for (property in this.to) {

            // omit unchanged properties
            if (base[property] === undefined || to[property] === base[property]) {

                delete to[property];
                continue;

            }

            // Ensures we're using numbers, not strings
            from[property] = base[property] *= 1;

            repeat[property] = from[property] || 0;
        }

        this._matrix.transpose(this.base);

        return this;

    },

    toString: function() {

        if (!this._matrix) { return ''; }

        return this._matrix.update().toString();

    }

});
},{"../../matrix":19,"../../utils":24,"../Obj":23,"./expand-shorthand":21}],23:[function(require,module,exports){
var Obj = module.exports = function(obj) {

	this.base = obj;

	// this.from   = {};
	// this._repeat = {};
	// this.to     = {};
	// this.yoyo    = false;

};

Obj.create = function(obj) {

	return new Obj(obj);

};

Obj.prototype = {

	setFrom: function(from) {

		this.base = from;

		return this;

	},

	setTo: function(to) {

		this.to = to;

		return this;

	},

	update: function(perc) {

		var property;

		for (property in this.to) {

			var start = this.from[property] || 0,
				end = this.to[property];

			// protect against non numeric properties.
			if (end === +end) {

				this.base[property] = start + (end - start) * perc;

			}

		}

		return this;

	},

	reverse: function() {

		var property, tmp;

		// reassign starting values
		for (property in this._repeat) {

			if (this.yoyo) {

				tmp = this._repeat[property];
				this._repeat[property] = this.to[property];
				this.to[property] = tmp;

			}

			this.from[property] = this._repeat[property];

		}


		return this;

	},

	start: function() {

		if (!this.to) { return this; }

		var base   = this.base || (this.base = {}),
			from   = this.from || (this.from = {}),
			repeat = this._repeat || (this._repeat = {}),
			to     = this.to,
			property;

		for (property in this.to) {

			// omit unchanged properties
			if (base[property] === undefined || to[property] === base[property]) {

				delete to[property];
				continue;

			}

			// Ensures we're using numbers, not strings
			from[property] = base[property] *= 1;

			repeat[property] = from[property] || 0;
		}


		return this;

	}

};
},{}],24:[function(require,module,exports){
var toString = {}.toString;

module.exports = {
	noop: function() {},

	isElement: function(obj) {
		return !!(obj && obj.nodeType === 1);
	},

	isNumber: function(obj) {
		return toString.call(obj) === '[object Number]';
	},

	extend: function(base) {
		if (!base) { return base; }

		var args = arguments,
			idx = 1, length = args.length,
			source, prop;

		for (; idx < length; idx++) {
			source = args[idx];
			if (source) {
				for (prop in source) {
					base[prop] = source[prop];
				}
			}
		}

		return base;
	}
};
},{}]},{},[1])(1)
});