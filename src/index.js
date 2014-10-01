require('./polyfills/date-now');

var previousFlux = window.FLUX,

	FLUX = {

		Tween: require('./animators/FluxTween'),
		Spring: require('./animators/FluxSpring'),

		Easing: require('./Easing'),

		update: require('./loop').update,

		noConflict: function() {

			window.FLUX = previousFlux;
			return FLUX;

		}
	};

return (module.exports = FLUX);