(function() {

    var tick = function(time) {
        stats.begin();

        requestAnimationFrame(tick);
        flux.update(time);

        stats.end();
    };

    var transformations = [
        '-webkit-transform',
        '-ms-transform',
        'transform'
    ];
    flux.plugin('willChange', function() {

        var inst = this,
            elem = inst.elem;

        if (!elem) { return; }

        var style = elem.style;

        inst.on('start', function() {

            var changes = inst.obj.to ? Object.keys(inst.obj.to) : [];
            if (inst.matrix) { changes = changes.concat(transformations); }

            style.willChange = changes.join(', ');

        });

        inst.on('complete', function() {

            style.willChange = '';

        });

    });

    flux.plugin('dio', function() {

        var inst = this;

        inst.on('update', function(obj, tween) {
            dio.write(function() {
                inst.trigger('dio', obj, tween);
            });
        });

    });

    var elem = $('#target')[0];
    flux.spring(elem)
        .transform.to({ x: 200, y: 200 })
        .yoyo()
        .repeat(Infinity)
        .willChange()
        .dio().on('dio', flux.applyMatrix)
        .start();

    requestAnimationFrame(tick);

}());
