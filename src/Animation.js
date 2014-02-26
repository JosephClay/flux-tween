// TODO: non -webkit css
var Animation = (function(utils, css, FilterProperties, EventEmitter, SpringCurve, Matrix, undefined) {
	
	var config = {
			timeSpeedFactor: 1,
			roundingDecimals: 5,
			fps: 60
		},
		_id = 0,
		_exists = function(obj) {
			return (obj !== null && obj !== undefined);
		};

	var _animatableFilterProperties = (function() {
			var obj = {},
				key;
			for (key in FilterProperties) {
				obj[key] = FilterProperties[key].unit;
			}
			return obj;
		}()),

		_animatableMatrixProperties = [
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

		_animationProperties = [
			'properties',
			'curve',
			'time',
			'origin',
			'tolerance',
			'precision',
			'modifiers',
			'limits',
			'callback'
		],

		_animatableCssProperties = {
			opacity: '',
			width: 'px',
			height: 'px'
		};

	var Animation = function(view, args) {
		EventEmitter.call(this);

		var idx = _animationProperties.length,
			prop;
		while (idx--) {
			prop = _animationProperties[idx];
			this[prop] = args[prop];
		}

		this.view = view;
		this.count = 0;
		this.viewProperties = {};
		this.ourProperties = {};

		if (!_exists(this.time)) { this.time = 1000; }
		if (!_exists(this.curve)) { this.curve = 'linear'; }
		if (!_exists(this.precision)) { this.precision = config.fps; }

		this._animationId = (_id += 1);

		this._cleanup = this._cleanup.bind(this);
	};

	_.extend(Animation.prototype, EventEmitter.prototype, {

		start: function(callback) {
			var self = this;
			
			if (!this.view) { return console.error('Animation does not have a view to animate'); }

			var startTime = utils.now();
			this.count++;
			this.animationName = 'framer-animation-' + this._animationId + '-' + this.count;

			this.curveValues = this._parseCurve(this.curve);
			this.totalTime = (this.curveValues.length / this.precision) * 1000;
			
			var viewProperties = this.view.properties,
				properties = this.properties;
			if (properties.scale) {
				properties.scaleX = properties.scale;
				properties.scaleY = properties.scale;
			}
			if (properties.rotation) {
				properties.rotationZ = properties.rotation;
			}

			var idx = _animatableMatrixProperties.length,
				key;
			while (idx--) {
				key = _animatableMatrixProperties[idx];
				if (!properties[key]) { continue; }
				this.viewProperties[key] = viewProperties[key];
				
				this.ourProperties[key] = properties[key];
			}
			
			for (key in _animatableCssProperties) {
				if (!properties[key]) { continue; }
				this.viewProperties[key] = viewProperties[key];
				
				this.ourProperties[key] = properties[key];
			}

			for (key in _animatableFilterProperties) {
				if (!properties[key]) { continue; }
				this.viewProperties[key] = viewProperties[key];
				
				this.ourProperties[key] = properties[key];
			}
			
			var animatedProperties = [];

			for (key in this.viewProperties) {
				if (this.viewProperties[key] !== this.ourProperties[key]) {
					animatedProperties.push(key);
				}
			}

			// Nothing to animate
			if (animatedProperties.length === 0) { return; }
			
			this.keyFrameAnimationCSS = this._generateKeyframeCss();

			if (this.origin) { this.view.style['-webkit-transform-origin'] = this.origin; }
			
			// TODO: Optimize
			this.styleTag = css.addStyle([
				this.keyFrameAnimationCSS, ' .', this.animationName, ' { ',
					'-webkit-animation-duration: ' + (this.totalTime / 1000) + 's;',
					'-webkit-animation-name: ' + this.animationName + ';',
					'-webkit-animation-timing-function: linear;',
					'-webkit-animation-fill-mode: both;',
					'-webkit-backface-visibility: visible;',
				'}'
			].join(''));

			this.view.addClass(this.animationName);
			this.view.on('end', this._cleanup);
		},

		reverse: function() {
			var options = {},
				idx = _animationProperties.length,
				prop;
			while (idx--) {
				prop = _animationProperties[idx];
				options[prop] = this[prop];
			}
			
			options.properties = {};
			var originalProperties = this._originalProperties,
				key;
			for (key in originalProperties) {
				options.properties[key] = originalProperties[key];
			}
			return new Animation(options);
		},

		stop: function() {
			return this._cleanup();
		},

		_cleanup: function(completed) {
			this.view.off('end', this._cleanup);

			console.log('this: ', this);

			var endMatrix, endStyles = {}, key, value;
			if (completed) {
				endMatrix = utils.extend(new Matrix(), this.ourProperties);
				for (key in _animatableCssProperties) {
					value = _animatableCssProperties[key];
					endStyles[key] = this.ourProperties[key] + value;
				}

				var cssFilterProperties = {},
					properties = this.ourProperties;
				for (key in properties) {
					value = properties[key];
					if (FilterProperties.hasOwnProperty(key)) {
						cssFilterProperties[FilterProperties[key].css] = value;
					}
				}
				endStyles.webkitFilter = this.view.filterCss(cssFilterProperties);

			} else {

				endMatrix = new Matrix(this.view.getComputedMatrix());

				var computedStyles = this.view.getComputedStyle();
				console.log('computedStyles: ', computedStyles);
				for (key in _animatableCssProperties) {
					endStyles[key] = computedStyles[key];
				}
				endStyles.webkitFilter = computedStyles.webkitFilter;
			}

			console.log('endStyles: ', endStyles);

			this.view._matrix = endMatrix;
			this.view.removeClass(this.animationName);
			this.view.style = _.extend(this.view.style, endStyles);

			if (_.isFunction(this.callback)) { this.callback(this); }
			return this.emit("end");
		},

		_generateKeyframes: function() {
			var stepIncrement = 0,
				stepDelta = 100 / (this.curveValues.length - 1),
				deltas = this._deltas(),
				keyFrames = {},
				curveValues = this.curveValues,
				idx = 0, length = curveValues.length;

			for (; idx < length; idx++) {
				var curveValue = curveValues[idx],
					position = utils.round(stepIncrement * stepDelta, config.roundingDecimals),
					currentKeyFrame = {};

				var propertyName;
				for (propertyName in this.viewProperties) {
					if (!_exists(this.viewProperties[propertyName])) { continue; }
					currentKeyFrame[propertyName] = curveValue * deltas[propertyName] + this.viewProperties[propertyName];
				}

				keyFrames[position] = currentKeyFrame;
				stepIncrement++;
			}

			return keyFrames;
		},

		_generateKeyframeCss: function() {
			var keyFrames = this._generateKeyframes(),
				arr = [], // TODO: Optimize
				matrix = new Matrix();
			
			arr.push('@-webkit-keyframes ' + this.animationName + ' {\n');

			var position, values, propertyName, unit, idx;
			for (position in keyFrames) {
				values = keyFrames[position];

				arr.push('\t' + position + '% {');
				arr.push('-webkit-filter: ');
				
				for (propertyName in _animatableFilterProperties) {
					unit = _animatableFilterProperties[propertyName];
					arr.push('' + FilterProperties[propertyName].css + '(' + (utils.round(values[propertyName], config.roundingDecimals)) + unit + ') ');
				}
				
				arr.push(';');
				arr.push('-webkit-transform: ');

				idx = _animatableMatrixProperties.length;
				while (idx--) {
					propertyName = _animatableMatrixProperties[idx];
					matrix[propertyName] = values[propertyName];
				}

				arr.push(matrix.css() + '; ');

				for (propertyName in _animatableCssProperties) {
					unit = _animatableCssProperties[propertyName];
					arr.push('' + propertyName + ':' + (utils.round(values[propertyName], config.roundingDecimals)) + unit + '; ');
				}

				arr.push('}\n');
			}
			arr.push('}\n');
			return arr.join('');
		},

		_deltas: function() {
			var deltas = {},
				key;
			for (key in this.viewProperties) {
				if (!_exists(this.viewProperties[key])) { continue; }
				console.log(this.ourProperties[key]);
				deltas[key] = (this.ourProperties[key] - this.viewProperties[key]) / 100.0;
			}
			return deltas;
		},

		_parseCurve: function(curve) {
			curve = (curve || '').toLowerCase();
			
			var factor = config.timeSpeedFactor,
				precision = this.precision * factor,
				values = utils.parseCurve(curve, 'spring');

			return SpringCurve(values[0], values[1], values[2], precision);
		}
	});

	return Animation;

}(Utils, Css, FilterProperties, EventEmitter, SpringCurve, Matrix));