var Utils = (function(window, document, undefined) {
	
	var _CURVE_PARSER = /\s+\(\)/g;

	var _indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) { return i; }
		}
		return -1;
	};

	var _slice = (function(ARR_PROTO) {
		return function(arrlike) {
			return ARR_PROTO.slice.call(arrlike, 1);
		};
	}(Array.prototype));

	Function.prototype.define = function(prop, desc) {
		Object.defineProperty(this.prototype, prop, desc);
	};

	return {
		slice: _slice,
		indexOf: _indexOf,
		parseCurve: function(str, prefix) {
			return str.replace(prefix, '')
						.replace(_CURVE_PARSER, '')
						.split(',')
						.map(function(i) {
							return parseFloat(i);
						});
		},

		now: Date.now || function() {
			return new Date().getTime();
		},

		round: function(value, decimals) {
			var d = Math.pow(10, decimals);
			return Math.round(value * d) / d;
		},

		extend: function() {
			var args = _slice(arguments),
				base = args[0],
				ref = args.slice(1),
				idx = 0, length = ref.length,
				key;
			for (; idx < length; idx++) {
				obj = ref[idx];
				for (key in obj) {
					value = obj[key];
					base[key] = value;
				}
			}
			return base;
		}
	};

}(window, document));