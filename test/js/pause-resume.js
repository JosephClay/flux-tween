(function() {

    var tick = function(time) {
        stats.begin();

        requestAnimationFrame(tick);
        flux.update(time);

        stats.end();
    };

    var target = $('#target');

    var tween = flux.tween({ left: 50 })
        .to({ left: 200 })
        .duration(2000)
        .ease()
        .yoyo()
        .repeat(Infinity)
        .on('update', function(obj) {
            target.css(obj);
        })
        .start();

    var target2 = $('#target2')[0];
    var spring = flux.spring(target2)
        .transform.to({ x: 200 })
        .yoyo()
        .repeat(Infinity)
        .on('update', function(obj, spring) {
            spring.elem.style[flux.transform] = spring.matrix.toString();
        })
        .start();

    var isPaused = false;
    setInterval(function() {
        if (isPaused) {
            tween.resume();
            spring.resume();
        } else {
            tween.pause();
            spring.pause();
        }

        isPaused = !isPaused;
    }, 1000);

    requestAnimationFrame(tick);

}());