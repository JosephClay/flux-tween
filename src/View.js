var View = (function() {

	var _addClass = function(elem, className) {
			if (elem.classList) {
				return elem.classList.add(className);
			}

			elem.className += ' ' + className;
		},
		_removeClass = function(elem, className) {
			if (elem.classList) {
				return elem.classList.remove(className);
			}

			elem.className = elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		},
		_normalizeShortHand = function(obj) {
			if (obj.scale) {
				obj.scaleX = obj.scale;
				obj.scaleY = obj.scale;
			}
			if (obj.rotation) {
				obj.rotationZ = to.rotation;
			}
		},
		_ensureProperties = function(view, from, to) {
			var key,
				missingMatrixValue,
				missingCssValue;
			for (key in to) {
				// Both failed, no more tests
				if (missingMatrixValue && missingCssValue) { break; }

				// This to key exists in from, we're good
				if (_exists(from[key])) { continue; }

				// It's a matrix value, flag and continue
				if (_animatableMatrixProperties.indexOf(key) > -1) { missingMatrixValue = true; continue; }
				
				// It's a css value, flag and continue
				if (key in _animatableCssProperties) { missingCssValue = true; continue; }
			}

			if (missingMatrixValue) {
				var matrixObj = _getCurrentMatrixProperties(view);
				for (key in to) {
					if (matrixObj[key] !== undefined) {
						from[key] = matrixObj[key];
					}
				}
			}

			if (missingCssValue) {
				var styles = _getCurrentCssProperties(view);
				for (key in to) {
					if (styles[key] !== undefined) {
						from[key] = parseFloat(styles[key]);
					}
				}
			}

			return from;
		},
		_getCurrentMatrixProperties = function(view) {
			var obj = {},
				idx = _animatableMatrixProperties.length,
				matrix = new Matrix(view.getComputedMatrix()),
				key;
			while (idx--) {
				key = _animatableMatrixProperties[idx];
				obj[key]  = matrix[key];
			}
			return obj;
		},
		_getCurrentCssProperties = function(view) {
			var obj = {},
				styles = view.getComputedStyle(),
				key;
			for (key in _animatableCssProperties) {
				obj[key] = styles[key];
			}

			return obj;
		};

	var Element = function(elem, props) {
		EventEmitter.call(this);

		this.elem = elem;
		this.style = this.elem.style;
		this.properties = props || {};

		this._matrix = new Matrix(new WebMatrix(this.elem.style[_props.transform]));
		this._bindEnd();
	};

	_extend(Element.prototype, EventEmitter.prototype, {
		_bindEnd: function() {
			var self = this;
			this.elem.addEventListener(_props.animationEvent, function() {
				self.emit('end');
			}, false);
		},

		addClass: function(className) {
			_addClass(this.elem, className);
		},

		removeClass: function(className) {
			_removeClass(this.elem, className);
		},

		animate: function(args, callback) {
			_normalizeShortHand(this.properties);
			_normalizeShortHand(args.properties);

			this.properties = _ensureProperties(this, this.properties, args.properties);

			var animation = (_canHwAccel) ? new Animation(this, args) : new Fallback(this, args);
			animation.start(callback);
			return animation;
		},

		setMatrix: function(matrix) {
			this._matrix = matrix;
			this.style[_props.transform] = this._matrix.css();
		},
		
		getComputedMatrix: function() {
			return new WebMatrix(this.getComputedStyle()[_props.transform]);
		},

		getComputedStyle: function() {
			return document.defaultView.getComputedStyle(this.elem);
		}
	});

	return Element;

}());