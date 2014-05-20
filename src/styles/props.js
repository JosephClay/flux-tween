var _tests = require('./test/tests');

module.exports = {
	animationEvent: _tests.keyVal({
		'-webkit-animation': 'webkitAnimationEnd',
		'-moz-animation': 'animationend',
		'-o-animation': 'oAnimationEnd',
		'-ms-animation': 'MSAnimationEnd',
		'animation': 'animationend'
	}),

	transform: _tests.prop([
		'transform',
		'msTransform',
		'oTransform',
		'mozTransform',
		'webkitTransform'
	]),

	transformOrigin: _tests.prop([
		'transformOrigin',
		'msTransformOrigin',
		'oTransformOrigin',
		'mozTransformOrigin',
		'webkitTransformOrigin'
	]),
};