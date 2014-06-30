var createGraph = function(t, f, c) {

	var div = document.createElement('div');
	div.style.display = 'inline-block';
	div.style.width = '200px';
	div.style.height = '120px';

	var canvas = document.createElement('canvas');
	canvas.width = 180;
	canvas.height = 100;

	var context = canvas.getContext('2d');
	context.fillStyle = 'rgb(250,250,250)';
	context.fillRect(0, 0, 180, 100);

	context.lineWidth = 0.5;
	context.strokeStyle = 'rgb(230,230,230)';

	context.beginPath();
	context.moveTo(0, 20);
	context.lineTo(180, 20);
	context.moveTo(0, 80);
	context.lineTo(180, 80);
	context.closePath();
	context.stroke();

	context.lineWidth = 2;
	context.strokeStyle = 'rgb(255,127,127)';

	var position = { x: 5, y: 80 };
	var position_old = { x: 5, y: 80 };

	new FLUX.Tween(position).to({ x: 175 }).duration(2000).ease(FLUX.Easing.Linear.None).start();
	new FLUX.Tween(position).to({ y: 20 }).duration(2000).ease(f).onUpdate(function() {

		context.beginPath();
		context.moveTo(position_old.x, position_old.y);
		context.lineTo(position.x, position.y);
		context.closePath();
		context.stroke();

		position_old.x = position.x;
		position_old.y = position.y;

	}).start();

	div.appendChild(document.createTextNode(t));
	div.appendChild(document.createElement('br'));
	div.appendChild(canvas);

	return div;
};