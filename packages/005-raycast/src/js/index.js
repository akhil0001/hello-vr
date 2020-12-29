const THREE = require('three');
import {
    VRButton
} from 'three/examples/jsm/webxr/VRButton.js';
const {
    getWindowSize,
    getControllers,
    getCanvasContainer,
    initRenderer,
    addRandomCubes
} = require('../../../utils');

let globals = {};

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
    globals['controller'] = controllerOne;

    const cubes = addRandomCubes(scene, 100);

    globals.cubes = cubes;

    document.body.appendChild(VRButton.createButton(renderer));

    //raycast 
    const tempMatrix = new THREE.Matrix4();
    globals.tempMatrix = tempMatrix;

    const raycaster = new THREE.Raycaster();
    globals.raycaster = raycaster;
    globals.INTERSECTED  = null;
}

function update() {
    const {
        scene,
        camera,
        renderer,
        tempMatrix,
        raycaster,
        controller,
        cubes,
    } = globals;
    let {INTERSECTED} = globals;

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const intersects = raycaster.intersectObjects(cubes);
    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = undefined;

    }
    globals.INTERSECTED = INTERSECTED;
    renderer.render(scene, camera);
}

function onControllerSelectStart() {
    console.log('select start');
}

function onControllerSelectEnd() {
    console.log('select end');
}

window.addEventListener('load', init);