var _ = require('./utils'),

    loop = require('./loop'),

    Animator  = require('./animators/Animator'),
    Tween     = require('./animators/FluxTween'),
    Spring    = require('./animators/FluxSpring'),
    
    transform = require('./transform-prop');

var flux = module.exports = _.extend(function(obj) {

    return Animator.create(obj);

}, {
	transform: transform,

	tween: function(obj) {

        return Tween.create(obj);

    },
	spring: function(obj) {

        return Spring.create(obj);

    },

	easing: require('./easing'),

    update: loop.update,
	tick: loop.update,

    applyMatrix: function(obj, tween) {
        var elem = tween.elem,
            matrix = tween.matrix;

        if (!elem || !matrix) { return; }

        elem.style[transform] = matrix.toString();
    },

    plugin: function(name, fn) {

        Tween.prototype[name] = Spring.prototype[name] = function() {

            fn.apply(this, arguments);
            return this;

        };

        return flux;

    }
});