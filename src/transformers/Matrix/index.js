var _ = require('../../utils'),

    M = require('../../matrix'),

    expandShorthand = require('./expand-shorthand'),

    Obj = require('../Obj'),

    setters = {
        x: 'setX',
        y: 'setY',
        z: 'setZ',
        scale: 'setScale',
        scaleX: 'setScaleX',
        scaleY: 'setScaleY',
        scaleZ: 'setScaleZ',
        rotation: 'setRotation',
        rotationX: 'setRotationX',
        rotationY: 'setRotationY',
        rotationZ: 'setRotationZ'
    };

var Matrix = module.exports = function() {

    // this.base;
    // this.from = {};
    // this.to   = {};

    // this.yoyo  = false;

    // this._matrix;

};

Matrix.create = function(obj) {

    return new Matrix(obj);

};

_.extend(Matrix.prototype, Obj.prototype, {

    setMatrix: function(matrix) {

        this._matrix = new M(matrix);
        this.base = _.extend(this._matrix.toObject(), this.base);
        return this;

    },

    setFrom: function(from) {

        this.base = expandShorthand(from);

        return this;

    },

    setTo: function(to) {

        this.to = expandShorthand(to);

        return this;

    },

    update: function(perc) {

        if (!this._matrix) { return this; }

        var property;

        for (property in this.base) {

            var start = this.from[property] || 0,
                end = this.to[property];

            // protect against non numeric properties.
            if (end === +end) {

                this.base[property] = start + (end - start) * perc;

            }

            this._matrix[setters[property]](this.base[property]);

        }

        return this;

    },

    start: function() {

        if (!this._matrix || ! this.to) { return this; }

        var base   = this.base || (this.base = {}),
            from   = this.from || (this.from = {}),
            repeat = this._repeat || (this._repeat = {}),
            to     = this.to,
            property;

        for (property in this.to) {

            // omit unchanged properties
            if (base[property] === undefined || to[property] === base[property]) {

                delete to[property];
                continue;

            }

            // Ensures we're using numbers, not strings
            from[property] = base[property] *= 1;

            repeat[property] = from[property] || 0;
        }

        this._matrix.transpose(this.base);

        return this;

    },

    toString: function() {

        if (!this._matrix) { return ''; }

        return this._matrix.update().toString();

    }

});