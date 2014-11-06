// plugin
flux.plugin('animate', function() {
    // will add to Animator.prototype, wrap the fn and return this for chaining
});

// jquery plugin
// will change plugin

// spring
flux.spring({ x: 0 })
    .transform.from({  })
    .transform.to({  })
    .set({
        tension: 80,
        friction: 15,
        velocity: 1000
    })
    .to({ x: 50 })
    .repeat(Infinity)
    .yoyo()
    .on('update', function(obj, spring) {
        // obj.x

        // spring.matrix.toString()
        // spring.matrix.val()
    })
    .start();

// tween : obj
flux.tween({ x: 0 })
    .to({ x: 50 })
    .on('update', function(obj) {
        // obj. === elem
        // obj.x
    })
    .on('start', function() {})
    .on('stop', function() {})
    .on('complete', function() {})
    .start();

// tween : elem
flux.tween(document.body)
    .to({ x: 50 })
    .duration(500)
    .animate() // plugin instantiation
    .on('update', function(obj, transform) {
        // elem === this
        // obj.x
    })
    .start();

// tween : elements
flux.tween(document.body)
    .to({ x: 50 })
    .animate() // plugin instantiation
    .on('update', function(obj, tween) {
        // obj.x

        // tween.elem
        // tween.matrix.toString()
        // tween.matrix.val()
    })
    .start();
