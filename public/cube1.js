var scene, camera, renderer, mesh, canvas;
var meshFloor, ambientLight, light;

var socket;
var socket_id;

var world,
	bodys=[],
	three_shapes=[],
	player_socket_array=[],
	three_shape,
	body;

var movment_speed=1;
var players=[];
var cubes_floor = [];
var vector_zero = new THREE.Vector3(0,0,0);
 

    
var rows = 20;
var columns = 20;
var deeph = 1;
var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;


function make_floor()
{
	var vector_helper = new THREE.Vector3(0,0,0);
	for(var b=0; b<deeph;b++)
	{
		vector_helper.y -=5;
		vector_helper.z =0;
	for(var a=0; a<columns;a++)
	{
		vector_helper.z +=0.5;
		vector_helper.x =0;
	for(var i=0; i<rows;i++)
	{
		
	mesh = new THREE.Mesh(
		new THREE.CubeGeometry(0.4,0.4,0.4),
		new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
	);
	vector_helper.x += 0.5;
	mesh.position.y = vector_helper.y;
	// The cube can have shadows cast onto it, and it can cast shadows
	mesh.position.x = vector_helper.x;
	//mesh.position.y = vector_helper.y;
	mesh.position.z = vector_helper.z;
	mesh.receiveShadow = true;
	mesh.castShadow = false;
	cubes_floor.push(mesh);
	var body = new CANNON.Body({
            mass: 0
        });
        var shape = new CANNON.Box(new CANNON.Vec3( 0.2, 0.2, 0.2 ));
        body.addShape(shape);
		 body.position.set(
        mesh.position.x, mesh.position.y, mesh.position.z
    );
        world.add(body);
	//scene.add(mesh);
	}
	}
	}
	for(var i=0; i<rows*columns*deeph;i++)
	{
		scene.add(cubes_floor[i]);
	}
	
}


function make_plane()
{
	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(10,10, 10,10),
		// MeshBasicMaterial does not react to lighting, so we replace with MeshPhongMaterial
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
		// See threejs.org/examples/ for other material types
	);
	meshFloor.rotation.x -= Math.PI / 2;
	// Floor can have shadows cast onto it
	meshFloor.receiveShadow = true;
	meshFloor.position.x = rows/4;
	meshFloor.position.z = columns/4;
	scene.add(meshFloor);
	
}

function Player_init(x,y,z)
{
		this.x = x;
		this.y = y;
		this.z = z;
}

function Make_player(x,y,z)
{
	
	
		this.x = x;
		this.y = y;
		this.z = z;
			this.renderPlayer=function()
			{
				var three_shape = new THREE.Mesh(
				new THREE.CubeGeometry(1,1,1),
				new THREE.MeshPhongMaterial({color:0x0000ff, wireframe:USE_WIREFRAME})
				);
				three_shape.castShadow = true;
				three_shape.position.x = x;
				three_shape.position.y = y;
				three_shape.position.z = z;
				
				scene.add(three_shape);
				three_shapes.push(three_shape);
				
				
				var shape = new CANNON.Box(new CANNON.Vec3( 0.5, 0.5, 0.5 ));
				var body = new CANNON.Body({
					mass: 25
				});
				
				body.addShape(shape);
				body.position.set(
				x,y,z
				);
				//three_shape.useQuaternion = true;
				world.add(body);
				bodys.push(body);
				
			}
		
	

}

function Make_player_tru(x,y,z,rot_x,rot_y,rot_z,rot_w)
{
	
	
		this.x = x;
		this.y = y;
		this.z = z;
		this.rot_x = rot_x;
		this.rot_y = rot_y;
		this.rot_z = rot_z;
		this.rot_w = rot_w;
			this.renderPlayer=function()
			{
				 three_shape = new THREE.Mesh(
				new THREE.CubeGeometry(1,1,1),
				new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
				);
				three_shape.castShadow = true;
				three_shape.position.x = x;
				three_shape.position.y = y;
				three_shape.position.z = z;
				
				scene.add(three_shape);
				
				
				
				var shape = new CANNON.Box(new CANNON.Vec3( 0.5, 0.5, 0.5 ));
				body = new CANNON.Body({
					mass: 25
				});
				
				body.addShape(shape);
				body.position.set(
				x,y,z
				);
				//three_shape.useQuaternion = true;
				world.add(body);
				
				
			}
		
	

}



function init(){
	var https = 'https://cubewrestling.herokuapp.com/';
	socket = io.connect(https);
	//socket.on('cube', drawCube);
	
				var cub = new Player_init(Math.floor((Math.random() * 10) + 1),0,Math.floor((Math.random() * 10) + 1),0,0,0,0);
				
				//Sockett data cast
					var data = 
				{
				x: cub.x,
				y: cub.y,
				z: cub.z,
				rot_x: cub.rot_x,
				rot_y: cub.rot_y,
				rot_z: cub.rot_z,
				rot_w: cub.rot_w,
				}
				socket.emit('start',data);
				
				//send unique socket id to local browswer
				socket.on('socketid',function(data)
				{
					console.log(data);
					socket_id = data;
				});
				
			
			
				
				
			//Create CANNON world
			world = new CANNON.World;
			world.gravity.set( 0, -50, 0 );
			world.broadphase = new CANNON.NaiveBroadphase();
			world.solver.iterations = 10; // Use 10 iterations each time the simulation is run
			
			var groundMaterial = new CANNON.Material("groundMaterial");
				var ground_material_tru = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
					friction: 0,
					restitution: 0,
					contactEquationStiffness: 1e8,
					contactEquationRelaxation: 1e8,
					frictionEquationStiffness: 1e8,
					frictionEquationRegularizationTime: 1e8,
					});
				world.addContactMaterial(ground_material_tru);
			
			
			//Create THREE.js scene
			scene = new THREE.Scene();
			camera = new THREE.OrthographicCamera( 1280/-128, 1280/128, 720/128, 720/-138, -100, 100);
			
			
			
			 var cube = new Make_player_tru(Math.floor((Math.random() * 10) + 1),0,Math.floor((Math.random() * 10) + 1));
			cube.renderPlayer();
			var cube = new Make_player(Math.floor((Math.random() * 10) + 1),0,Math.floor((Math.random() * 10) + 1));
			cube.renderPlayer();
			var cube = new Make_player(Math.floor((Math.random() * 10) + 1),0,Math.floor((Math.random() * 10) + 1));
			cube.renderPlayer();
			//Create floor
			make_floor();
			
			socket.on('heartbeat',function(data)
			{
				//console.log(data);
				
				for(var i=0; i<data.length;i++)
				{
				if(data[i].id!=socket_id)
				{
					
					//console.log("prawda");
				 three_shapes[i].position.x = data[i].x;
				 three_shapes[i].position.y = data[i].y;
				 three_shapes[i].position.z = data[i].z;
				 three_shapes[i].quaternion.x = data[i].rot_x;
				 three_shapes[i].quaternion.y = data[i].rot_y;
				 three_shapes[i].quaternion.z = data[i].rot_z;
				 three_shapes[i].quaternion.w = data[i].rot_w;
				 bodys[i].position.x = data[i].x;
				 bodys[i].position.y = data[i].y;
				 bodys[i].position.z = data[i].z;
				 bodys[i].quaternion.x = data[i].rot_x;
				 bodys[i].quaternion.y = data[i].rot_y;
				 bodys[i].quaternion.z = data[i].rot_z;
				 bodys[i].quaternion.w = data[i].rot_w;
				}
				else{
					//console.log("fałsz");
				}
				} 
				for(var i=0; i<data.length;i++)
				{
					player_socket_array[i] = data[i].id;
	
				}
			}); 
			
			
	
	
	//creates plane 
	//make_plane();
	
		// Create Light
		ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);
		light = new THREE.PointLight(0xffffff, 0.8, 18);
		light.position.set(3,6,-3);
		light.castShadow = true;
		// Will not light anything closer than 0.1 units or further than 25 units
		light.shadow.camera.near = 0.1;
		light.shadow.camera.far = 25;
		scene.add(light);
	
	//Setup THREE Camera Position
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	
	//Create OpenGlRender
	var canvas = document.getElementById("canvas");
	document.body.appendChild(canvas);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);
	// Enable Shadows in the Renderer
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	canvas.appendChild(renderer.domElement);
	
	
	
	//Call animate function
	animate();
}



var time_last_run;
function send_player_position_via_socket()
{
	socket.on('playerlist',function(data)
			{
				console.log(data);
				for(var i=0; i<data.length;i++)
				{
				if(data[i].id!=socket_id)
				{
					//console.log("prawda");
				 
				}
				else{
					var data = 
				{
					
				x: three_shapes[i].position.x,
				y: three_shapes[i].position.y,
				z: three_shapes[i].position.z,
				z: three_shapes[i].position.z,
				}
				socket.emit('update',data);
	
				}
				} 

	
				
			}); 
		
}
function animate(){
	//send player list
			
	//animate Cube position+ it rigidbody
	
	/*console.log("x:"+bodys[i].position.x);
	console.log("y:"+bodys[i].position.y);
	console.log("z:"+bodys[i].position.z);*/
	
	
	
	//send_player_position_via_socket();
				
	three_shape.position.x = body.position.x;
					three_shape.position.y = body.position.y;
					three_shape.position.z = body.position.z;
					three_shape.quaternion.x = body.quaternion.x;
					three_shape.quaternion.y = body.quaternion.y;
					three_shape.quaternion.z = body.quaternion.z;
					three_shape.quaternion.w = body.quaternion.w;
					var data={
				x: body.position.x,
				y: body.position.y,
				z: body.position.z,
				rot_x: body.quaternion.x,
				rot_y: body.quaternion.y,
				rot_z: body.quaternion.z,
				rot_w: body.quaternion.w,
				}
				socket.emit('update',data);
	camera.position.set(camera.position.x, three_shape.position.y+28, camera.position.z);
	camera.lookAt(new THREE.Vector3(three_shape.position.x,three_shape.position.y,three_shape.position.z));
	
	



	//Setup Rigidbody animation time
	var delta, now = (new Date()).getTime(),
        i;
    
    if ( time_last_run ) {
        delta = ( now - time_last_run ) / 1000;
    } else {
        delta = 1 / 60;
    }
    time_last_run = now; 
	world.step( delta * 0.2 );
	
	
	//console.log(velocity_y);
	requestAnimationFrame(animate);
	//cube.position.x +=0.01;
	//cube.position.z +=0.01;
	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;
	/*
				var x = camera.position.x;
				var y = camera.position.y;
				var z = camera.position.z;
				var r_x = camera.rotation.x;
				var r_y = camera.rotation.y;
				document.getElementById("cam_coordinates").innerHTML = "x: "+x+"y: "+y+"z: "+z+" rotation x:"+r_x+" rotation y:"+r_y;
				
				*/
				
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	if(keyboard[69]){ // q key
		/*camera.position.y += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
		*/
		bodys[0].position.x+=0.1;
	}
	if(keyboard[81]){ // e key
		/*camera.position.y -= Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
		*/
		body.position.x-=0.1;
	}
	if(keyboard[37]){ // left arrow key
		//camera.rotation.y -= player.turnSpeed;
		var velocity = body.velocity;

		velocity.x += movment_speed;
		
				
	}
	if(keyboard[39]){ // right arrow key
		//camera.rotation.y += player.turnSpeed;
		var velocity = body.velocity;

		velocity.x -= movment_speed;
		
	}
	if(keyboard[38]){ // up arrow key
		//camera.rotation.x += player.turnSpeed;
		var velocity = body.velocity;

		velocity.z += movment_speed;
		
	}
	if(keyboard[40]){ // down arrow key
		//camera.rotation.x -= player.turnSpeed;
		var velocity = body.velocity;

		velocity.z -=movment_speed;
		
	}
	
	renderer.render(scene, camera);
}


function keyDown(event){
	keyboard[event.keyCode] = true;
}


function keyUp(event){
	keyboard[event.keyCode] = false;
}

function first_perspective()
{
	camera.position.x = 18.59;
	camera.position.y = 28.8;
	camera.position.z = -38;
	camera.rotation.x = -8.722;
	camera.rotation.y = -18.53;
}
function second_perspective()
{
	camera.position.x = 2.5;
	camera.position.y = 7;
	camera.position.z = -2.8;
	camera.rotation.x = -2.3;
	camera.rotation.y = 0;
}
function third_perspective()
{
	camera.position.x = 2.5;
	camera.position.y = 4.4;
	camera.position.z = 2.8;
	camera.rotation.x = -1.53;
	camera.rotation.y = 0;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

init();