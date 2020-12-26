const THREE = require('three');
import {
    VRButton
} from 'three/examples/jsm/webxr/VRButton.js';
import {
    addRandomCubes
} from './random-cubes';
const {
    getWindowSize,
    getControllers
} = require('../../../utils');

const globals = {};

function init() {
    const scene = new THREE.Scene();
    globals.scene = scene;

    const {
        width,
        height,
        aspect
    } = getWindowSize(window);
    const canvas = getCanvasContainer('#canvas-container');

    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    camera.position.set(0, 1.6, 3);
    globals.camera = camera;

    const renderer = initRenderer(canvas, {
        width,
        height
    });
    renderer.setAnimationLoop(update);
    globals.renderer = renderer;

    const controllerOne = getControllers(renderer, onControllerSelectStart, onControllerSelectEnd);

    scene.add(controllerOne);

    const cubes = addRandomCubes(scene, 100);

    globals.cubes = cubes;

    document.body.appendChild(VRButton.createButton(renderer));

}

function update() {
    const {
        renderer,
        camera,
        scene,
        cubes
    } = globals;
    globals.scaleNum = globals.scaleNum + 0.001;
    cubes.forEach(cube => {
        cube.rotation.z += 0.001;
        cube.rotation.y += 0.0001;

    });
    renderer.render(scene, camera);

}

function getCanvasContainer(id) {
    let canvasContainer = document.querySelector(id);
    if (canvasContainer == null || canvasContainer === null) {
        canvasContainer = document.createElement('canvas');
        canvasContainer.id = id;
        document.body.appendChild(canvasContainer);
    }
    return canvasContainer;
}

function initRenderer(canvasEl, {
    width,
    height
}) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasEl
    });
    renderer.xr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    return renderer;
}

function onControllerSelectStart() {
    console.log('select start');
}

function onControllerSelectEnd() {
    console.log('select end');
}

window.addEventListener('load', init);