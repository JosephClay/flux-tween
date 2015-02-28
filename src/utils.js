var toString = ({}).toString;

module.exports = {
	noop: function() {},

	isElement: function(obj) {
		return !!(obj && +obj.nodeType === obj.nodeType);
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