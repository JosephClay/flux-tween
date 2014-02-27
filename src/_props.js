var _props = {
	animationEvent: _utils.keyValTest({
		'-webkit-animation': 'webkitAnimationEnd',
		'-moz-animation': 'animationend',
		'-o-animation': 'oAnimationEnd',
		'-ms-animation': 'msAnimationEnd',
		'animation': 'animationend'
	}),

	transform: _utils.propTest([
		'transform',
		'msTransform',
		'oTransform',
		'mozTransform',
		'webkitTransform'
	]),

	transformOrigin: _utils.propTest([
		'transformOrigin',
		'msTransformOrigin',
		'oTransformOrigin',
		'mozTransformOrigin',
		'webkitTransformOrigin'
	]),
};