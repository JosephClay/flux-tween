/*
    var MATRIX = {
        x: 0,
        y: 0,
        z: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
    };
*/

var expand = function(obj) {
    if (obj.scale !== undefined) {

        obj.scaleX = obj.scale;
        obj.scaleY = obj.scale;
        delete obj.scale;

    }

    if (obj.rotation !== undefined) {

        obj.rotationZ = obj.rotation;
        delete obj.rotation;

    }

    if (obj.rotate !== undefined) {

        obj.rotationZ = obj.rotate;
        delete obj.rotate;

    }

    return obj;
};

module.exports = function(obj) {

    if (!obj) { return obj; }

    return expand(obj);

};