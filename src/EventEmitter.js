var EventEmitter = (function(utils) {

	var _eventCheck = function(event) {
		if (event !== '') { return; }
		console.error(event, 'Missing event type');
	};

	var EventEmitter = function() {
		this.events = {};
	};

	EventEmitter.prototype = {
		emit: function() {
			var event = arguments[0],
				args = arguments.length >= 2 ? utils.slice(arguments) : [];
			
			_eventCheck(event);
			
			var reference = this.events[event];
			if (!reference) { return; }

			var results = [],
				idx = 0, length = reference.length,
				listener;
			for (; idx < length; idx++) {
				listener = reference[idx];
				results.push(listener.apply(null, args));
			}

			return results;
		},

		on: function(event, listener) {
			_eventCheck(event);

			var base = this.events[event] || (this.events[event] = []);
			
			return this.events[event].push(listener);
		},
		addListener: function() {
			this.on.apply(this, arguments);
		},

		off: function(event, listener) {
			_eventCheck(event);
			if (!this.events[event]) { return; }

			var reference = this.events[event],
				idx = reference.length;
			while (idx--) {
				if (reference[idx] === listener) {
					reference.splice(idx, 1);
				}
			}
		},
		removeListener: function() {
			this.off.apply(this, arguments);
		},

		once: function(event, listener) {
			_eventCheck(event);

			var self = this;
			return this.on(event, function() {
				self.off(event, fn);
				return listener.apply(null, arguments);
			});
		},

		removeAllListeners: function(event) {
			_eventCheck(event);
			
			if (!this.events[event]) { return; }

			var reference = this.events[event],
				idx = reference.length,
				listener;
			while (idx--) {
				listener = reference[idx];
				this.off(event, listener);
			}
		}
	};

	return EventEmitter;

}(Utils));