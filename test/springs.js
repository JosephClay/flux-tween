(function() {
	
	var tick = function(time) {
		stats.begin();
		
		FLUX.update(time);
		requestAnimationFrame(tick);
		
		stats.end();
	};

	var init = function() {

		var box = $('#Box');
		var foo = new FLUX.Spring(box)
			.set({
				tension: 80,
				friction: 15,
				velocity: 1000
			})
			.to({
				scale: 1.8,
				x: 300,
				y: 300,
				rotationX: 180,
				rotationY: 300
			})
			.delay(1000)
			.repeat(1000)
			.yoyo(true)
			.onStart(function() {
				console.log('start');
			})
			.onUpdate(function(arr, matrix) {
				arr.each(function(elem) {
					elem.applyMatrix(matrix);
				});
			})
			.onComplete(function() {
				console.log('complete');
			})
			.start();
	};

	requestAnimationFrame(tick);
	init();

}());