var _ = require('../support/utils'),
	_props = require('../styles/props'),
	_animatables = require('../styles/animatables'),
	
	Matrix = require('../Matrix'),
	Animation = require('./Animation'),
	EventEmitter = require('../EventEmitter'),
	BezierCurve = require('./curves/BezierCurve'),
	SpringCurve = require('./curves/SpringCurve');

var _defaults = {
		timeSpeedFactor: 1,
		roundingDecimals: 5,
		fps: 60
	},
	_PREFIX = 'animationjs-animation-',
	_id = 0;

var _animationKeys = function(obj) {
	var keys = [],
		key;
	for (key in obj) {
		keys.push(parseFloat(key));
	}
	return keys.sort(function(a, b) { return a - b; });
};

var Fallback = function(view, options) {
	EventEmitter.call(this);

	this.view = view;
	this.callback = options.callback;
	this.precision = options.precision || _defaults.fps;
	this.origin = options.origin;
	this.time = options.time || 1000;
	this.curve = options.curve || 'linear';
	
	this._to = options.properties;
	this._from = view.properties;
	this._id = (_id += 1);
	this._animationName = _PREFIX + this._id;
	this._currentProperties = {};
	this._spring = options.spring;
	this._ease = options.ease;
	this._curve = this._parseCurve(options);
	this._curveValues = this._curve.all();
	this._totalTime = this._curve.time();

	if (this.origin) { this.view.style[_props.transformOrigin] = this.origin; }
};

_.extend(Fallback.prototype, Animation.prototype, {

	start: function() {
		this._aggregateCurrentProperties();
		
		var numOfChanges = this._omitUnchangedProperties();
		if (!numOfChanges) { return; }
		
		var keyframes = this._generateKeyframeCss();
		this._animate(keyframes);
	},

	_animate: function(keyframes) {
		var self = this,
			animationKeys = _animationKeys(keyframes),
			index = 0;

		this._tween = new TWEEN.Tween({ key: animationKeys[0] })
							.to({ key: animationKeys }, this._totalTime * 1000)
							.onUpdate(function() {

								var key = animationKeys[index];
									keyframe = keyframes[key];
								if (!keyframe) { return; }
								self._applyKeyframeStyles(keyframe);

								index += 1;
							})
							.onComplete(function() {
								var lastIndex = animationKeys.length - 1,
									key = animationKeys[lastIndex];
									keyframe = keyframes[key];
								self._applyKeyframeStyles(keyframe);

								self._cleanup();
							})
							.interpolation(TWEEN.Interpolation.Linear)
							.easing(TWEEN.Easing.Linear.None)
							.start();
	},

	_applyKeyframeStyles: function(keyframe) {
		self.view.style[_props.transform] = keyframe.transform;

		var key;
		for (key in keyframe.css) {
			self.view.style[key] = keyframe.css[key];
		}
	},

	_cleanup: function(completed) {
		this._tween = null;
		this.view.properties = this._to;

		if (this.callback) { this.callback(this); }
		return this.emit('end');
	},

	_generateKeyframeCss: function() {
		var keyFrames = this._generateKeyframes(),
			obj = {},
			matrix = new Matrix();
		
		var position, values, propertyName, unit, idx;
		for (position in keyFrames) {
			values = keyFrames[position];				

			var styles = {};

			idx = _animatables.matrix.length;
			while (idx--) {
				propertyName = _animatables.matrix[idx];
				matrix[propertyName] = values[propertyName];
			}

			styles.transform = matrix.css();

			styles.css = {};
			for (propertyName in _animatables.css) {
				unit = _animatables.css[propertyName];
				if (!_.exists(values[propertyName])) { continue; } // Avoid NaNs and nully values from working with undefined values
				styles.css[propertyName] = (_.round(values[propertyName], _defaults.roundingDecimals)) + unit;
			}

			obj[position] = styles;
		}

		return obj;
	},

	_parseCurve: function(config) {
		var factor = _defaults.timeSpeedFactor,
			precision = this.precision * factor,
			time = this.time * factor;

		if (config.spring) {
			var spring = config.spring;
			return SpringCurve.create(spring.tension, spring.friction, spring.velocity, precision);
		}

		if (config.curve) {
			var curve = config.curve;
			if (curve === 'linear') {
				
				return BezierCurve.create(BezierCurve.Linear, this.precision, time);

			} else if (curve === 'ease') {
				
				return BezierCurve.create(BezierCurve.Ease, this.precision, time);

			} else if (curve === 'ease-in') {
				
				return BezierCurve.create(BezierCurve.EaseIn, this.precision, time);

			} else if (curve === 'ease-out') {
				
				return BezierCurve.create(BezierCurve.EaseOut, this.precision, time);

			} else if (curve === 'ease-in-out') {
				
				return BezierCurve.create(BezierCurve.EaseInOut, this.precision, time);

			}
		}

		return BezierCurve.create(BezierCurve.Linear, this.precision, this.time);
	}
});

module.exports = Fallback;