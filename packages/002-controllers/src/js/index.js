const THREE = require('three');
const { VRButton } = require('three/examples/jsm/webxr/VRButton');
import {BoxLineGeometry} from 'three/examples/jsm/geometries/BoxLineGeometry';
import getControllers from './controllers';
import getControllerGrip from './controller-grips';

let renderer = null;
let scene = null;
let camera = null;
let room = null;
let controller = null;


function init() {
    const canvasContainer = document.getElementById('canvas-container');
    const body = document.body;
     scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x505050 );

    camera = getCamera();
    
    scene.add(createRoom());
    scene.add(camera);

    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

				const light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );

     renderer = new THREE.WebGLRenderer({
        antialias:true,
        canvas:canvasContainer
    });
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.xr.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
   
    // controller = renderer.xr.getController( 0 );

    // controller.addEventListener( 'connected', function ( event ) {
    //     console.log(this);
    //     this.add( buildController( event.data ) );

    // } );
    // controller.addEventListener( 'disconnected', function () {
    //     console.log(this);
    //     this.remove( this.children[ 0 ] );

    // } );
    controller = getControllers(renderer);
    const controllerGrip = getControllerGrip(renderer,scene);
    scene.add( controller );
    scene.add(controllerGrip);
    body.appendChild(VRButton.createButton(renderer));
}

function buildController( data ) {

    let geometry, material;

    switch ( data.targetRayMode ) {

        case 'tracked-pointer':

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

            material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

            return new THREE.Line( geometry, material );

        case 'gaze':

            geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );

    }

}

function createRoom() {
     room = new THREE.LineSegments(new BoxLineGeometry(6,6,6,10,10,10).translate(0,3,0), new THREE.LineBasicMaterial({color:0x808080}));
    
    return room;
}

function getCamera() {
    const aspectRatio = window.innerWidth/window.innerHeight ; 
    const camera = new THREE.PerspectiveCamera(50,aspectRatio,0.1,10);
    camera.position.set(0,1.6,3);
    return camera;
}

// function getController(renderer) {
//     const controller = renderer.xr.getController(0);

//      controller.addEventListener('selectstart',onSelectStart);

//     controller.addEventListener('selectend',onSelectStop);

//     controller.addEventListener('')

//     controller.addEventListener( 'connected', function ( event ) {

//         this.add( buildController( event.data ) );

//     } );
//     controller.addEventListener( 'disconnected', function () {

//         this.remove( this.children[ 0 ] );

//     } );

//     return controller;
// }

function onSelectStart() {
    this.userData.isSelecting = true;
    // camera.updateProjectionMatrix(); //wutt

}

function onSelectStop() {
    this.userData.isSelecting = false;
    camera.updateProjectionMatrix(); //wutt

}


function animate(){
    renderer.setAnimationLoop(render);
}

function render() {
    // if(controller.userData.isSelecting === true){
    //     room.rotation.x +=0.1;
    // }
    renderer.render(scene,camera);
}

init();
animate();