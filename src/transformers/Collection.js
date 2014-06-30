var _ = require('../utils'),

	Elem = require('./Elem'),
	Obj = require('./Obj');

var Elems = function(arr) {

	this._arr = _.map(arr, function(obj) {
		return _.isElement(obj) ? new Elem(obj) : new Obj(obj);
	});

	this._matrixArr = [];

};

Elems.prototype = {
	value: function() {

		return this;

	},

	each: function(iterator) {

		var idx = 0, length = this._arr.length;
		for (; idx < length; idx++) {

			iterator(this._arr[idx], idx);

		}
		return this;

	},

	matrix: function() {

		return _.fastmap(this._arr, function(elem) {

			return elem.matrix();

		}, this._matrixArr);

	},

	from: function(obj) {

		var idx = this._arr.length;
		while (idx--) {

			this._arr[idx].from(obj);

		}
		return this;

	},

	to: function(obj) {

		var idx = this._arr.length;
		while (idx--) {

			this._arr[idx].to(obj);

		}
		return this;

	},

	yoyo: function(yoyo) {

		var idx = this._arr.length;
		while (idx--) {

			this._arr[idx].yoyo(yoyo);

		}
		return this;

	},

	update: function(perc) {

		var idx = 0, length = this._arr.length;
		for (; idx < length; idx++) {

			this._arr[idx].update(perc);

		}
		return this;

	},

	reverse: function() {

		var idx = this._arr.length;
		while (idx--) {

			this._arr[idx].reverse();

		}
		return this;

	},

	start: function() {

		var idx = 0, length = this._arr.length;
		for (; idx < length; idx++) {

			this._arr[idx].start();

		}
		return this;
		
	}
};

module.exports = Elems;