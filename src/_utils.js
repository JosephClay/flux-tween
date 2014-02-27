var _utils = (function() {

	var _EL = document.createElement('div'),
		_ARR_PROTO = Array.prototype,
		Matrix = (typeof WebKitCSSMatrix !== 'undefined') ? WebKitCSSMatrix : XCSSMatrix;

	var _slice = function(arrlike) {
		return _ARR_PROTO.slice.call(arrlike);
	};

	return {
		WebMatrix: Matrix,

		slice: _slice,

		extend: function() {
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
		},

		now: Date.now || function() {
			return new Date().getTime();
		},

		round: function(value, decimals) {
			var d = Math.pow(10, decimals);
			return Math.round(value * d) / d;
		},

		keyValTest: function(obj) {
			var key;
			for (key in obj) {
				if (_EL.style[key] !== undefined) {
					return obj[key];
				}
			}

			return '';
		},

		propTest: function(arr) {
			var idx = arr.length;
			while (idx--) {
				if (_EL.style[arr[idx]] !== undefined) {
					return arr[idx];
				}
			}

			return '';
		}
	};

}());