var _exists = function(obj) {
	return (obj !== null && obj !== undefined);
};

var _animatableMatrixProperties = [
	'x',
	'y',
	'z',
	'scaleX',
	'scaleY',
	'scaleZ',
	'rotationX',
	'rotationY',
	'rotationZ'
];

var _animatableCssProperties = {
	opacity: '',
	width: 'px',
	height: 'px'
};