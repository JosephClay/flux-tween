// TODO: non -webkit css
var Animation = (function(_utils, _props, _css, EventEmitter, SpringCurve, Bezier, Matrix, undefined) {
	
	var _defaults = {
			timeSpeedFactor: 1,
			roundingDecimals: 5,
			fps: 60
		},
		_PREFIX = 'animationjs-animation-',
		_id = 0,
		_exists = function(obj) {
			return (obj !== null && obj !== undefined);
		};

	var _animatableMatrixProperties = [
			'x',
			'y',
			'z',
			'scaleX',
			'scaleY',
			'scaleZ',
			'rotationX',
			'rotationY',
			'rotationZ'
		],
		_animatableCssProperties = {
			opacity: '',
			width: 'px',
			height: 'px'
		};

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

		this._normalizeShortHand(this._from);
		this._normalizeShortHand(this._to);

		if (this.origin) { this.view.style[_props.transformOrigin] = this.origin; }
	};

	_.extend(Animation.prototype, EventEmitter.prototype, {

		_normalizeShortHand: function(obj) {
			if (obj.scale) {
				obj.scaleX = obj.scale;
				obj.scaleY = obj.scale;
			}
			if (obj.rotation) {
				obj.rotationZ = to.rotation;
			}
		},

		start: function() {
			
			// Aggregate the properties we're animating to ----
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
			
			// Omit properties that aren't changing ----
			var propertyCount = 0;
			for (key in this._currentProperties) {
				// No change, we don't care about it
				if (this._from[key] === this._currentProperties[key]) {
					delete this._currentProperties[key];
					continue;
				}

				propertyCount += 1;
			}

			// Stop if there's nothing to animate ----
			if (propertyCount === 0) { return; } // Nothing to animate
			
			// TODO: Keep this value so that we don't have to recalcuate the
			// animtion if start get called again
			this.keyFrameAnimationCSS = this._generateKeyframeCss();

			// TODO: Optimize
			this.styleTag = _css.addStyle([
				this.keyFrameAnimationCSS, ' .', this._animationName, ' { ',
					'-webkit-animation-duration: ' + (this._totalTime / 1000) + 's;',
					'-webkit-animation-name: ' + this._animationName + ';',
					'-webkit-animation-timing-function: linear;',
					'-webkit-animation-fill-mode: both;',
					'-webkit-backface-visibility: visible;',
				'}'
			].join(''));

			this.view.addClass(this._animationName);
			this.view.on('end', this._cleanup);
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
			this.view.style = _.extend(this.view.style, endStyles);
			
			this.view.removeClass(this._animationName);
			_css.removeStyle(this.styleTag);

			this.view.properties = this._to;

			if (_.isFunction(this.callback)) { this.callback(this); }
			return this.emit('end');
		},

		_generateKeyframeCss: function() {
			var keyFrames = this._generateKeyframes(),
				arr = [], // TODO: Optimize
				matrix = new Matrix();
			
			arr.push('@-webkit-keyframes ' + this._animationName + ' {\n');

			var position, values, propertyName, unit, idx;
			for (position in keyFrames) {
				values = keyFrames[position];

				arr.push('\t' + position + '% {');
				arr.push('-webkit-transform: ');

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

				arr.push('}\n');
			}
			arr.push('}\n');
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
				return SpringCurve(spring[0], spring[1], spring[2], precision);
			}

			/*if (curve === 'linear') {
				return bezier.defaults.Linear(this.precision, time);
			} else if (curve === 'ease') {
				return bezier.defaults.Ease(this.precision, time);
			} else if (curve === 'ease-in') {
				return bezier.defaults.EaseIn(this.precision, time);
			} else if (curve === 'ease-out') {
				return bezier.defaults.EaseOut(this.precision, time);
			} else if (curve === 'ease-in-out') {
				return bezier.defaults.EaseInOut(this.precision, time);
			} else if (curve.indexOf('bezier-curve') > -1) {
				value = _utils.parseCurve(curve, 'bezier-curve');
				return bezier.BezierCurve(value[0], value[1], value[2], value[3], precision, time);
			} else if (curve.indexOf('spring') > -1) {
				value = _utils.parseCurve(curve, 'spring');
				console.log('curve: ', curve);
				console.log('value: ', value);
				return SpringCurve(value[0], value[1], value[2], precision);
			}

			console.log('Animation.parseCurve: could not parse curve ', curve);
			return bezier.defaults.Linear(this.precision, this.time);*/
		}
	});

	return Animation;

}(Utils, Props, Css, EventEmitter, SpringCurve, Bezier, Matrix));