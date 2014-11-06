(function() {

	var tick = function(time) {
		stats.begin();

		flux.update(time);
		requestAnimationFrame(tick);

		stats.end();
	};

	requestAnimationFrame(tick);

	var update = function(obj, spring) {
		spring.elem.style[flux.transform] = spring.matrix.toString();
	};

	var SPRING = {
		tension: 80,
		friction: 15,
		velocity: 1000
	};

	flux.spring($('[data-x]')[0])
		.set(SPRING)
		.transform.to({ x: 50 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-y]')[0])
		.set(SPRING)
		.transform.to({ y: -50 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-z]')[0])
		.set(SPRING)
		.transform.to({ z: -200 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-scale-y]')[0])
		.set(SPRING)
		.transform.to({ scaleY: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-scale-x]')[0])
		.set(SPRING)
		.transform.to({ scaleX: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-scale-z]')[0])
		.set(SPRING)
		.transform.to({ scaleZ: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-scale]')[0])
		.set(SPRING)
		.transform.to({ scale: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-rotate]')[0])
		.set(SPRING)
		.transform.to({ rotate: -360 * 2 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-rotate-x]')[0])
		.set(SPRING)
		.transform.to({ rotationX: 90 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-rotate-y]')[0])
		.set(SPRING)
		.transform.to({ rotationY: 90 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-rotate-z]')[0])
		.set(SPRING)
		.transform.to({ rotationZ: 90 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-x-from]')[0])
		.set(SPRING)
		.transform.from({ x: -50 })
		.transform.to({ x: 50 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-y-from]')[0])
		.set(SPRING)
		.transform.from({ y: 50 })
		.transform.to({ y: -50 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-z-from]')[0])
		.set(SPRING)
		.transform.from({ z: 50 })
		.transform.to({ z: -50 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-scale-y-from]')[0])
		.set(SPRING)
		.transform.from({ scaleY: 0.5 })
		.transform.to({ scaleY: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-scale-x-from]')[0])
		.set(SPRING)
		.transform.from({ scaleX: 0.5 })
		.transform.to({ scaleX: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-scale-z-from]')[0])
		.set(SPRING)
		.transform.from({ scaleZ: 0.5 })
		.transform.to({ scaleZ: 1.8 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-rotate-x-from]')[0])
		.set(SPRING)
		.transform.from({ rotationX: -45 })
		.transform.to({ rotationX: 90 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-rotate-y-from]')[0])
		.set(SPRING)
		.transform.from({ rotationY: -45 })
		.transform.to({ rotationY: 90 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();

	flux.spring($('[data-rotate-z-from]')[0])
		.set(SPRING)
		.transform.from({ rotationZ: -45 })
		.transform.to({ rotationZ: 90 })
		.repeat(Infinity)
		.yoyo()
		.on('update', update)
		.start();
}());