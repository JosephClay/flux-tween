module.exports = function(m) {

    var result = {};

    result.translation = {

        x: m.m41,
        y: m.m42,
        z: m.m43

    };

    result.scale = {

        x: Math.sqrt(m.m11 * m.m11 + m.m12 * m.m12 + m.m13 * m.m13),
        y: Math.sqrt(m.m21 * m.m21 + m.m22 * m.m22 + m.m23 * m.m23),
        z: Math.sqrt(m.m31 * m.m31 + m.m32 * m.m32 + m.m33 * m.m33)

    };

    result.rotation = {

        x: -Math.atan2(m.m32 / result.scale.z, m.m33 / result.scale.z),
        y: Math.asin(m.m31 / result.scale.z),
        z: -Math.atan2(m.m21 / result.scale.y, m.m11 / result.scale.x)

    };

    return result;

};