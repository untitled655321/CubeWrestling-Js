var players = [];

function Players(id,x,y,z,rot_x,rot_y,rot_z,rot_w)
{
	this.id = id;
	this.x = x;
	this.y = y;
	this.z = z;
	
}

var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = app.listen(port);
var socket = require('socket.io');

app.use(express.static(__dirname + '/public'));
console.log("socket runing");

var io = socket(http);

io.sockets.on('connection', newConnection);





function newConnection(socket)
{
	
function heartbeat()
{
	io.sockets.emit('heartbeat',players);
	
}
	
	console.log('new connection'+ socket.id);
	function sendSocketId()
	{
		socket.emit('socketid',socket.id);
	}
	sendSocketId();
	
	socket.on('start', cubePos);
	
	function cubePos(data)
	{
		
			var player = new Players(socket.id, data.x,data.y,data.z);
			console.log(socket.id + " "+data.x,data.y,data.z);
			players.push(player);
			io.sockets.emit('playerlist',players);
			
			
	}
	
	socket.on('update', cubeUpdate);
	function cubeUpdate(data)
	{
		
			//console.log(socket.id + " "+data.x,data.y,data.z,data.rot_x,data.rot_y,data.rot_z,data.rot_w);
			
				var player;
				for(var i=0;i<players.length;i++)
				{
					if(socket.id ==players[i].id)
					{
						player = players[i];
					}
				}
				player.x = data.x;
				player.y = data.y;
				player.z = data.z;
				player.rot_x = data.rot_x;
				player.rot_y = data.rot_y;
				player.rot_z = data.rot_z;
				player.rot_w = data.rot_w;
			
			
	}
	
	setInterval(heartbeat,16);
	socket.on('disconnect', function()
	{
		players = players.filter(function(data){
			return data.id !== socket.id;
		});
		console.log("disconnect");
	});
}

/*(function animloop(){
  requestAnimFrame(animloop);
  gameLoop();
})();*/
