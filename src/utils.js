var toString = {}.toString;

module.exports = {
	noop: function() {},

	isArrayLike: function(obj) {
		return (!!obj && obj.length === +obj.length);
	},

	isElement: function(obj) {
		return !!(obj && obj.nodeType === 1);
	},

	isString: function(obj) {
		return toString.call(obj) === '[object String]';
	},

	isNumber: function(obj) {
		return toString.call(obj) === '[object Number]';
	},

	hasSize: function(obj) {
		if (!obj) { return false; }
		for (var key in obj) { return true; }
		return false;
	},

	mapOver: function(arr, iterator, result) {
		var idx = 0, length = arr.length;
		for (; idx < length; idx++) {
			result[idx] = iterator(arr[idx], idx);
		}
		return result;
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