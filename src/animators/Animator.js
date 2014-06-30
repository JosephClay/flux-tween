var _ = require('../utils'),

	_loop = require('../loop'),

	TransformObj = require('../transformers/Obj'),
	TransformElem = require('../transformers/Elem'),
	TransformCollection = require('../transformers/Collection');

var Animation = function(obj) {
	this._transformer = _.isArrayLike(obj) ?
		new TransformCollection(obj) :
		_.isElement(obj) ?
			new TransformElem(obj) :
			new TransformObj(obj);

	this._startTime = 0;
	this._delayTime = 0;
	this._isPlaying = false;

	this._onStartCallback    = _.noop;
	this._onUpdateCallback   = _.noop;
	this._onReverseCallback  = _.noop;
	this._onCompleteCallback = _.noop;
	this._onStopCallback     = _.noop;
};

Animation.prototype = {
	isPlaying: function() {
		return this._isPlaying;
	},

	onStart: function(callback) {
		this._onStartCallback = callback;
		return this;
	},

	onUpdate: function(callback) {
		this._onUpdateCallback = callback;
		return this;
	},

	onComplete: function(callback) {
		this._onCompleteCallback = callback;
		return this;
	},

	onReverse: function(callback) {
		this._onReverseCallback = callback;
		return this;
	},

	onStop: function(callback) {
		this._onStopCallback = callback;
		return this;
	},

	delay: function(amount) {
		this._delayTime = amount;
		return this;
	},

	repeat: function(repeat) {
		this._animation.repeat(repeat);
		return this;
	},

	yoyo: function(yoyo) {
		this._transformer.yoyo(yoyo);
		return this;
	},

	to: function(goTo) {
		this._transformer.to(goTo);
		return this;
	},

	start: function(time) {
		this._startTime = time || _.now();

		var self = this;
		_loop.await(function(time) {
			var shouldContinueToWait;

			if (time < (self._startTime + self._delayTime)) {
				return (shouldContinueToWait = true);
			}

			self._onStartCallback();

			self._start(time);

			return (shouldContinueToWait = false);
		});
	},

	stop: function() {
		if (!this._isPlaying) { return this; }

		this._isPlaying = false;

		_loop.remove(this._animation.step);

		this._transformer.stop();
		this._animation.stop();

		this._onStopCallback();
	},

	// _start: function() {},
};

module.exports = Animation;