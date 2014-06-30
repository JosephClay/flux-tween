var _div = document.createElement('div'),

	_selectProp = function(arr) {
		var idx = arr.length;
		while (idx--) {
			if (_div.style[arr[idx]] !== undefined) {
				return arr[idx];
			}
		}

		return '';
	};

module.exports = {
	transform: _selectProp([
		'transform',
		'msTransform',
		'oTransform',
		'mozTransform',
		'webkitTransform'
	])
};

_div = null;