var View = (function() {

	var _id = 0,
		_addClass = function(elem, className) {
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
		
		_FAKE_EL = document.createElement('fakeelement'),
		_animationEvent = (function() {
			var _animationEndEventNames = {
					'animation': 'animationend',
					'-o-animation': 'oAnimationEnd',
					'-moz-animation': 'animationend',
					'-webkit-animation': 'webkitAnimationEnd'
				},
				eventName;

			for (eventName in _animationEndEventNames) {
				if (_FAKE_EL.style[eventName] !== undefined) {
					return _animationEndEventNames[eventName];
				}
			}

			return '';
		}()),
		_transformProperty = (function() {
			var transforms = [
					'MozTransform',
					'OTransform',
					'msTransform',
					'transform',
					'WebkitTransform'
				],
				idx = transforms.length;

			while (idx--) {
				if (_FAKE_EL.style[transforms[idx]] !== undefined) {
					return transforms[idx];
				}
			}

			return '';
		}());

	var Element = function(elem, props) {
		EventEmitter.call(this);

		this.id = (_id += 1);
		this.elem = elem;
		this.style = this.elem.style;
		this.properties = props;

		this._matrix = new Matrix(new WebKitCSSMatrix(this.elem.style[_transformProperty]));
		this._bindEnd();
	};

	_.extend(Element.prototype, EventEmitter.prototype, {
		_bindEnd: function() {
			var self = this;
			console.log(_animationEvent);
			this.elem.addEventListener(_animationEvent, function() {
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
			var animation = new Animation(this, args);
			animation.start(callback);
			return animation;
		},

		filterCss: function(filterValues) {
			var css = [],
				key, value;
			
			for (key in filterValues) {
				value = filterValues[k];
				if (FilterProperties.hasOwnProperty(key)) {
					css.push(FilterProperties[key].css + '(' + value + FilterProperties[key].unit + ')');
				}
			}

			return css.join(' ');
		},
		
		getComputedMatrix: function() {
			return new WebKitCSSMatrix(this.getComputedStyle()[_transformProperty]);
		},

		getComputedStyle: function() {
			return document.defaultView.getComputedStyle(this.elem);
		}
	});

	return Element;

}());
