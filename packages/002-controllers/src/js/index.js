const THREE = require('three');
const {
    VRButton
} = require('three/examples/jsm/webxr/VRButton');
import {
    BoxLineGeometry
} from 'three/examples/jsm/geometries/BoxLineGeometry';
import getControllers from './controllers';
import getControllerGrip from './controller-grips';

let renderer = null;
let scene = null;
let camera = null;
let room = null;
let controller = null;

const clock = new THREE.Clock();

function init() {
    const canvasContainer = document.getElementById('canvas-container');
    const body = document.body;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = getCamera();

    scene.add(createRoom());
    scene.add(camera);

    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasContainer
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;


    controller = getControllers(renderer,onSelectStart,onSelectEnd);
    const controllerGrip = getControllerGrip(renderer, scene);
    scene.add(controller);
    scene.add(controllerGrip);
    body.appendChild(VRButton.createButton(renderer));
}


function createRoom() {
    room = new THREE.LineSegments(new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0), new THREE.LineBasicMaterial({
        color: 0x808080
    }));

    return room;
}

function getCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 10);
    camera.position.set(0, 1.6, 3);
    return camera;
}

function onSelectStart(){
    this.userData.isSelecting = true;
}

function onSelectEnd() {
    this.userData.isSelecting = false;
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    if(controller.userData.isSelecting === true){
        const cubeGeom = new THREE.BoxBufferGeometry(0.15,0.15,0.15);
        const cubeMaterial = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
        const cube = new THREE.Mesh(cubeGeom,cubeMaterial);
        cube.position.copy(controller.position);

        room.add(cube);
    }
    renderer.render(scene, camera);
}

init();
animate();