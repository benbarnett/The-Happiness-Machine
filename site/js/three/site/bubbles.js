if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, scene, renderer;
var cameraCube, sceneCube;

var mesh, zmesh, lightMesh, geometry, shader, uniforms, meshDay, uniformsDay;
var spheres = [];

var textureCube, textureCubeDay;

var blowing = false, day = false;

var directionalLight, pointLight, ambientLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2
var windowHalfY = window.innerHeight / 2;

var lastPop = 0,
	HIDDEN_VALUE = -10000000;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();
setTimeout(function() {
	hide();
}, 10000);

function hide() {
	$('#overlay').fadeOut(1500);
}

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 5, 100000 );
	camera.position.z = 3200;

	cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 5, 100000 );

	cubeTarget = new THREE.Vector3( 0, 0, 0 );
	
	// ambientLight = new THREE.DirectionalLight(0xff0000);
	

	scene = new THREE.Scene();
	sceneCube = new THREE.Scene();
	sceneCubeDay = new THREE.Scene();

	var geometry = new THREE.SphereGeometry( 100, 32, 16 );

	var path = "textures/cube/Park2/",
		dayPath = "textures/cube/Park2/day/";
	var format = '.jpg';
	var urls = [
			path + 'posx' + format, path + 'negx' + format,
			path + 'posy' + format, path + 'negy' + format,
			path + 'posz' + format, path + 'negz' + format
		],
		dayURLs = [
			dayPath + 'posx' + format, dayPath + 'negx' + format,
			dayPath + 'posy' + format, dayPath + 'negy' + format,
			dayPath + 'posz' + format, dayPath + 'negz' + format
		];


	textureCube = THREE.ImageUtils.loadTextureCube( urls );
	textureCubeDay = THREE.ImageUtils.loadTextureCube( dayURLs );

	shader = THREE.ShaderUtils.lib[ "fresnel" ];
	uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	uniformsDay = THREE.UniformsUtils.clone( shader.uniforms );
	
	shader.uniforms[ "tCube" ].texture = textureCubeDay;
	uniforms[ "tCube" ].texture = textureCubeDay;

	uniforms[ "tCube" ].texture = textureCube;
	// uniforms[ "tCubeDay" ].texture = textureCubeDay;

	var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms };
	var material = new THREE.ShaderMaterial( parameters );

	for ( var i = 0; i < 100; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );

		mesh.position.x = mesh.originalX = Math.random() * 10000 - 5000;
		mesh.position.y = mesh.originalY = Math.random() * 10000 - 5000;
		mesh.position.z = mesh.originalZ = Math.random() * 10000 - 5000;

		mesh.scale.x = mesh.scale.y = mesh.scale.z = mesh.originalScale = Math.random() * 8 + 0.5;

		scene.add( mesh );

		spheres.push( mesh );

	}
	
	 
	// day BUBBLES
	// uniforms[ "tCube" ].texture = textureCubeDay;
	// uniforms[ "tCubeDay" ].texture = textureCubeDay;

	
	

	scene.matrixAutoUpdate = false;

	// Skybox

	shader = THREE.ShaderUtils.lib[ "cube" ];
	shader.uniforms[ "tCube" ].texture = textureCube;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms

	} ),

	mesh = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000 ), material );
	mesh.flipSided = true;
	sceneCube.add( mesh );
	
	
	
	
	// day lol
	var shaderDay = THREE.ShaderUtils.lib[ "cube" ];
	// shaderDay.uniforms[ "tCube" ].texture = textureCubeDay;
	
	var material = new THREE.ShaderMaterial( {
	
		fragmentShader: shaderDay.fragmentShader,
		vertexShader: shaderDay.vertexShader,
		uniforms: shaderDay.uniforms
	
	} ),
	
	meshDay = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000 ), material );
	meshDay.flipSided = true;
	sceneCubeDay.add( meshDay );
	
	

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );

}

function onDocumentMouseMove(event) {

	// mouseX = ( event.clientX - windowHalfX ) * 10;
	// mouseY = ( event.clientY - windowHalfY ) * 10;

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}


function pop() {
	for (var i = 10; i >= 0; i--){
		spheres[Math.floor(Math.random() * (spheres.length-1))].position.z = HIDDEN_VALUE;
		spheres[Math.floor(Math.random() * (spheres.length-1))].lastPopDate = Date.now();
	};
	
	lastPop = Date.now();
}

function render() {

	var timer = 0.0001 * Date.now();

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( -mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	cubeTarget.x = - camera.position.x;
	cubeTarget.y = - camera.position.y;
	cubeTarget.z = - camera.position.z;

	cameraCube.lookAt( cubeTarget );

	for ( var i = 0, il = spheres.length; i < il; i ++ ) {

		var sphere = spheres[ i ];

		sphere.position.x = 5000 * Math.cos( timer + i * 5 );
		sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );
		
		if (blowing) {
			if (sphere.scale.x > 0.01) {
				sphere.scale.x = sphere.scale.y = sphere.scale.z += ((0 - sphere.scale.x) / 40);
				// sphere.position.z += 100 * Math.sin( sphere.position.z );
			}
		}
		else {
			if (sphere.scale.x < (sphere.originalScale - 0.1)) {
				sphere.scale.x = sphere.scale.y = sphere.scale.z -= ((0 - sphere.scale.x) / 40);
			}
			
			// restore pops
			if (sphere.position.z == HIDDEN_VALUE) {
				// console.log(Date.now() - sphere.lastPopDate, sphere.lastPopDate);
				var lastPop = sphere.lastPopDate || -50000000;
				
				if (Date.now() - lastPop >= 6000) {
					sphere.position.z = sphere.originalZ;
					sphere.lastPopDate = -5000;
				}
			}
		}

	}
	
	if (day) {
		shader.uniforms[ "tCube" ].texture = textureCubeDay;
		uniforms[ "tCube" ].texture = textureCubeDay;
	}
	else {
		shader.uniforms[ "tCube" ].texture = textureCube;
		uniforms[ "tCube" ].texture = textureCube;
	}
	
	
	// cubeTarget.x = -500000;

	renderer.clear();
	renderer.render( sceneCube, cameraCube );
	// renderer.render(sceneCubeDay, cameraCube);
	renderer.render( scene, camera );

}




// ARDUINO BINDINGS
var currentEvent = "";

$('body').bind('arduino', function(event, msg) {
	// console.log(msg.data);
	
	var data = msg.data;
	
	if (data == "[") {
		currentEvent = "";
	}
	else if (data == "]") {
		currentEvent += "";
		processEvent(currentEvent);
	}
	else {
		currentEvent += data;
	}
	
});


function processEvent(data) {
	// console.log(data[0]);
	
	
	var array = data.split(',');
	// console.log(array);
	
	var eventType = array[0],
		eventMap = {
			
			// DUCK
			9: function(value) {
				// console.log(value);
				if (value[1] == 1) pop();
			},
			
			// WINDMILL
			1: function(value) {
				if (value[1] == 1) {
					console.log('mic on');
					blowing = true;
					setTimeout(function() {
						blowing = false;
					}, 2000);
				}
				// else {
				// 					blowing = false;
				// 				}
			},
			
			// GLOBE
			2: function(x, y, z) {
				
					
				var	newMouseX = mouseX + ((x > 45) ? 500 : -500),
					newMouseY = mouseY + ((y > 45) ? 500 : -500);
					
				if (newMouseX > maxX) newMouseX = minX;
				if (newMouseY > maxY) newMouseY = minY;
				
				if (newMouseX < minX) newMouseX = maxX;
				if (newMouseY < minY) newMouseY = maxY;
			},
			
			// TEDDY
			5: function(value) {
				if (value[1] == 1) {
					day = false;
				}
				else {
					day = true;
				}
			},
			
			// CHAIR
			6: function(value) {
				// startup
				if (value[1] == 1) {
					hide();
				}
			}
		};
		
	// if (eventType == 0) console.log(data);
	
	if (eventMap[eventType]) eventMap[eventType](array);
}