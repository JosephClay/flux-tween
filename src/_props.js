var _props = {
	animationEvent: _keyValTest({
		'-webkit-animation': 'webkitAnimationEnd',
		'-moz-animation': 'animationend',
		'-o-animation': 'oAnimationEnd',
		'-ms-animation': 'msAnimationEnd',
		'animation': 'animationend'
	}),

	transform: _propTest([
		'transform',
		'msTransform',
		'oTransform',
		'mozTransform',
		'webkitTransform'
	]),

	transformOrigin: _propTest([
		'transformOrigin',
		'msTransformOrigin',
		'oTransformOrigin',
		'mozTransformOrigin',
		'webkitTransformOrigin'
	]),
};