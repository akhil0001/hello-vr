const THREE = require('three');
import {
    BoxLineGeometry
} from 'three/examples/jsm/geometries/BoxLineGeometry';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import getControllerGrip from '../../../002-controllers/src/js/controller-grips';
import getControllers from './controllers';

let scene = null,
    camera = null,
    renderer = null,
    room = null,
    controller = null,
    objects= [],
    positionX = 0,
    positionY = 0;

    const clock = new THREE.Clock();
function init() {
    const canvasContainer = document.getElementById('canvas-container');

    scene = new THREE.Scene();
    camera = getCamera();
    room = createRoom();

    scene.add(room);
    const pointLight = new THREE.AmbientLight({color: new THREE.Color(0xf0ff0f)})

    scene.add(pointLight);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasContainer
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
window.renderer = renderer;
    controller = getControllers(renderer,onControllerSelectStart,onControllerSelectEnd);

    const controllerGrip = getControllerGrip(renderer);

    scene.add(controller);
    scene.add(controllerGrip);
    document.body.appendChild(VRButton.createButton(renderer))

    animate();
}

function animate() {
    renderer.setAnimationLoop(render);
}

function createRoom() {
    const room = new THREE.LineSegments(new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0), new THREE.LineBasicMaterial({
        color: 0x808080
    }));

    return room;
}

function render() {
    const delta = clock.getDelta()*60*1000;
    if (controller.userData.isSelecting) {
        const cubeGeom = new THREE.SphereBufferGeometry(Math.random()*0.32,Math.random()*32,Math.random()*0.32);
        const cubeMaterial = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
        const cube = new THREE.Mesh(cubeGeom,cubeMaterial);
        cube.position.copy(controller.position);
        
        objects.push(cube);
        room.add(cube);
    }
    if(controller.gamepadUpdate){
        controller.gamepadUpdate();
    }
    objects.forEach(obj => {
        obj.position.x +=positionX;
        obj.position.y +=positionY;
    })
    renderer.render(scene, camera);
}

function getCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 10);
    camera.position.set(0, 1.6, 3);
    return camera;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onControllerSelectStart() {
    this.userData.isSelecting = true;
}

function onControllerSelectEnd() {
    this.userData.isSelecting = false;
}



window.addEventListener('load', init);
window.addEventListener('resize', onWindowResize);

window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index, e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length);
  });