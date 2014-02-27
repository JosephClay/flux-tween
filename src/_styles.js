var _styles = {
	animationDuration: _utils.propTest([
		'animation-duration',
		'-ms-animation-duration',
		'-o-animation-duration',
		'-moz-animation-duration',
		'-webkit-animation-duration'
	]),

	animationName: _utils.propTest([
		'animation-name',
		'-ms-animation-name',
		'-o-animation-name',
		'-moz-animation-name',
		'-webkit-animation-name'
	]),

	animationKeyFrame: _utils.keyValTest({
		'-webkit-animation-name': '-webkit-keyframes',
		'-moz-animation-name': '-moz-keyframes',
		'-o-animation-name': '-o-keyframes',
		'-ms-animation-name': '-ms-keyframes',
		'animation-name': 'keyframes'
	}),

	animationTimingFunction: _utils.propTest([
		'animation-timing-function',
		'-ms-animation-timing-function',
		'-o-animation-timing-function',
		'-moz-animation-timing-function',
		'-webkit-animation-timing-function'
	]),

	animationFillMode: _utils.propTest([
		'animation-fill-mode',
		'-ms-animation-fill-mode',
		'-o-animation-fill-mode',
		'-moz-animation-fill-mode',
		'-webkit-animation-fill-mode'
	]),

	backfaceVisibility: _utils.propTest([
		'backface-visibility',
		'-ms-backface-visibility',
		'-o-backface-visibility',
		'-moz-backface-visibility',
		'-webkit-backface-visibility'
	]),

	transform: _utils.propTest([
		'transform',
		'-ms-transform',
		'-o-transform',
		'-moz-transform',
		'-webkit-transform'
	])
};