(function() {
	
	var tick = function(time) {
		stats.begin();
		
		FLUX.update(time);
		requestAnimationFrame(tick);
		
		stats.end();
	};

	requestAnimationFrame(tick);

	var _SPRING = {
		tension: 80,
		friction: 15,
		velocity: 1000
	};

	FLUX.Spring($('[data-x]'))
		.set(_SPRING)
		.to({ x: 50 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();
		
	FLUX.Spring($('[data-y]'))
		.set(_SPRING)
		.to({ y: -50 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-z]'))
		.set(_SPRING)
		.to({ z: -50 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-scale-y]'))
		.set(_SPRING)
		.to({ scaleY: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-scale-x]'))
		.set(_SPRING)
		.to({ scaleX: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-scale-z]'))
		.set(_SPRING)
		.to({ scaleZ: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-scale]'))
		.set(_SPRING)
		.to({ scale: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-rotate-x]'))
		.set(_SPRING)
		.to({ rotationX: 90 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-rotate-y]'))
		.set(_SPRING)
		.to({ rotationY: 90 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-rotate-z]'))
		.set(_SPRING)
		.to({ rotationZ: 90 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-opacity]'))
		.set(_SPRING)
		.from({ opacity: 0 })
		.to({ opacity: 1 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				$(elem.element()).css(elem.value());
			});
		})
		.start();

	FLUX.Spring($('[data-x-from]'))
		.set(_SPRING)
		.from({ x: -50 })
		.to({ x: 50 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-y-from]'))
		.set(_SPRING)
		.from({ y: 50 })
		.to({ y: -50 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-z-from]'))
		.set(_SPRING)
		.from({ z: 50 })
		.to({ z: -50 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-scale-y-from]'))
		.set(_SPRING)
		.from({ scaleY: 0.5 })
		.to({ scaleY: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-scale-x-from]'))
		.set(_SPRING)
		.from({ scaleX: 0.5 })
		.to({ scaleX: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-scale-z-from]'))
		.set(_SPRING)
		.from({ scaleZ: 0.5 })
		.to({ scaleZ: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-rotate-x-from]'))
		.set(_SPRING)
		.from({ rotationX: -45 })
		.to({ rotationX: 90 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-rotate-y-from]'))
		.set(_SPRING)
		.from({ rotationY: -45 })
		.to({ rotationY: 90 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

	FLUX.Spring($('[data-rotate-z-from]'))
		.set(_SPRING)
		.from({ rotationZ: -45 })
		.to({ rotationZ: 90 })
		.repeat(Infinity)
		.yoyo()
		.onUpdate(function(arr) {
			arr.each(function(elem) {
				elem.applyMatrix();
			});
		})
		.start();

}());