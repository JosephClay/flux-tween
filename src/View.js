var View = (function(_utils, _props, EventEmitter) {

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
		};

	var Element = function(elem, props) {
		EventEmitter.call(this);

		this.elem = elem;
		this.style = this.elem.style;
		this.properties = props;

		this._matrix = new Matrix(new _utils.WebMatrix(this.elem.style[_props.transform]));
		this._bindEnd();
	};

	_.extend(Element.prototype, EventEmitter.prototype, {
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
			var animation = new Animation(this, args);
			animation.start(callback);
			return animation;
		},

		setMatrix: function(matrix) {
			this._matrix = matrix;
			this.style[_props.transform] = this._matrix.css();
		},
		
		getComputedMatrix: function() {
			return new _utils.WebMatrix(this.getComputedStyle()[_props.transform]);
		},

		getComputedStyle: function() {
			return document.defaultView.getComputedStyle(this.elem);
		}
	});

	return Element;

}(Utils, Props, EventEmitter));
