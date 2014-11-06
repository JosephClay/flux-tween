var WebMatrix = require('xcssmatrix'),

    transform = require('../transform-prop');

module.exports = {

    getComputedMatrix: function(computedStyles) {

        return new WebMatrix(computedStyles[transform]);

    },

    getComputedStyle: function(elem) {

        return document.defaultView.getComputedStyle(elem);

    }

};