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

// TODO: Dont assign to window after going to rq build
return (module.exports = window.FLUX = FLUX);