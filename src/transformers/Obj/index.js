var Obj = module.exports = function(obj) {

	this.base = obj;

	// this.from   = {};
	// this._repeat = {};
	// this.to     = {};
	// this.yoyo    = false;

};

Obj.create = function(obj) {

	return new Obj(obj);

};

Obj.prototype = {

	setFrom: function(from) {

		this.base = from;

		return this;

	},

	setTo: function(to) {

		this.to = to;

		return this;

	},

	update: function(perc) {

		var property;

		for (property in this.to) {

			var start = this.from[property] || 0,
				end = this.to[property];

			// protect against non numeric properties.
			if (end === +end) {

				this.base[property] = start + (end - start) * perc;

			}

		}

		return this;

	},

	reverse: function() {

		var property, tmp;

		// reassign starting values
		for (property in this._repeat) {

			if (this.yoyo) {

				tmp = this._repeat[property];
				this._repeat[property] = this.to[property];
				this.to[property] = tmp;

			}

			this.from[property] = this._repeat[property];

		}


		return this;

	},

	start: function() {

		if (!this.to) { return this; }

		var base   = this.base || (this.base = {}),
			from   = this.from || (this.from = {}),
			repeat = this._repeat || (this._repeat = {}),
			to     = this.to,
			property;

		for (property in this.to) {

			// omit unchanged properties
			if (base[property] === undefined || to[property] === base[property]) {

				delete to[property];
				continue;

			}

			// Ensures we're using numbers, not strings
			from[property] = base[property] *= 1;

			repeat[property] = from[property] || 0;
		}


		return this;

	}

};