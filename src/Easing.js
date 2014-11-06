// from the amazing sole
// https://github.com/sole/tween.js/

var PI = Math.PI,
	HALF_PI = PI / 2;

var linearNone = function(k) {

		return k;

	},

	quadraticIn = function(k) {

		return k * k;

	},

	quadraticOut = function(k) {

		return k * (2 - k);

	},

	quadraticInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k; }
		return - 0.5 * (--k * (k - 2) - 1);

	},

	cubicIn = function(k) {

		return k * k * k;

	},

	cubicOut = function(k) {

		return --k * k * k + 1;

	},

	cubicInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k * k; }
		return 0.5 * ((k -= 2) * k * k + 2);

	},

	quarticIn = function(k) {

		return k * k * k * k;

	},

	quarticOut = function(k) {

		return 1 - (--k * k * k * k);

	},

	quarticInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k * k * k; }
		return - 0.5 * ((k -= 2) * k * k * k - 2);

	},

	quinticIn = function(k) {

		return k * k * k * k * k;

	},

	quinticOut = function(k) {

		return --k * k * k * k * k + 1;

	},

	quinticInOut = function(k) {

		if ((k *= 2) < 1) { return 0.5 * k * k * k * k * k; }
		return 0.5 * ((k -= 2) * k * k * k * k + 2);

	},

	sinusoidalIn = function(k) {

		return 1 - Math.cos(k * HALF_PI);

	},

	sinusoidalOut = function(k) {

		return Math.sin(k * HALF_PI);

	},

	sinusoidalInOut = function(k) {

		return 0.5 * (1 - Math.cos(PI * k));

	},

	exponentialIn = function(k) {

		return k === 0 ? 0 : Math.pow(1024, k - 1);

	},

	exponentialOut = function(k) {

		return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

	},

	exponentialInOut = function(k) {

		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if ((k *= 2) < 1) { return 0.5 * Math.pow(1024, k - 1); }
		return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

	},

	circularIn = function(k) {

		return 1 - Math.sqrt(1 - k * k);

	},

	circularOut = function(k) {

		return Math.sqrt(1 - (--k * k));

	},

	circularInOut = function(k) {

		if ((k *= 2) < 1) { return - 0.5 * (Math.sqrt(1 - k * k) - 1); }
		return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

	},

	elasticIn = function(k) {

		var s, a = 0.1, p = 0.4;
		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if (!a || a < 1) {
			a = 1; s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * PI);
		}
		return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * PI) / p));

	},

	elasticOut = function(k) {

		var s, a = 0.1, p = 0.4;
		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if (!a || a < 1) {
			a = 1; s = p / 4;
		} else {
			 s = p * Math.asin(1 / a) / (2 * PI);
		}
		return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * PI) / p) + 1);

	},

	elasticInOut = function(k) {

		var s, a = 0.1, p = 0.4;
		if (k === 0) { return 0; }
		if (k === 1) { return 1; }
		if (!a || a < 1) {
			a = 1; s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * PI);
		}
		if ((k *= 2) < 1) { return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * PI) / p)); }
		return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * PI) / p) * 0.5 + 1;

	},

	backIn = function(k) {

		var s = 1.70158;
		return k * k * ((s + 1) * k - s);

	},

	backOut = function(k) {

		var s = 1.70158;
		return --k * k * ((s + 1) * k + s) + 1;

	},

	backInOut = function(k) {

		var s = 1.70158 * 1.525;
		if ((k *= 2) < 1) { return 0.5 * (k * k * ((s + 1) * k - s)); }
		return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

	},

	bounceIn = function(k) {

		return 1 - bounceOut(1 - k);

	},

	bounceOut = function(k) {

		if (k < (1 / 2.75)) {

			return 7.5625 * k * k;

		} else if (k < (2 / 2.75)) {

			return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;

		} else if (k < (2.5 / 2.75)) {

			return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;

		} else {

			return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;

		}

	},

	bounceInOut = function(k) {

		if (k < 0.5) { return bounceIn(k * 2) * 0.5; }
		return bounceOut(k * 2 - 1) * 0.5 + 0.5;

	};

module.exports = {

	linear: {

		none: linearNone

	},

	quadratic: {

		in: quadraticIn,

		out: quadraticOut,

		inOut: quadraticInOut

	},

	cubic: {

		in: cubicIn,

		out: cubicOut,

		inOut: cubicInOut

	},

	quartic: {

		in: quarticIn,

		out: quarticOut,

		inOut: quarticInOut

	},

	quintic: {

		in: quinticIn,

		out: quinticOut,

		inOut: quinticInOut

	},

	sinusoidal: {

		in: sinusoidalIn,

		out: sinusoidalOut,

		inOut: sinusoidalInOut

	},

	exponential: {

		in: exponentialIn,

		out: exponentialOut,

		inOut: exponentialInOut

	},

	circular: {

		in: circularIn,

		out: circularOut,

		inOut: circularInOut

	},

	elastic: {

		in: elasticIn,

		out: elasticOut,

		inOut: elasticInOut

	},

	back: {

		in: backIn,

		out: backOut,

		inOut: backInOut,

	},

	bounce: {

		in: bounceIn,

		out: bounceOut,

		inOut: bounceInOut

	}

};
