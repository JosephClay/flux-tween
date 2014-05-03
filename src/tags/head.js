var _head = document.head;

module.exports = {
	addStyle: function(css) {
		var styleSheet = document.createElement('style');
		styleSheet.innerHTML = css;
		return _head.appendChild(styleSheet);
	},
	removeStyle: function(style) {
		if (style) { _head.removeChild(style); }
	}
};