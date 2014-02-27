var Animation = (function() {
	
	var _defaults = {
			timeSpeedFactor: 1,
			roundingDecimals: 5,
			fps: 60
		},
		_PREFIX = 'animationjs-animation-',
		_id = 0;

	var Animation = function(view, options) {
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
		this._cleanup = this._cleanup.bind(this);
		this._animationName = _PREFIX + this._id;
		this._currentProperties = {};
		this._spring = options.spring;
		this._ease = options.ease;
		this._curveValues = this._parseCurve(options);
		this._totalTime = (this._curveValues.length / this.precision) * 1000;

		if (this.origin) { this.view.style[_props.transformOrigin] = this.origin; }
	};

	_utils.extend(Animation.prototype, EventEmitter.prototype, {

		start: function() {
			
			this._aggregateCurrentProperties();
			
			var numOfChanges = this._omitUnchangedProperties();
			if (!numOfChanges) { return; }
			
			this._styleTag = _css.addStyle(
				this._generateKeyframeCss() + ' .' + this._animationName + ' { ' +
					_styles.animationDuration + ': ' + (this._totalTime / 1000) + 's;' +
					_styles.animationName + ': ' + this._animationName + ';' +
					_styles.animationTimingFunction + ': linear;' +
					_styles.animationFillMode + ': both;' +
					_styles.backfaceVisibility + ': visible;' +
				'}'
			);

			this.view.addClass(this._animationName);
			this.view.on('end', this._cleanup);
		},

		_aggregateCurrentProperties: function() {
			var to = this._to,
				idx = _animatableMatrixProperties.length,
				key;
			while (idx--) {
				key = _animatableMatrixProperties[idx];
				if (!_exists(to[key])) { continue; } // If we're not going to it, skip
				this._currentProperties[key] = to[key];
			}
			for (key in _animatableCssProperties) {
				if (!_exists(to[key])) { continue; } // If we're not going to it, skip
				this._currentProperties[key] = to[key];
			}
		},

		_omitUnchangedProperties: function() {
			var propertyCount = 0,
				key;
			for (key in this._currentProperties) {
				// No change, we don't care about it
				if (this._from[key] === this._currentProperties[key]) {
					delete this._currentProperties[key];
					continue;
				}

				propertyCount += 1;
			}

			return propertyCount;
		},

		reverse: function() {
			var animation = new Animation(this.view, {
				properties: this._from,
				callback: this.callback,
				precision: this.precision,
				origin: this.origin,
				time: this.time,
				curve: this.curve,
				spring: this._spring,
				ease: this._ease
			});
			animation.start();
			return animation;
		},

		stop: function() {
			return this._cleanup();
		},

		_cleanup: function(completed) {
			this.view.off('end', this._cleanup);

			var computedStyles = this.view.getComputedStyle(),
				endStyles = {},
				key;
			for (key in _animatableCssProperties) {
				endStyles[key] = computedStyles[key];
			}

			this.view.setMatrix(new Matrix(this.view.getComputedMatrix()));
			this.view.style = _utils.extend(this.view.style, endStyles);
			
			this.view.removeClass(this._animationName);
			_css.removeStyle(this._styleTag);
			this._styleTag = null;

			this.view.properties = this._to;

			if (this.callback) { this.callback(this); }
			return this.emit('end');
		},

		_generateKeyframeCss: function() {
			var keyFrames = this._generateKeyframes(),
				arr = [],
				matrix = new Matrix();
			
			arr.push('@'+ _styles.animationKeyFrame +' ' + this._animationName + ' {');

			var position, values, propertyName, unit, idx;
			for (position in keyFrames) {
				values = keyFrames[position];

				arr.push(position + '% {');
				arr.push(_styles.transform + ': ');

				idx = _animatableMatrixProperties.length;
				while (idx--) {
					propertyName = _animatableMatrixProperties[idx];
					matrix[propertyName] = values[propertyName];
				}

				arr.push(matrix.css() + '; ');

				for (propertyName in _animatableCssProperties) {
					unit = _animatableCssProperties[propertyName];
					if (!_exists(values[propertyName])) { continue; } // Avoid NaNs and nully values from working with undefined values
					arr.push(propertyName + ':' + (_utils.round(values[propertyName], _defaults.roundingDecimals)) + unit + '; ');
				}

				arr.push('}');
			}
			arr.push('}');
			return arr.join('');
		},

		_generateKeyframes: function() {
			var stepIncrement = 0,
				curveValues = this._curveValues,
				stepDelta = 100 / (curveValues.length - 1),
				deltas = this._deltas(),
				keyFrames = {},
				idx = 0, length = curveValues.length;

			for (; idx < length; idx++) {
				var curveValue = curveValues[idx],
					position = _utils.round(stepIncrement * stepDelta, _defaults.roundingDecimals),
					currentKeyFrame = {};

				var propertyName;
				for (propertyName in this._currentProperties) {
					currentKeyFrame[propertyName] = curveValue * deltas[propertyName] + this._from[propertyName];
				}

				keyFrames[position] = currentKeyFrame;
				stepIncrement++;
			}

			return keyFrames;
		},

		_deltas: function() {
			var deltas = {},
				key;
			for (key in this._currentProperties) {
				deltas[key] = (this._currentProperties[key] - this._from[key]) / 100.0;
			}
			return deltas;
		},

		_parseCurve: function(config) {
			var factor = _defaults.timeSpeedFactor,
				precision = this.precision * factor,
				time = this.time * factor;

			if (config.spring) {
				var spring = config.spring;
				return SpringCurve.generate(spring.tension, spring.friction, spring.velocity, precision);
			}

			if (config.curve) {
				var curve = config.curve;
				if (curve === 'linear') {
					return BezierCurve.generate(BezierCurve.Linear, this.precision, time);
				} else if (curve === 'ease') {
					return BezierCurve.generate(BezierCurve.Ease, this.precision, time);
				} else if (curve === 'ease-in') {
					return BezierCurve.generate(BezierCurve.EaseIn, this.precision, time);
				} else if (curve === 'ease-out') {
					return BezierCurve.generate(BezierCurve.EaseOut, this.precision, time);
				} else if (curve === 'ease-in-out') {
					return BezierCurve.generate(BezierCurve.EaseInOut, this.precision, time);
				}
			}

			return BezierCurve.generate(BezierCurve.Linear, this.precision, this.time);
		}
	});

	return Animation;

}());