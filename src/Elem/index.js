var utils = require('./utils');

var Elem = module.exports = function(elem) {

    this.elem = elem;

    // this._computedStyles

};

Elem.create = function(elem) {

    return new Elem(elem);

};

Elem.prototype = {

    calcBase: function(to) {

        var from = {},
            computedStyles = this._computedStyles = utils.getComputedStyle(this.elem);

        for (var property in to) {

            from[property] = computedStyles[property];

        }

        return from;

    },

    calcMatrix: function() {

        return utils.getComputedMatrix(this._computedStyles || utils.getComputedStyle(this.elem));

    }
};