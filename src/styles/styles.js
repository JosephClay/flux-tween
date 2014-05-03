var _tests = require('./test/tests');

module.exports = {
	animationDuration: _tests.prop([
		'animation-duration',
		'-ms-animation-duration',
		'-o-animation-duration',
		'-moz-animation-duration',
		'-webkit-animation-duration'
	]),

	animationName: _tests.prop([
		'animation-name',
		'-ms-animation-name',
		'-o-animation-name',
		'-moz-animation-name',
		'-webkit-animation-name'
	]),

	animationKeyFrame: _tests.keyVal({
		'-webkit-animation-name': '-webkit-keyframes',
		'-moz-animation-name': '-moz-keyframes',
		'-o-animation-name': '-o-keyframes',
		'-ms-animation-name': '-ms-keyframes',
		'animation-name': 'keyframes'
	}),

	animationTimingFunction: _tests.prop([
		'animation-timing-function',
		'-ms-animation-timing-function',
		'-o-animation-timing-function',
		'-moz-animation-timing-function',
		'-webkit-animation-timing-function'
	]),

	animationFillMode: _tests.prop([
		'animation-fill-mode',
		'-ms-animation-fill-mode',
		'-o-animation-fill-mode',
		'-moz-animation-fill-mode',
		'-webkit-animation-fill-mode'
	]),

	backfaceVisibility: _tests.prop([
		'backface-visibility',
		'-ms-backface-visibility',
		'-o-backface-visibility',
		'-moz-backface-visibility',
		'-webkit-backface-visibility'
	]),

	transform: _tests.prop([
		'transform',
		'-ms-transform',
		'-o-transform',
		'-moz-transform',
		'-webkit-transform'
	])
};