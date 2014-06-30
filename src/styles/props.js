var _div = document.createElement('div'),

	_testProps = function(arr) {
		var idx = arr.length;
		while (idx--) {
			if (_div.style[arr[idx]] !== undefined) {
				return arr[idx];
			}
		}

		return '';
	};

module.exports = {
	transform: _testProps([
		'transform',
		'msTransform',
		'oTransform',
		'mozTransform',
		'webkitTransform'
	])
};

_div = null;