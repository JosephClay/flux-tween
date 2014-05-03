var _styles = require('../styles/styles');

module.exports = {
	canHwAccel: (_styles.animationDuration && _styles.animationKeyFrame && _styles.animationName && _styles.animationTimingFunction),
	canAnimate: !!_styles.transform
};