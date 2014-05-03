var _ = require('../../support/utils');

var _EPSILON = 1e-6;

var UnitBezier = function(p1x, p1y, p2x, p2y) {
	this.cx = 3.0 * p1x;
	this.bx = 3.0 * (p2x - p1x) - this.cx;
	this.ax = 1.0 - this.cx - this.bx;
	this.cy = 3.0 * p1y;
	this.by = 3.0 * (p2y - p1y) - this.cy;
	this.ay = 1.0 - this.cy - this.by;
};

UnitBezier.prototype = {

	_sampleCurveX: function(t) {
		return ((this.ax * t + this.bx) * t + this.cx) * t;
	},

	_sampleCurveY: function(t) {
		return ((this.ay * t + this.by) * t + this.cy) * t;
	},

	sampleCurveDerivativeX: function(t) {
		return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
	},

	_solveCurveX: function(x) {
		var t2 = x,
			idx = 0,
			x2, d2;
		while (idx < 8) {
			x2 = this._sampleCurveX(t2) - x;
			if (Math.abs(x2) < _EPSILON) { return t2; }

			d2 = this.sampleCurveDerivativeX(t2);
			if (Math.abs(d2) < _EPSILON) { break; }

			t2 = t2 - x2 / d2;
			idx++;
		}

		var t0 = 0.0,
			t1 = 1.0;
		
		t2 = x;
		if (t2 < t0) { return t0; }
		if (t2 > t1) { return t1; }

		while (t0 < t1) {
			x2 = this._sampleCurveX(t2);
			if (Math.abs(x2 - x) < _EPSILON) { return t2; }

			if (x > x2) {
				t0 = t2;
			} else {
				t1 = t2;
			}
			t2 = (t1 - t0) * 0.5 + t0;
		}
		return t2;
	},

	solve: function(x) {
		return this._sampleCurveY(this._solveCurveX(x));
	}
};

var Bezier = function(a, b, c, d, time, fps) {
	this._curve = new UnitBezier(a, b, c, d);
	this._values = [];
	this._time = time;
	this._fps = fps;
};

_.extend(Bezier, {
	Linear: function(time, fps) {
		return new Bezier(0, 0, 1, 1, time, fps);
	},

	Ease: function(time, fps) {
		return new Bezier(0.25, 0.1, 0.25, 1, time, fps);
	},

	EaseIn: function(time, fps) {
		return new Bezier(0.42, 0, 1, 1, time, fps);
	},

	EaseOut: function(time, fps) {
		return new Bezier(0, 0, 0.58, 1, time, fps);
	},

	EaseInOut: function(time, fps) {
		return new Bezier(0.42, 0, 0.58, 1, time, fps);
	},

	create: function(Constructor, time, fps) {
		return new Constructor(time, fps);
	},

	generate: function(Constructor, time, fps) {
		var curve = new Constructor(time, fps);
		return curve.all();
	}
});

Bezier.prototype = {
	all: function() {
		var steps = ((this._time / 1000) * this._fps) - 1;
		if (steps > 3000) { throw 'Bezier: too many values'; }
		
		var step, idx;
		for (step = idx = 0; 0 <= steps ? idx <= steps : idx >= steps; step = 0 <= steps ? ++idx : --idx) {
			this._values.push(this._curve.solve(step / steps) * 100);
		}

		return this._values;
	},

	time: function() {
		return this._time;
	}
};

module.exports = Bezier;