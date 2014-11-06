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

	var position_start = { x: 5, y: 80 };
	var position_current = { x: 5, y: 80 };

	flux.tween(position_start)
		.to({ x: 175 })
		.duration(2000)
		.ease()
		.start();

	flux.tween(position_start)
		.to({ y: 20 })
		.duration(2000)
		.ease(f)
		.on('update', function() {

			context.beginPath();
			context.moveTo(position_current.x, position_current.y);
			context.lineTo(position_start.x, position_start.y);
			context.closePath();
			context.stroke();

			position_current.x = position_start.x;
			position_current.y = position_start.y;

		})
		.start();

	div.appendChild(document.createTextNode(t));
	div.appendChild(document.createElement('br'));
	div.appendChild(canvas);

	return div;
};