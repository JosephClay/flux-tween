(function() {

	var tick = function(time) {
		stats.begin();

		requestAnimationFrame(tick);
		flux.update(time);

		stats.end();
	};

	var init = function() {

		var target = document.getElementById('target');

		target.appendChild(createGraph('Linear.None', flux.easing.linear.none));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Quadratic.In', flux.easing.quadratic.in));
		target.appendChild(createGraph('Quadratic.Out', flux.easing.quadratic.out));
		target.appendChild(createGraph('Quadratic.InOut', flux.easing.quadratic.inOut));

		target.appendChild(createGraph('Cubic.In', flux.easing.cubic.in));
		target.appendChild(createGraph('Cubic.Out', flux.easing.cubic.out));
		target.appendChild(createGraph('Cubic.InOut', flux.easing.cubic.inOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Quartic.In', flux.easing.quartic.in));
		target.appendChild(createGraph('Quartic.Out', flux.easing.quartic.out));
		target.appendChild(createGraph('Quartic.InOut', flux.easing.quartic.inOut));

		target.appendChild(createGraph('Quintic.In', flux.easing.quintic.in));
		target.appendChild(createGraph('Quintic.Out', flux.easing.quintic.out));
		target.appendChild(createGraph('Quintic.InOut', flux.easing.quintic.inOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Sinusoidal.In', flux.easing.sinusoidal.in));
		target.appendChild(createGraph('Sinusoidal.Out', flux.easing.sinusoidal.out));
		target.appendChild(createGraph('Sinusoidal.InOut', flux.easing.sinusoidal.inOut));

		target.appendChild(createGraph('Exponential.In', flux.easing.exponential.in));
		target.appendChild(createGraph('Exponential.Out', flux.easing.exponential.out));
		target.appendChild(createGraph('Exponential.InOut', flux.easing.exponential.inOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Circular.In', flux.easing.circular.in));
		target.appendChild(createGraph('Circular.Out', flux.easing.circular.out));
		target.appendChild(createGraph('Circular.InOut', flux.easing.circular.inOut));

		target.appendChild(createGraph('Elastic.In', flux.easing.elastic.in));
		target.appendChild(createGraph('Elastic.Out', flux.easing.elastic.out));
		target.appendChild(createGraph('Elastic.InOut', flux.easing.elastic.inOut));

		target.appendChild(document.createElement('br'));

		target.appendChild(createGraph('Back.In', flux.easing.back.in));
		target.appendChild(createGraph('Back.Out', flux.easing.back.out));
		target.appendChild(createGraph('Back.InOut', flux.easing.back.inOut));

		target.appendChild(createGraph('Bounce.In', flux.easing.bounce.in));
		target.appendChild(createGraph('Bounce.Out', flux.easing.bounce.out));
		target.appendChild(createGraph('Bounce.InOut', flux.easing.bounce.inOut));
	};

	requestAnimationFrame(tick);

	setTimeout(function() { init(); }, 1000);

}());
