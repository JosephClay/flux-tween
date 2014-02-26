var Css = (function(document, undefined) {

	var _head = document.head;

	return {
		addStyle: function(css) {
			var styleSheet = document.createElement('style');
			styleSheet.innerHTML = css;
			return _head.appendChild(styleSheet);
		},
		removeStyle: function(style) {
			if (style) { _head.removeChild(style); }
		}
	};

}(document));