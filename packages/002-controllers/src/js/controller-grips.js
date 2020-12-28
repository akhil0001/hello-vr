import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const {XRControllerModelFactory} =  require('three/examples/jsm/webxr/XRControllerModelFactory');

function getControllerGrip(renderer,scene){
    // const loader = new GLTFLoader();
    // loader.load(
    //     'scene.gltf',
    //     function(gltf){
    //     },
        
    //     function(err){
    //         console.log(err);
    //     }
    // )
    const controllerModelFactory = new XRControllerModelFactory();//wutt;
    const controllerGrip = renderer.xr.getControllerGrip(0);
    controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
    return controllerGrip;
}

export default getControllerGrip;