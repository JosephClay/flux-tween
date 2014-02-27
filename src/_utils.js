var WebMatrix = (typeof WebKitCSSMatrix !== 'undefined') ? WebKitCSSMatrix : XCSSMatrix;

var _exists = function(obj) {
	return (obj !== null && obj !== undefined);
};

var _EL = document.createElement('div');
var _keyValTest = function(obj) {
	var key;
	for (key in obj) {
		if (_EL.style[key] !== undefined) {
			return obj[key];
		}
	}

	return '';
};

var _propTest = function(arr) {
	var idx = arr.length;
	while (idx--) {
		if (_EL.style[arr[idx]] !== undefined) {
			return arr[idx];
		}
	}

	return '';
};

var _slice = (function(_ARR_PROTO) {
	return function(arrlike) {
		return _ARR_PROTO.slice.call(arrlike);
	};
}(Array.prototype));

var _extend = function() {
	var args = _slice(arguments),
		base = args[0] || {},
		idx = 0, length = args.length,
		source, prop;
	for (; idx < length; idx++) {
		if (idx !== 0) {
			source = args[idx];
			if (source) {
				for (prop in source) {
					base[prop] = source[prop];
				}
			}
		}
	}
	return base;
};

var _now = Date.now || function() {
	return new Date().getTime();
};

var _round = function(value, decimals) {
	var d = Math.pow(10, decimals);
	return Math.round(value * d) / d;
};