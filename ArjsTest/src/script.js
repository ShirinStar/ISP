import './style.css'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls.js'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const canvas = document.querySelector('.webgl')

const	scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 1
scene.add(camera);


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
		antialias : true,
		alpha: true
});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//AR.JS
// setup arToolkitSource
const arToolkitSource = new THREEx.ArToolkitSource({
  sourceType : 'webcam',
  displayWidth: sizes.width,
  displayHeight: sizes.height,
});

const onResize = () =>{
  arToolkitSource.onResize()	
  arToolkitSource.copySizeTo(canvas)	
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
  }	
}

	arToolkitSource.init(function onReady(){
		onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function() {
		onResize()

    //desktop resize
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	});
	

	// setup arToolkitContext
	// create atToolkitContext
	const arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'camera_para.dat', //from https://github.com/jeromeetienne/AR.js/blob/master/data/data/camera_para.dat
		detectionMode: 'color_and_matrix'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(function onCompleted() {
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});


	// setup markerRoots
	// build markerControls
	const markerRoot = new THREE.Group();
	scene.add(markerRoot);

	let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
		type: 'pattern', 
    patternUrl: "pattern-marker.patt",
	})

  //scene content
	const geometry	= new THREE.BoxGeometry(2,2,2);
	const material	= new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	
	const mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = 0.5;
	
	markerRoot.add( mesh );



const update = () => {
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false ) {
		arToolkitContext.update( arToolkitSource.domElement )
  }
}

const render = () => {
	renderer.render( scene, camera );
}

const animate = () =>{
	requestAnimationFrame(animate);
	update();
	render();
}

animate()