var _div = document.createElement('div');

module.exports = {
	keyVal: function(obj) {
		var key;
		for (key in obj) {
			if (_div.style[key] !== undefined) {
				return obj[key];
			}
		}

		return '';
	},

	prop: function(arr) {
		var idx = arr.length;
		while (idx--) {
			if (_div.style[arr[idx]] !== undefined) {
				return arr[idx];
			}
		}

		return '';
	}
};