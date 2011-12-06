if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, scene, renderer;
var cameraCube, sceneCube;

var mesh, zmesh, lightMesh, geometry;
var spheres = [];

var blowing = false;

var directionalLight, pointLight, ambientLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

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

	var geometry = new THREE.SphereGeometry( 100, 32, 16 );

	var path = "textures/cube/Park2/";
	var format = '.jpg';
	var urls = [
			path + 'posx' + format, path + 'negx' + format,
			path + 'posy' + format, path + 'negy' + format,
			path + 'posz' + format, path + 'negz' + format
		];


	var textureCube = THREE.ImageUtils.loadTextureCube( urls );

	var shader = THREE.ShaderUtils.lib[ "fresnel" ];
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "tCube" ].texture = textureCube;

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

	scene.matrixAutoUpdate = false;

	// Skybox

	var shader = THREE.ShaderUtils.lib[ "cube" ];
	shader.uniforms[ "tCube" ].texture = textureCube;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms

	} ),

	mesh = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000 ), material );
	mesh.flipSided = true;
	sceneCube.add( mesh );

	//

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );

}

function onDocumentMouseMove(event) {

	mouseX = ( event.clientX - windowHalfX ) * 10;
	mouseY = ( event.clientY - windowHalfY ) * 10;

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}


function pop() {
	spheres.pop().position.z = -10000000;
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
				// if (i==0) console.log('still scaling', sphere.position.z, sphere.originalZ);
				sphere.scale.x = sphere.scale.y = sphere.scale.z -= ((0 - sphere.scale.x) / 40);
			}
			
			if (sphere.position.z < sphere.originalZ) {
				// if (i==0) console.log('still zing', sphere.position.z, sphere.originalZ);
				// sphere.position.z -= 100 * Math.sin( sphere.position.z );
			}
		}

	}
	
	// cubeTarget.x = -500000;

	renderer.clear();
	renderer.render( sceneCube, cameraCube );
	renderer.render( scene, camera );

}