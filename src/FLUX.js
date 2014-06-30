var prevFlux = window.FLUX;

var FLUX = {
	Tween: require('./animators/FluxTween'),
	Spring: require('./animators/FluxSpring'),
	
	Easing: require('./Easing'),
	update: require('./loop').update,

	noConflict: function() {
		window.FLUX = prevFlux;
		return FLUX;
	}
};

module.exports = window.FLUX = FLUX;