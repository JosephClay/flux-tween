var Props = (function() {
	
	var _FAKE_EL = document.createElement('fakeelement');

	var _keyValTest = function(obj) {
		var key;
		for (key in obj) {
			if (_FAKE_EL.style[key] !== undefined) {
				return obj[key];
			}
		}

		return '';
	};

	var _propTest = function(arr) {
		var idx = arr.length;
		while (idx--) {
			if (_FAKE_EL.style[arr[idx]] !== undefined) {
				return arr[idx];
			}
		}

		return '';
	};

	return {
		animationEvent: _keyValTest({
			'animation': 'animationend',
			'-o-animation': 'oAnimationEnd',
			'-moz-animation': 'animationend',
			'-webkit-animation': 'webkitAnimationEnd'
		}),

		transformProperty: _propTest([
			'MozTransform',
			'OTransform',
			'msTransform',
			'transform',
			'WebkitTransform'
		]),

		transformOriginProperty: _propTest([
			'MozTransformOrigin',
			'OTransformOrigin',
			'msTransformOrigin',
			'transformOrigin',
			'WebkitTransformOrigin'
		])
	};

}());