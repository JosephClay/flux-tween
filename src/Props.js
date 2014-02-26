// TODO: IE prefixes
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
			'-webkit-animation': 'webkitAnimationEnd',
			'animation': 'animationend',
			'-moz-animation': 'animationend',
			'-o-animation': 'oAnimationEnd'
		}),

		transform: _propTest([
			'mozTransform',
			'oTransform',
			'msTransform',
			'transform',
			'webkitTransform'
		]),

		transformOrigin: _propTest([
			'mozTransformOrigin',
			'oTransformOrigin',
			'msTransformOrigin',
			'transformOrigin',
			'webkitTransformOrigin'
		]),

		animationDuration: _keyValTest({
			'-webkit-animation-duration': 'webkitAnimationDuration',
			'animation-duration': 'animationDuration',
			'-moz-animation-duration': 'mozAnimationDuration',
			'-o-animation-duration': 'oAnimationDuration'
		}),

		animationName: _keyValTest({
			'-webkit-animation-name': 'webkitAnimationName',
			'animation-name': 'animationName',
			'-moz-animation-name': 'mozAnimationName',
			'-o-animation-name': 'oAnimationName'
		}),

		animationKeyFrame: _keyValTest({
			'-webkit-keyframes': 'webkitAnimationName',
			'keyframes': 'animationName',
			'-moz-keyframes': 'mozAnimationName',
			'-o-keyframes': 'oAnimationName'
		}),

		animationTimingFunction: _keyValTest({
			'-webkit-animation-timing-function': 'webkitAnimationTimingFunction',
			'animation-timing-function': 'animationTimingFunction',
			'-moz-animation-timing-function': 'mozAnimationTimingFunction',
			'-o-animation-timing-function': 'oAnimationTimingFunction'
		}),

		animationFillMode: _keyValTest({
			'-webkit-animation-fill-mode': 'webkitAnimationFillMode',
			'animation-fill-mode': 'animationFillMode',
			'-moz-animation-fill-mode': 'mozAnimationFillMode',
			'-o-animation-fill-mode': 'oAnimationFillMode'
		}),

		backfaceVisibility: _keyValTest({
			'-webkit-backface-visibility': 'webkitBackfaceVisibility',
			'backface-visibility': 'backfaceVisibility',
			'-moz-backface-visibility': 'mozBackfaceVisibility',
			'-o-backface-visibility': 'oBackfaceVisibility'
		})
	};

}());
