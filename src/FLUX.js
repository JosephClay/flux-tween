module.exports = window.FLUX = {
	Tween: require('./animators/FluxTween'),
	Spring: require('./animators/FluxSpring'),
	
	Easing: require('./Easing'),
	update: require('./loop').update
};