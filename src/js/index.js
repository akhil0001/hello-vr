const THREE = require('three');
import {VRButton} from 'three/examples/jsm/webxr/VRButton';
import {BoxLineGeometry} from 'three/examples/jsm/geometries/BoxLineGeometry';
const clock = new THREE.Clock();
let container  = null;
let renderer = null;
let scene = null;
let camera = null;
let room = null;

let cube = null;



function init() {
container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

const canvasContainer = document.getElementById('canvas-container');
 scene = new THREE.Scene();
scene.background = new THREE.Color(0x101010);

const aspectRatio = window.innerWidth/window.innerHeight ; 

camera = new THREE.PerspectiveCamera(100,aspectRatio,0.1,10);
camera.position.set(0,1.6,3);
scene.add(camera);

room = new THREE.LineSegments(new BoxLineGeometry(6,6,6,10,10,10).translate(0,3,0), new THREE.LineBasicMaterial({color:0xA0A0A0}));

scene.add(room);

const hemisphereLight = new THREE.HemisphereLight(0x3F5AB5,0xFFFDE7);

scene.add(hemisphereLight);

const colorYellow = new THREE.Color("hsl(40, 100%, 60%)");

const cubeGeometry = new THREE.BoxGeometry(0.3,0.3,0.3);

const cubeMaterial = new THREE.MeshPhongMaterial({
    color: colorYellow,
    shininess:80
});

 cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

cube.translateY(1);

scene.add(cube);


const colorLight = new THREE.Color("hsl(41, 100%, 95%)");

const light = new THREE.PointLight(colorLight,2);
light.position.set(-40,-20,20);

const colorPink = new THREE.Color("red");


const light2 = new THREE.PointLight(colorPink,4);
light2.position.set(20,20,20);

const sphereSize = 10;
const lightHelper = new THREE.PointLightHelper(light,sphereSize);
const lightHelper2 = new THREE.PointLightHelper(light2,sphereSize);

scene.add(light);
scene.add(light2);

scene.add(lightHelper);
scene.add(lightHelper2);
// antialiasing is enabled to reduce the problems of aliasing in a sampled signal such as digital image
 renderer = new THREE.WebGLRenderer({
    antialias:true, //wutt;
    canvas: canvasContainer
});

renderer.setPixelRatio(window.devicePixelRatio) //wutt;
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding; //wutt;
renderer.xr.enabled = true;
// container.appendChild(renderer.domElement);

window.addEventListener('resize',onWindowResize,false);

document.body.appendChild(VRButton.createButton(renderer));
}

function onWindowResize() {
    camera.aspect = window.innerWidth/innerHeight;
    camera.updateProjectionMatrix(); //wutt

    renderer.setSize(window.innerWidth,window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render); //wutt. what happened to request animation frame
}

function render() {
    const delta  = clock.getDelta() * 60 //wutt? What is clock?
    cube.rotation.z += (delta)/100;
    cube.rotation.y += (delta)/60;
    renderer.render(scene,camera);
}

init();
animate();