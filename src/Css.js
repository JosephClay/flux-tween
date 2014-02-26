var Css = (function(document) {

	return {
		addStyle: function(css) {
			var styleSheet = document.createElement('style');
			styleSheet.innerHTML = css;
			return document.head.appendChild(styleSheet);
		}
	};

}(document));