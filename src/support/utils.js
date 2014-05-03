module.exports = {
	exists: function(obj) {
		return (obj !== null && obj !== undefined);
	},

	slice: (function(_ARR_PROTO) {
		return function(arrlike) {
			return _ARR_PROTO.slice.call(arrlike);
		};
	}(Array.prototype)),

	extend: function() {
		var args = arguments,
			obj = args[0],
			idx = 1, length = args.length;

		if (!obj) { return obj; }

		for (; idx < length; idx++) {
			var source = args[idx];
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		}

		return obj;
	},

	round: function(value, decimals) {
		var d = Math.pow(10, decimals);
		return Math.round(value * d) / d;
	}
};