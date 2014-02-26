var Utils = (function() {

	var Matrix = (typeof WebKitCSSMatrix !== 'undefined') ? WebKitCSSMatrix : XCSSMatrix;

	var _slice = (function(ARR_PROTO) {
		return function(arrlike) {
			return ARR_PROTO.slice.call(arrlike, 1);
		};
	}(Array.prototype));

	return {
		WebMatrix: Matrix,

		slice: _slice,

		now: Date.now || function() {
			return new Date().getTime();
		},

		round: function(value, decimals) {
			var d = Math.pow(10, decimals);
			return Math.round(value * d) / d;
		}
	};

}());