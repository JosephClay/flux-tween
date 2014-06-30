(function() {
	
	var tick = function(time) {
		stats.begin();

		requestAnimationFrame(tick);
		FLUX.update(time);

		stats.end();
	};

	var init = function() {

		var target = document.getElementById('target');

		target.appendChild(createGraph('Linear.None', FLUX.Easing.Linear.None));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Quadratic.In', FLUX.Easing.Quadratic.In));
		target.appendChild(createGraph('Quadratic.Out', FLUX.Easing.Quadratic.Out));
		target.appendChild(createGraph('Quadratic.InOut', FLUX.Easing.Quadratic.InOut));

		target.appendChild(createGraph('Cubic.In', FLUX.Easing.Cubic.In));
		target.appendChild(createGraph('Cubic.Out', FLUX.Easing.Cubic.Out));
		target.appendChild(createGraph('Cubic.InOut', FLUX.Easing.Cubic.InOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Quartic.In', FLUX.Easing.Quartic.In));
		target.appendChild(createGraph('Quartic.Out', FLUX.Easing.Quartic.Out));
		target.appendChild(createGraph('Quartic.InOut', FLUX.Easing.Quartic.InOut));

		target.appendChild(createGraph('Quintic.In', FLUX.Easing.Quintic.In));
		target.appendChild(createGraph('Quintic.Out', FLUX.Easing.Quintic.Out));
		target.appendChild(createGraph('Quintic.InOut', FLUX.Easing.Quintic.InOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Sinusoidal.In', FLUX.Easing.Sinusoidal.In));
		target.appendChild(createGraph('Sinusoidal.Out', FLUX.Easing.Sinusoidal.Out));
		target.appendChild(createGraph('Sinusoidal.InOut', FLUX.Easing.Sinusoidal.InOut));

		target.appendChild(createGraph('Exponential.In', FLUX.Easing.Exponential.In));
		target.appendChild(createGraph('Exponential.Out', FLUX.Easing.Exponential.Out));
		target.appendChild(createGraph('Exponential.InOut', FLUX.Easing.Exponential.InOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Circular.In', FLUX.Easing.Circular.In));
		target.appendChild(createGraph('Circular.Out', FLUX.Easing.Circular.Out));
		target.appendChild(createGraph('Circular.InOut', FLUX.Easing.Circular.InOut));

		target.appendChild(createGraph('Elastic.In', FLUX.Easing.Elastic.In));
		target.appendChild(createGraph('Elastic.Out', FLUX.Easing.Elastic.Out));
		target.appendChild(createGraph('Elastic.InOut', FLUX.Easing.Elastic.InOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Back.In', FLUX.Easing.Back.In));
		target.appendChild(createGraph('Back.Out', FLUX.Easing.Back.Out));
		target.appendChild(createGraph('Back.InOut', FLUX.Easing.Back.InOut));

		target.appendChild(createGraph('Bounce.In', FLUX.Easing.Bounce.In));
		target.appendChild(createGraph('Bounce.Out', FLUX.Easing.Bounce.Out));
		target.appendChild(createGraph('Bounce.InOut', FLUX.Easing.Bounce.InOut));

	};

	requestAnimationFrame(tick);

	setTimeout(function() { init(); }, 1000);

}());
