var _toString = Object.prototype.toString;

module.exports = {
	noop: function() {},

	indexOf: function(arr, value) {
		var idx = arr.length;
		while (idx--) {
			if (arr[idx] === value) {
				return idx;
			}
		}
		return -1;
	},
	
	isArrayLike: function(obj) {
		return (!!obj && obj.length === +obj.length);
	},

	isElement: function(obj) {
		return !!(obj && obj.nodeType === 1);
	},

	isString: function(obj) {
		return _toString.call(obj) === '[object String]';
	},

	isNumber: function(obj) {
		return _toString.call(obj) === '[object Number]';
	},

	exists: function(obj) {
		return (obj !== null && obj !== undefined);
	},

	map: function(arr, iterator) {
		var result = [],
			idx = 0, length = arr.length;
		for (; idx < length; idx++) {
			result[idx] = iterator(arr[idx], idx);
		}
		return result;
	},

	fastmap: function(arr, iterator, result) {
		var idx = 0, length = arr.length;
		for (; idx < length; idx++) {
			result[idx] = iterator(arr[idx], idx);
		}
		return result;
	},

	hasSize: function(obj) {
		if (!obj) { return false; }
		for (var key in obj) { return true; }
		return false;
	},

	extend: function() {
		var args = arguments,
			obj = args[0],
			idx = 1, length = args.length;

		if (!obj) { return obj; }

		for (; idx < length; idx++) {
			var source = args[idx];
			if (source) {
				var prop;
				for (prop in source) {
					obj[prop] = source[prop];
				}
			}
		}

		return obj;
	},

	now: (window.performance !== undefined && window.performance.now !== undefined) ?
		// Wrap in function to avoid illegal reference errors
		function() { return window.performance.now(); } :
		// Fallback to now
		Date.now ? Date.now : function() { return new Date().getTime(); }
};